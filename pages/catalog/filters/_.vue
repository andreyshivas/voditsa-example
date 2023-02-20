<template>
  <div>
    <div class="catalogPage">
      <CatalogPageHeader :parents="[]" :info="pageData" />

      <Catalog :products="products" :currentPage="+currentPage" :totalPages="+totalPages" :totalProducts="+totalProducts" :brands="brands" :filters="filters" />
    </div>
  </div>
</template>

<script>
import meta from "~/helpers/meta";

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
      totalProducts: 1,
      brands: [],
      filters: [],
      allFilters: [],
    }
  },
  watch: {
    $route() {
      this.getProducts();
    },
  },
  // watchQuery: true,
  computed: {
    route() {
      return this.$route.query;
    },
  },
  methods: {
    getFiltersIds(slugs) {
      let filtersIds = [];
      slugs.split(',').forEach((slug) => {
        this.allFilters.forEach((item) => {
          if (item.slug === slug) {
            filtersIds.push(item.uuid);
          }
        })
      });

      return filtersIds.join(',');
    },
    async getProducts() {
      let cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);
      const query = this.$route.query;
      const filtersObject = {};
      const page = query.page ? query.page : 1;
      const sort = query.sort ? query.sort : 'first_published_at:desc';
      const filterParams = this.$route.params.pathMatch.split('/');

      for (let key in query) {
        const value = key.split('-').join('_');
        if (value === 'brand') {
          filtersObject[value] = {
            in: this.getFiltersIds(query[key])
          };
        } else if (value !== 'page' && value !== 'sort') {
          filtersObject[value] = {
            any_in_array: this.getFiltersIds(query[key])
          };
        }
      }

      if (filterParams[0] && filterParams[1]) {
        const value = filterParams[0].split('-').join('_');
        filtersObject[value] = {
          any_in_array: getFiltersIds(filterParams[1])
        };
      }

      const fetchOptions = {
        starts_with: 'catalog/',
        filter_query: {
          component: {
            in: 'product',
          },
          ...filtersObject,
        }
      }

      const info = await this.$storyapi.get(`cdn/stories/`, {
        version: 'published',
        cv: cache,
        sort_by: sort,
        excluding_fields: 'text,meta,body',
        per_page: 12,
        page: page,
        ...fetchOptions,
      })

      this.products = info.data.stories;
      this.currentPage = page;
      this.totalPages = Math.ceil(info.total / info.perPage);
      this.totalProducts = info.total;
    },
  },
  async asyncData (context) {
    const path = context.route.path.replace('/catalog', '');
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

    //// Фильтры


    const allFilters = await context.app.$axios.post(`/api/filters`, {
      cache: cache,
    });

    const brands = [];
    const filters = [];

    if (allFilters.data) {
      allFilters.data.forEach((filter) => {
        if (filter.content.component === 'brand') {
          brands.push(filter);
        } else {
          filters.push(filter);
        }
      });
    }

    /// Продукты
    const query = context.route.query;
    const filtersObject = {};
    const page = query.page ? query.page : 1;
    const sort = query.sort ? query.sort : 'first_published_at:desc';
    const filterParams = context.route.params.pathMatch.split('/');

    const getFiltersIds = (slugs) => {
      let filtersIds = [];
      slugs.split(',').forEach((slug) => {
        allFilters.data.forEach((item) => {
          if (item.slug === slug) {
            filtersIds.push(item.uuid);
          }
        })
      });

      return filtersIds.join(',');
    };

    for (let key in query) {
      const value = key.split('-').join('_');
      if (value === 'brand') {
        filtersObject[value] = {
          in: getFiltersIds(query[key])
        };
      } else if (value !== 'page' && value !== 'sort') {
        filtersObject[value] = {
          any_in_array: getFiltersIds(query[key])
        };
      }
    }

    if (filterParams[0] && filterParams[1]) {
      const value = filterParams[0].split('-').join('_');
      filtersObject[value] = {
        any_in_array: getFiltersIds(filterParams[1])
      };
    }

    const fetchOptions = {
      starts_with: 'catalog/',
      filter_query: {
        component: {
          in: 'product',
        },
        ...filtersObject,
      }
    }

    const products = await context.app.$storyapi.get(`cdn/stories/`, {
      version: 'published',
      cv: cache,
      sort_by: sort,
      excluding_fields: 'text,meta,body',
      per_page: 12,
      page: page,
      ...fetchOptions,
    })

    return {
      parentsPages: parentsPages.data.stories,
      pageData: pageData.data,
      products: products.data.stories,
      currentPage: page,
      totalProducts: products.total,
      totalPages: Math.ceil(products.total / products.perPage),
      brands: brands,
      filters: filters,
      allFilters: allFilters.data,
    }
  }
}
</script>

<style lang="scss">
.catalogPage {
  padding: 40px 0;

  @media screen and (max-width: 767px) {
    padding: 20px 0 40px;
  }
}
</style>
