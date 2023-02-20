<template>
  <div class="productsFavorite" >
    <div class="productsFavorite__empty" v-if="products !== null && products.length === 0">
      <div class="productsFavorite__empty-text">
        У вас нет избранных товаров
      </div>
      <nuxt-link to="/catalog" class="button">Перейти в каталог</nuxt-link>
    </div>

    <div class="productsFavorite__wrapper" v-if="products !== null && products.length">
      <div class="productsFavorite__item" v-for="product in products" :key="product.uuid" >
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: null,
    }
  },
  watch: {
    userProfile() {
      if (this.userProfile) {
        this.getProducts();
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
  },
  methods: {
    async getProducts() {
      let cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);

      const info = await this.$storyapi.get(`cdn/stories/`, {
        version: 'published',
        cv: cache,
        excluding_fields: 'text,meta,body',
        sort_by: 'first_published_at:desc',
        per_page: 100,
        resolve_relations: "brand",
        filter_query: {
          component: {
            in: 'product',
          }
        },
        by_uuids_ordered: this.userProfile.favorites ? this.userProfile.favorites.join(',') : '',
      })

      if (this.userProfile.favorites && this.userProfile.favorites.length) {
        this.products = info.data.stories;
      }

      if (this.userProfile.favorites && this.userProfile.favorites.length === 0) {
        this.products = [];
      }
    },
  },
  async fetch() {
    await this.getProducts()
  },
}
</script>

<style lang="scss">
.productsFavorite {
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    row-gap: 60px;

    @media screen and (max-width: 767px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      row-gap: 20px;
    }
  }

  &__empty {
    padding: 15px;
    background: #f2f2f2;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    @media screen and (max-width: 640px) {
      display: block;
      text-align: center;
    }
  }

  &__empty-text {
    margin-right: 15px;

    @media screen and (max-width: 640px) {
      margin: 0 auto 15px;
    }
  }

}
</style>t
