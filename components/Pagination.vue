<template>
  <div class="pagination">
    <button @click="changePage(prev)" class="pagination__link pagination__link--prev" v-if="current > 1">
      ←
    </button>
    <button
      @click="changePage(item.id)"
      class="pagination__link"
      :class="{ 'pagination__link--active': current === +item.id }"
      v-for="item in pages"
      :key="item.id"
    >
      {{ item.num }}
    </button>
    <button @click="changePage(next)" class="pagination__link pagination__link--next" v-if="current < total">
      →
    </button>
  </div>
</template>

<script>
import VueScrollTo from 'vue-scrollto';

export default {
  props: {
    current: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  computed: {
    prev() {
      return this.current === 1 ? 1 : this.current - 1;
    },
    next() {
      return this.current === this.total ? this.current : this.current + 1;
    },
    pages() {
      let pages = [];
      let currentPage = this.current;

      for (let i = 0; i < this.total; i++) {
        pages.push({
          num: i + 1,
          id: i + 1,
        });
      }

      let filteredPages = pages.slice();

      if (currentPage > 5 && currentPage < pages.length - 4 && this.total > 9) {
        let prevDots = pages[currentPage - 4];
        let nextDots = pages[currentPage + 2];
        prevDots.num = "...";
        nextDots.num = "...";
        filteredPages = [
          pages[0],
          prevDots,
          pages[currentPage - 3],
          pages[currentPage - 2],
          pages[currentPage - 1],
          pages[currentPage],
          pages[currentPage + 1],
          nextDots,
          pages[pages.length - 1],
        ];
      }
      if (currentPage <= 5 && this.total > 9) {
        let nextDots = pages[currentPage + 2];
        let firstPages = [];
        for (let i = 0; i <= currentPage; i++) {
          firstPages.push(pages[i]);
        }
        nextDots.num = "...";
        filteredPages = [
          ...firstPages,
          pages[currentPage + 1],
          nextDots,
          pages[pages.length - 1],
        ];
      }
      if (
        currentPage > 5 &&
        currentPage >= pages.length - 4 &&
        currentPage < pages.length - 1 &&
        this.total > 9
      ) {
        let prevDots = pages[currentPage - 4];
        let lastPages = [];
        for (let i = 0; i <= pages.length - 1; i++) {
          if (i >= currentPage && this.total) {
            lastPages.push(pages[i]);
          }
        }
        prevDots.num = "...";
        filteredPages = [
          pages[0],
          prevDots,
          pages[currentPage - 3],
          pages[currentPage - 2],
          pages[currentPage - 1],
          ...lastPages,
        ];
      }
      if (
        currentPage > 5 &&
        currentPage >= pages.length - 1 &&
        this.total > 9
      ) {
        let prevDots = pages[currentPage - 5];
        let lastPages = [];
        for (let i = 0; i <= pages.length - 1; i++) {
          if (i >= currentPage && this.total) {
            lastPages.push(pages[i]);
          }
        }
        prevDots.num = "...";
        filteredPages = [
          pages[0],
          prevDots,
          pages[currentPage - 4],
          pages[currentPage - 3],
          pages[currentPage - 2],
          pages[currentPage - 1],
          ...lastPages,
        ];
      }

      return filteredPages;
    },
  },
  methods: {
    changePage(page) {
      const query = Object.assign({}, this.$route.query);
      query.page = page;

      this.$router.push({ query: query });
      VueScrollTo.scrollTo(".catalog__cards", 400, {
        offset: -120,
      });
    }
  }
};
</script>

<style lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  @media screen and (max-width: 767px) {
    padding: 40px 0;
  }

  &__link {
    display: block;
    border: 0;
    box-shadow: none;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    text-align: center;
    color: #212121;
    flex-shrink: 0;
    font-size: 16px;
    text-decoration: none !important;
    line-height: 20px;
    padding: 8px 5px;
    min-width: 36px;
    height: 36px;
    margin: 0 2px;
    transition: color 0.2s ease, background-color .2s ease;

    &:hover {
      color: #212121;
      background: rgba(#212121, .2);
    }

    &--active {
      color: #fff;
      background: #212121;

      &:hover {
        color: #fff;
        background: #212121;
      }
    }

    &--prev {
      margin-right: 5px;
    }

    &--next {
      margin-left: 5px;
    }

    &--prev,
    &--next {
      max-width: 37px;
      min-width: 37px;

      @media screen and (max-width: 767px) {
        min-width: 30px;
        max-width: 30px;
      }

      @media screen and (max-width: 360px) {
        display: none;
      }
    }
  }
}
</style>
