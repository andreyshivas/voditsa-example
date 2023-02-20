<template>
  <div class="filters" :class="isActive ? 'active' : ''">
    <div class="filters__overflow" @click="closeFilter"></div>
    <div class="filters__wrapper">
      <div class="filters__mobile-header">
        <h4 class="filters__mobile-title">Фильтры</h4>
        <button class="filters__mobile-close" @click="closeFilter" type="button" aria-label="Закрыть фильтр"></button>
      </div>

      <div class="filters__loading" v-if="brands.length === 0 && filters.length === 0"></div>

      <div class="filters__scroller">
        <div class="filters__item" v-if="brands.length">
          <div class="filters__title">Бренды</div>

          <div class="filters__item-scroller-wrapper">
            <div class="filters__item-scroller">
              <label class="checkbox" v-for="checkbox in brands" :key="checkbox.uuid">
                <input type="checkbox" :checked="isChecked(checkbox, 'brand')" @change="setFilter(checkbox, 'brand')" name="name" :value="checkbox.slug" class="checkbox__input">
                <div class="checkbox__item"></div>
                <div class="checkbox__text">{{checkbox.content.title}}</div>
              </label>
            </div>
          </div>
        </div>
        <div class="filters__item" v-for="(filter, index) in sortedFilters" :key="index">
          <div class="filters__title">{{filter.title}}</div>

          <div class="filters__item-scroller-wrapper">
            <div class="filters__item-scroller">
              <label class="checkbox" v-for="(checkbox) in filter.items" :key="checkbox.uuid">
                <input type="checkbox" :checked="isChecked(checkbox, filter.slug)" @change="setFilter(checkbox, filter.slug)" name="name" :value="checkbox.slug" class="checkbox__input">
                <div class="checkbox__item"></div>
                <div class="checkbox__text">{{checkbox.content.title}}</div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="filters__mobile-footer">
        <button class="button button--transparent" @click="resetFilter" type="button">Очистить</button>
        <button class="button" @click="closeFilter" type="button">Показать ({{totalProducts}})</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      required: false,
    },
    brands: {
      type: Array,
      required: false,
    },
    filters: {
      type: Array,
      required: false,
    },
    totalProducts: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      info: [],
      isLoading: true,
    }
  },
  // watch: {
  //   $route() {
  //     this.getFilters();
  //   },
  // },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    sortedFilters() {
      const allFilters = this.filters;
      const sortedFilters = [];

      allFilters.forEach((item) => {
        if (item.is_startpage) {
          sortedFilters.push({
            title: item.content.title,
            id: item.uuid,
            slug: item.slug,
            parent_id: item.parent_id,
            items: []
          })
        }
      });
      allFilters.forEach((item) => {
        if (!item.is_startpage) {
          sortedFilters.forEach((sortedItem) => {
            if (item.parent_id === sortedItem.parent_id) {
              sortedItem.items.push(item);
            }
          })
        }
      });
      return sortedFilters;
    },
    // sortedFilters() {
    //   const allFilters = this.info;
    //   const sortedFilters = [];

    //   allFilters.forEach((item) => {
    //     if (item.is_startpage) {
    //       sortedFilters.push({
    //         title: item.content.title,
    //         id: item.uuid,
    //         slug: item.slug,
    //         parent_id: item.parent_id,
    //         items: []
    //       })
    //     }
    //   });
    //   allFilters.forEach((item) => {
    //     if (!item.is_startpage) {
    //       sortedFilters.forEach((sortedItem) => {
    //         if (item.parent_id === sortedItem.parent_id) {
    //           sortedItem.items.push(item);
    //         }
    //       })
    //     }
    //   });
    //   return sortedFilters;
    // },
    currentRoute() {
      return this.$route;
    }
  },
  methods: {
    closeFilter() {
      this.$emit('closeFilter');
    },
    resetFilter() {
      this.$router.push({ query: {} });
      this.$emit('closeFilter');
    },
    setFilter(category, parentSlug) {
      const query = Object.assign({}, this.$route.query);
      if (query[parentSlug]) {
        const params = query[parentSlug].split(',');

        if (params.includes(category.slug)) {
          params.splice(params.indexOf(category.slug), 1);
        } else {
          params.push(category.slug);
        }

        query[parentSlug] = params.join(',');
      } else {
        query[parentSlug] = category.slug;
      }

      if (query[parentSlug] === '') {
        delete query[parentSlug];
      }

      this.$router.push({ query: query });
    },
    isChecked(checkbox, parentSlug) {
      const query = this.$route.query;
      let isActive = false;
      if (query[parentSlug]) {
        const params = query[parentSlug].split(',');

        if (params.includes(checkbox.slug)) {
          isActive = true;
        }
      }

      return isActive;
    },
    async getFilters() {
      let cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);
      const query = this.$route.query;
      const fetchOptions = {
        starts_with: this.$route.query.category ? `catalog/${this.$route.query.category}/` : this.$route.path.substr(1),
        filter_query: {
          component: {
            in: 'filter',
          }
        }
      }

      if (this.brand) {
        fetchOptions.starts_with = this.$route.query.category ? `catalog/${this.$route.query.category}/` : 'catalog/';
        fetchOptions.filter_query.brand = {
          in: this.brand.uuid,
        }
      }

      const info = await this.$storyapi.get(`cdn/stories/`, {
        version: 'published',
        cv: cache,
        excluding_fields: 'text,meta,body',
        sort_by: 'first_published_at:desc',
        per_page: 100,
        ...fetchOptions,
      })

      this.info = info.data.stories;
      // this.$store.commit('setFilters', info.data.stories);
    },
  },
  // async fetch() {
  //   await this.getFilters()
  // },
}
</script>

<style lang="scss">
.filters {
  @media screen and (max-width: 767px) {
    &.active {
      .filters__overflow {
        opacity: 1;
        visibility: visible;
      }

      .filters__wrapper {
        transform: translate3d(0,0,0);
      }
    }
  }

  &__overflow {
    @media screen and (max-width: 767px) {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      position: fixed;
      background: rgba(#000, .4);
      z-index: 9995;
      opacity: 0;
      visibility: hidden;
      transition: opacity .2s ease, visibility .2s ease;
    }
  }

  &__loading {
    margin: 100px auto 0;
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 50%;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 30px;
      height: 30px;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      background: transparent;
      border-radius: 50%;
      border: 2px solid rgba(#212121, 0.25);
      border-top: 2px solid #212121;
      animation: spinner 0.6s infinite linear;
    }

    @keyframes spinner {
      0% {
        transform: translateX(-50%) translateY(-50%) rotate(0deg);
      }
      to {
        transform: translateX(-50%) translateY(-50%) rotate(359deg);
      }
    }
  }

  &__wrapper {
    @media screen and (max-width: 767px) {
      position: fixed;
      width: 100%;
      height: 100%;
      right: 0;
      top: auto;
      bottom: 0;
      background: #fff;
      z-index: 9996;
      transform: translateX(100%);
      transition: transform .4s ease;
      border-radius: 7px 7px 0 0;
      transition: transform .25s ease;
      transform: translate3d(0,120%,0);
      -webkit-overflow-scrolling: touch;
    }
  }

  &__scroller {
    @media screen and (max-width: 767px) {
      overflow-y: auto;
      overscroll-behavior: contain;
      height: 100%;
      padding: 0 20px;
      padding-top: 90px;
      padding-bottom: 100px;
    }
  }

  &__item {
    margin-bottom: 20px;
  }

  &__item-scroller-wrapper {
    position: relative;

    &::before {
      content: '';
      width: calc(100% - 10px);
      height: 100%;
      position: absolute;
      pointer-events: none;
      bottom: 0;
      left: 0;
      z-index: 2;
      height: 35px;
      background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 100%);
    }
  }

  &__item-scroller {
    max-height: 235px;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 10px;
    padding-bottom: 10px;

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
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  &__mobile-header {
    position: absolute;
    z-index: 2;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
    padding: 20px;
    display: none;
    background: #f1f1f1;

    @media screen and (max-width: 767px) {
      display: block;
    }
  }

  &__mobile-footer {
    position: absolute;
    z-index: 2;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #fff;
    padding: 15px 20px;
    display: none;

    @media screen and (max-width: 767px) {
      display: block;
    }
  }

  &__mobile-title {
    margin: 0;
  }

  &__mobile-close {
    position: absolute;
    right: 15px;
    top: 22px;
    background: url('/images/ico-close.svg') no-repeat center center;
    background-size: 24px;
    padding: 0;
    border: 0;
    box-shadow: none;
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    transition: background-color .2s ease;

    &:hover {
      background-color: var(--color-main);
    }

    @media screen and (max-width: 767px) {
      top: 8px;
      right: 5px;
      background-size: 20px;
    }
  }

  &__active {
    display: none;

    @media screen and (max-width: 767px) {
      display: block;
      margin-bottom: 20px;
    }
  }
}
</style>
