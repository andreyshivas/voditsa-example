<template>
  <div>
    <div class="catalogPage" v-if="pageData.story.content.component === 'category'">
      <CatalogPageHeader :parents="parentsPages" :info="pageData" />

      <Catalog :products="products" :currentPage="+currentPage" :totalPages="+totalPages" :totalProducts="+totalProducts" />
    </div>

    <ProductPage v-if="pageData.story.content.component === 'product'" :info="{parentsPages, pageData}" />
  </div>
</template>

<script>
import meta from "~/helpers/meta";
import { loadProducts } from "~/helpers/loadProducts";

export default {
  head() {
    const title = this.pageData.story.content.component === 'product' ? `${this.pageData.story.content.title} ${this.pageData.story.content.description} - voditsa.by` : `${this.pageData.story.content.title}.  Интернет-магазин корейской косметики, купить корейскую косметику в Минске - Voditsa.by`;
    const description = this.pageData.story.content.component === 'product' ? `Купить ${this.pageData.story.content.description} ${this.pageData.story.content.title} в интернет-магазине корейской косметики voditsa.by.  Популярные бренды корейской косметики. ⭐ Выгодные цены. ⭐ Скидки и акции. ✔️ Доставка по Минску и Беларуси.` : `Купить косметику в категории ${this.pageData.story.content.title} в интернет-магазине корейской косметики voditsa.by.  Популярные бренды корейской косметики. ⭐ Выгодные цены. ⭐ Скидки и акции. ✔️ Доставка по Минску и Беларуси.`;
    const image = this.pageData.story.content.component === 'product' ? this.pageData.story.content.image?.filename : null;
    return meta({
      title: title,
      description: description,
    }, image, this);
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

    try {
      const pageData = await context.app.$storyapi.get(`cdn/stories/${path}`, {
        version: "published",
        cv: cache,
        resolve_relations: 'brand',
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
    } catch (res) {
      if (!res.response) {
        console.error(res)
        context.error({ statusCode: 404, message: 'Failed to receive content form api' })
      } else {
        console.error(res.response.data)
        context.error({ statusCode: res.response.status, message: res.response.data })
      }
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
