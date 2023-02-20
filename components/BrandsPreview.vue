<template>
  <div class="brandsPreview">
    <div class="brandsPreview__wrapper">
      <div class="container">
        <h2 class="brandsPreview__title">
          <nuxt-link class="moreLink" to="/brands">
            <div class="moreLink__text">Бренды</div>
            <div class="moreLink__arrow"></div>
          </nuxt-link>
        </h2>
      </div>

      <div class="brandsPreview__scroller">
        <div class="brandsPreview__item" v-for="item in brands" :key="item.uuid">
          <BrandCard :brand="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BrandCard from '~/components/BrandCard.vue';

export default {
  components: {
    BrandCard,
  },
  data() {
    return {
      brands: null
    }
  },
  methods: {
    async getBrands() {
      let cache = this.$store.state.cacheVersion ? this.$store.state.cacheVersion : Math.floor(Date.now() / 1e3);

      const info = await this.$storyapi.get(`cdn/stories/`, {
        version: 'published',
        cv: cache,
        excluding_fields: 'text,meta,body',
        per_page: 8,
        starts_with: 'brands/',
        sort_by: "content.title:asc",
      })

      this.brands = info.data.stories
    },
  },
  async fetch() {
    await this.getBrands()
  },
}
</script>

<style lang="scss">
.brandsPreview {
  padding: 0 30px;

  @media screen and (max-width: 767px) {
    padding: 0;
  }

  &__wrapper {
    padding: 40px 0;
    max-width: 1360px;
    margin: 0 auto;
    background: var(--color-bg);
    border-radius: 30px;

    @media screen and (max-width: 767px) {
      border-radius: 0;
      padding: 30px 0 20px;
    }
  }

  &__scroller {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    padding: 0 15px;

    @media screen and (max-width: 1200px) {
      display: flex;
      white-space: nowrap;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */

    }

    @media screen and (max-width: 767px) {
      padding: 0;
    }
  }

  &__item {
    padding: 0 15px;
    scroll-snap-align: center;

    @media screen and (max-width: 1200px) {
      min-width: 130px;
    }

    @media screen and (max-width: 767px) {
      padding: 0 8px;
      padding-bottom: 15px;
      min-width: 120px;

      &:first-child {
        padding-left: 15px;
      }

      &:last-child {
        padding-right: 15px;
      }
    }
  }
}
</style>
