<template>
  <div class="activeFilters">
    <div class="activeFilters__wrapper" v-if="sortedFilters.length">
      <button class="activeFilters__reset" @click="resetFilter" v-if="sortedFilters.length">
        Очистить фильтры
      </button>
      <button type="button" class="activeFilters__item" v-for="item in sortedFilters" :key="item.uuid" @click="removeFilter(item, item.parentSlug)">
        <div class="activeFilters__title">{{item.content.title}}</div>
        <div class="activeFilters__remove" >x</div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
  computed: {
    sortedFilters() {
      const allFilters = [...this.brands, ...this.filters];
      const sortedFilters = allFilters.filter(item => !item.is_startpage);
      const activeFilters = [];
      const query = this.$route.query;

      allFilters.push({
        title: 'Бренд',
        slug: 'brand',
        is_startpage: true,
      })

      allFilters.forEach((item) => {
        if (query[item.slug] && item.is_startpage) {
          const params = query[item.slug].split(',');

          sortedFilters.forEach((sortedItem) => {
            const params = query[item.slug].split(',');

            if (params.includes(sortedItem.slug)) {
              activeFilters.push({
                ...sortedItem,
                parentSlug: item.slug
              });
            }
          });
        }
      })

      // allFilters.forEach((item) => {
      //   if (item.is_startpage) {
      //     sortedFilters.push({
      //       title: item.content.title,
      //       id: item.uuid,
      //       slug: item.slug,
      //       parent_id: item.parent_id,
      //       items: []
      //     })
      //   }
      // });
      // allFilters.forEach((item) => {
      //   if (!item.is_startpage) {
      //     sortedFilters.forEach((sortedItem) => {
      //       if (item.parent_id === sortedItem.parent_id) {
      //         sortedItem.items.push(item);
      //       }
      //     })
      //   }
      // });
      return activeFilters;
    },
  },
  methods: {
    removeFilter(category, parentSlug) {
      const query = Object.assign({}, this.$route.query);
      if (query[parentSlug]) {
        const params = query[parentSlug].split(',');

        if (params.includes(category.slug)) {
          params.splice(params.indexOf(category.slug), 1);
        } else {
          params.push(category.slug);
        }

        query[parentSlug] = params.join(',');
      }

      if (query[parentSlug] === '') {
        delete query[parentSlug];
      }

      this.$router.push({ query: query });
    },
    resetFilter() {
      this.$router.push({ query: {} });
    },
  },
}
</script>

<style lang="scss">
.activeFilters {
  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
  }

  &__total {
    font-size: 14px;
    line-height: 20px;
  }

  &__item,
  &__reset {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid rgba(#212121, 0.5);
    background: transparent;
    box-shadow: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
    margin: 0 5px 10px;
    transition: border-color .2s ease;

    &:hover {
      border-color: #212121;
    }
  }

  &__reset {
    border: 1px solid #212121;
    background: #212121;
    color: #fff;

    &:hover {
      border: 1px solid #212121;
      background: #212121;
      color: #fff;
    }
  }

  &__remove {
    display: block;
    margin-left: 4px;
  }
}
</style>
