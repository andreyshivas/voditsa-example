<template>
  <div class="relatedProducts" v-if="info.stories">
    <div class="container">
      <h2 class="relatedProducts__title">
        Похожие товары
      </h2>
    </div>

    <div class="relatedProducts__wrapper">
      <div class="relatedProducts__item" v-for="product in info.stories" :key="product.uuid" >
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    productInfo: {
      type: Object,
      required: false
    },
  },
  data() {
    return {
      info: {
        stories: [],
        rels: []
      }
    }
  },
  methods: {
    async getProducts() {
      let cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);

      const starts_with = this.productInfo.full_slug.replace(this.productInfo.slug, '').replace(/\/$/, '');

      const info = await this.$storyapi.get(`cdn/stories/`, {
        version: 'published',
        cv: cache,
        starts_with: starts_with,
        excluding_fields: 'text,meta,body',
        sort_by: 'first_published_at:desc',
        per_page: 4,
        excluding_ids: this.productInfo.id,
        filter_query: {
          component: {
            in: 'product',
          },
        }
      })

      this.info = info.data
    },
  },
  async fetch() {
    await this.getProducts()
  },
}
</script>

<style lang="scss">
.relatedProducts {
  padding: 30px 0 60px;

  @media screen and (max-width: 767px) {
    padding: 30px 0;
  }

  .productCard {
    @media screen and (max-width: 767px) {
      min-width: 180px;
    }
  }

  &__title {
    font-size: 28px;
    line-height: 32px;
    margin-bottom: 28px;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    max-width: 1250px;
    padding: 0 25px;
    margin: 0 auto;

    @media screen and (max-width: 767px) {
      display: flex;
      white-space: nowrap;
      overflow: auto;
      padding: 0;
    }
  }

  &__item {
    padding: 0 15px;

    .productCard {
      height: 100%;
    }

    @media screen and (max-width: 767px) {
      padding: 0 8px;

      &:first-child {
        padding-left: 15px;
      }

      &:last-child {
        padding-right: 15px;
      }
    }
  }
}
</style>t
