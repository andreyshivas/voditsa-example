<template>
  <div>
    <div class="catalogPage">
      <CatalogPageHeader :parents="[]" :info="pageData" />
      <Catalog :products="products" :currentPage="+currentPage" :totalPages="+totalPages" :totalProducts="+totalProducts" />
    </div>
  </div>
</template>

<script>
import meta from "~/helpers/meta";
import { loadProducts } from "~/helpers/loadProducts";

export default {
  head() {
    return meta({
      title: `Каталог. Интернет-магазин корейской косметики, купить корейскую косметику в Минске - Voditsa.by`,
      description: `Каталог косметики интернет-магазина корейской косметики voditsa.by. Купить косметику в интернет-магазине Voditsa. ❤️ Популярные бренды корейской косметики. ⭐ Выгодные цены. ⭐ Скидки и акции. ✔️ Доставка по Минску и Беларуси.`,
    }, null, this);
  },
  data() {
    return {
      parentsPages: [],
      pageData: [],
      products: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
    }
  },
  watch: {
    $route() {
      this.getProducts();
    },
  },
  computed: {
    route() {
      return this.$route.query;
    },
  },
  methods: {
    async getProducts() {
      const path = this.$route.path;
      const cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);
      const query = this.$route.query;


      const productsInfo = await loadProducts(path.substr(1), cache, query, this.$storyapi);

      this.products = productsInfo.products;
      this.currentPage = productsInfo.currentPage;
      this.totalPages = productsInfo.totalPages;
      this.totalProducts = productsInfo.totalProducts;
    },
  },
  async asyncData (context) {
    const path = context.route.path;
    const query = context.route.query;
    const cache = context.store.state.cacheVersion ? context.store.state.cacheVersion : Math.floor(Date.now() / 1e3);
    const pageData = await context.app.$storyapi.get(`cdn/stories/${path}`, {
      version: "published",
      cv: cache,
    });

    /// Хлебные крошки
    const fullSlug = pageData.data.story.full_slug;
    const params = fullSlug.split('/');

    let parentFullSlug = '';
    let parentsSlugs = [];

    params.forEach((item, index) => {
      parentFullSlug = `${parentFullSlug}${item}`;

      if (index === 0) {
        parentFullSlug = `${item}`;
      }
      if (params[index + 1] || params[index + 1] === '') {
        parentFullSlug = `${parentFullSlug}/`;
      }

      if (params[index + 1] !== '') {
        parentsSlugs.push(parentFullSlug);
      }
    });

    parentsSlugs.pop();
    parentsSlugs = parentsSlugs.join(',');

    const parentsPages = await context.app.$storyapi.get(`cdn/stories/`, {
      version: "published",
      cv: cache,
      by_slugs: parentsSlugs,
      excluding_fields: '_editable'
    });

    const productsInfo = await loadProducts(path.substr(1), cache, query, context.app.$storyapi);

    return {
      parentsPages: parentsPages.data.stories,
      pageData: pageData.data,
      ...productsInfo,
    }
  }
}
</script>

<style lang="scss">
.catalogPage {
  padding: 40px 0;

  @media screen and (max-width: 767px) {
    padding: 0 0 40px;
  }
}
</style>
