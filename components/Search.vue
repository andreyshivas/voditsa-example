<template>
  <div class="search" :class="`${this.$store.state.isActiveSearch ? 'search--active' : ''} ${results ? 'search--has-results' : ''}`">
    <!-- <div class="search__overflow" @click="closeSearch"></div> -->
    <div class="search__wrapper">
      <div class="search__form-wrapper">
        <div class="container">
          <form class="search__form" action="" method="post" @submit.prevent="searchProducts">
            <input type="search" ref="input" class="search__input" v-model="searchQuery" name="search" autocomplete="search" :class="firstInput ? '' : 'show-error'" :required="true">
            <button type="button" @click="resetSearch" class="search__close"></button>
          </form>
        </div>
      </div>
      <div class="search__results" v-if="results">
        <div class="container">
          <h3 v-if="results && results.length === 0">Товаров не найдено</h3>
          <div v-if="results && results.length > 0" class="search__results-wrapper">
            <div class="search__result" v-for="result in results" :key="result.uuid" >
              <ProductCard :product="result" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      results: null,
      firstInput: true,
      isLoading: false,
    }
  },
  watch: {
    query(newQuery) {
      if (newQuery.length > 1) {
        this.searchProducts();
      } else {
        this.results = null;
      }
    },
    $route() {
      if (this.$store.state.isActiveSearch) {
        this.$store.commit("setSearchState", false);
      }
    },
  },
  computed: {
    query() {
      return this.searchQuery;
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.input.focus();
    }, 200);
  },
  methods: {
    async searchProducts() {
      console.log('searchProducts ', this.query);
      const query = this.query;

      this.isLoading = true;
      const cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);

      const products = await this.$storyapi.get(`cdn/stories/`, {
        version: 'published',
        cv: cache,
        is_startpage: false,
        filter_query: {
          component: {
            in: 'product'
          },
        },
        excluding_fields: 'text,meta,body',
        sort_by: 'first_published_at:desc',
        search_term: query,
        per_page: 100,
        page: 1
      });

      this.isLoading = false;
      this.results = products.data.stories;
      this.firstInput = false;
    },
    closeSearch() {
      this.$store.commit("setSearchState", false);
    },
    resetSearch() {
      this.$store.commit("setSearchState", false);
    },
  }
}
</script>

<style lang="scss">
.search {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 4px 7px rgba(#000, 0.03);
  opacity: 0;
  visibility: hidden;
  background: #fff;

  &--has-results {
    height: 100%;
  }

  &--active {
    opacity: 1;
    visibility: visible;
  }

  &__wrapper {
    position: relative;
    z-index: 9999;
    height: 100%;
  }

  &__form-wrapper {
    position: absolute;
    z-index: 9999;
    top: 0;
    left: 0;
    padding: 15px 0;
    background: #fff;
    width: 100%;

    @media screen and (max-width: 767px) {
      padding: 5px 0;
    }
  }

  &__form {
    position: relative;
  }

  &__input {
    display: block;
    font-size: 16px;
    line-height: 20px;
    color: #212121;
    border: 1px solid #bababa;
    border-radius: 0;
    box-shadow: none;
    background: #fff;
    appearance: none;
    outline: none;
    padding: 12px 16px;
    border-radius: 0;
    min-height: 50px;
    max-width: 100%;
    width: 100%;
    transition: color 0.2s ease, border-color 0.2s ease;

    &:focus,
    &:hover {
      color: #000;
      border: 1px solid #000;
    }

    &:read-only {
      background: #f5f5f5;
      border: 1px solid #bababa;
      color: #212121;
    }

    &:invalid {
      .show-error & {
        border: 1px solid var(--color-error);
      }
    }
  }

  &__close {
    position: absolute;
    right: 1px;
    top: 1px;
    width: 48px;
    height: 48px;
    background-color: #fff;
    background-image: url('/images/ico-close.svg');
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    padding: 0;
    border: 0;
    box-shadow: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-main);
    }
  }

  &__results {
    padding: 20px 0 40px;
    padding-top: 110px;
    height: 100%;
    overflow-y: auto;
    background: #fff;
    overscroll-behavior: contain;
    box-shadow: 0 4px 7px rgba(#000, 0.03);

    /* Works on Firefox */
    scrollbar-width: thin;
    scrollbar-color: #212121 #f2f4f8;

    /* Works on Chrome, Edge, and Safari */
    &::-webkit-scrollbar {
      width: 4px;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f2f4f8;
      border-radius: 20px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #212121;
      border-radius: 20px;
      border: 0;
    }

    @media screen and (max-width: 767px) {
      padding-top: 80px;
    }
  }

  &__results-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;

    @media screen and (max-width: 1023px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      row-gap: 20px;
    }

    @media screen and (max-width: 767px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      row-gap: 20px;
    }
  }
}
</style>
