<template>
  <div class="catalog">
    <div class="container">
      <div class="catalog__wrapper">
        <div class="catalog__filters">
          <!-- <FilterCategories /> -->

          <div class="catalog__filters-top">
            <button type="button" class="catalog__categories-button button button--transparent" @click="isActiveCategories = true">Категории</button>
            <button type="button" class="catalog__filters-button button" @click="isActiveFilter = true">Фильтр</button>
          </div>
          <Filters :isActive="isActiveFilter" @closeFilter="closeFilter" :brands="brands" :filters="filters" :totalProducts="totalProducts" />
          <CategoriesMobile :isActive="isActiveCategories" @closeCategories="closeCategories" />
        </div>

        <div class="catalog__cards">
          <div class="catalog__cards-top">
            <div class="catalog__active-filters">
              <ActiveFilters :brands="brands" :filters="filters" :totalProducts="totalProducts" />
            </div>

            <div class="catalog__sort">
              <select class="catalog__sort-select" name="sort" v-model="sort" @change="setSort">
                <option value="first_published_at:desc">Сначала новые</option>
                <option value="first_published_at:asc">Сначала старые</option>
                <option value="content.price:desc:float">По убыванию цены</option>
                <option value="content.price:asc:float">По возрастанию цены</option>
              </select>
            </div>
          </div>

          <div class="catalog__list" v-if="products && products.length">
            <ProductCard :product="product" v-for="product in products" :key="product.uuid" />
          </div>

          <div class="catalog__empty" v-if="products && products.length === 0">
            <h3>Продуктов не найдено</h3>
          </div>

          <Pagination v-if="totalPages > 1" :current="currentPage" :total="totalPages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: [Array, Boolean],
      required: false,
    },
    currentPage: {
      type: Number,
      required: false,
    },
    totalProducts: {
      type: Number,
      required: false,
    },
    totalPages: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      isActiveFilter: false,
      isActiveCategories: false,
      sort: this.$route.query.sort ? this.$route.query.sort : 'first_published_at:desc',
      filters: [],
      brands: [],
    }
  },
  watch: {
    $route() {
      this.updateSort();
    },
  },
  created() {
    this.getFilters();
  },
  methods: {
    closeFilter() {
      this.isActiveFilter = false;
    },
    closeCategories() {
      this.isActiveCategories = false;
    },
    setSort() {
      const query = Object.assign({}, this.$route.query);
      query.sort = this.sort;
      this.$router.push({ query: query });
    },
    updateSort() {
      const sort = this.$route.query.sort;
      if (sort !== 'first_published_at:desc' && sort !== 'first_published_at:asc' && sort !== 'content.price:desc:float' && sort !== 'content.price:asc:float') {
        this.sort = 'first_published_at:desc';
      } else {
        this.sort = sort;
      }
    },
    route() {
      return this.$route;
    },
    async getFilters() {
      const path = this.$route.path;
      const cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);

      const allFilters = await this.$axios.post(`/api/filters`, {
        cache: cache,
        starts_with: path.substr(1),
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

      this.brands = brands;
      this.filters = filters;
    }
  },
}
</script>

<style lang="scss">
.catalog {
  &__wrapper {
    display: grid;
    grid-template-columns: 2fr 8fr;
    gap: 30px;

    @media screen and (max-width: 767px) {
      display: block;
    }
  }

  &__list {
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

  &__filters-button {
    display: flex;
    width: 50%;
    padding-top: 13px;
    padding-bottom: 13px;

    @media screen and (min-width: 768px) {
      display: none;
    }
  }

  &__empty {
    padding: 40px 0;
    text-align: center;
  }

  &__active-filters {
    margin-bottom: 20px;
  }

  &__cards-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    @media screen and (max-width: 767px) {
      margin: 0;
    }
  }

  &__filters-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  &__sort {
    max-width: 50%;

    @media screen and (max-width: 767px) {
      display: none;
    }
  }

  &__sort-select {
    display: block;
    height: 50px;
    border: 2px solid #000;
    border-radius: 4px;
    padding: 0 20px;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    text-overflow: ellipsis;
    appearance: none;
    background: transparent;
    max-width: 100%;
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    // background: url('/images/ico-arrow-select.svg') no-repeat right center;
  }
}
</style>
