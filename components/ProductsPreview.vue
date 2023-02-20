<template>
  <div class="productsPreview" v-if="products.length">
    <div class="container">
      <h2 class="productsPreview__title">
        <template v-if="title">{{title}}</template>
        <nuxt-link v-if="link" :to="link.url.replace(/\/$/, '')" class="productsPreview__link moreLink">
          <div class="productsPreview__link-text moreLink__text">{{link.title}}</div>
          <div class="moreLink__arrow"></div>
        </nuxt-link>
      </h2>
    </div>

    <div class="productsPreview__wrapper">
      <div class="productsPreview__item" v-for="product in products" :key="product.uuid" >
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '~/components/ProductCard.vue';

export default {
  components: {
    ProductCard,
  },
  props: {
    title: {
      type: String,
      required: false
    },
    link: {
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
  computed: {
    products() {
      const products = this.info.stories;
      const rels = this.info.rels;
      const result = products.map((product) => {
        const brandId = product.content.brand;
        const brandContent = rels.filter((brand) => {
          return brand.uuid === brandId;
        });

        if (brandContent.length) {
          product.content.brandInfo = brandContent[0];
        }

        return product;
      });

      return result;
    }
  },
  methods: {
    async getProducts() {
      let cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);

      const info = await this.$storyapi.get(`cdn/stories/`, {
        version: 'published',
        cv: cache,
        excluding_fields: 'text,meta,body',
        sort_by: 'first_published_at:desc',
        per_page: 4,
        resolve_relations: "brand",
        filter_query: {
          component: {
            in: 'product',
          }
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
.productsPreview {
  padding: 60px 0;

  @media screen and (max-width: 767px) {
    padding: 30px 0;
  }

  .productCard {
    @media screen and (max-width: 767px) {
      min-width: 180px;
    }
  }

  &__link {
    color: var(--color-text-main);
    text-decoration: none;
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
      overflow-x: auto;
      padding: 0;
      scroll-snap-type: x mandatory;
      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */

    }
  }

  &__item {
    padding: 0 15px;
    scroll-snap-align: center;

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
