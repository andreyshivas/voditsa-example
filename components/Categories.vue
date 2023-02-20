<template>
  <div class="categories">
    <div class="container">
      <h2 class="categories__title">Категории</h2>
    </div>

    <div class="categories__wrapper">
      <div class="categories__item" v-for="category in categories" :key="category.parentCategory.uuid">
        <nuxt-link class="categories__card" :to="`/${category.parentCategory.full_slug.replace(/\/$/, '')}`">
          <div class="categories__card-image" v-if="category.parentCategory.content.image && category.parentCategory.content.image.filename">
            <!-- <nuxt-picture
              :src="category.parentCategory.content.image.filename"
              :alt="category.parentCategory.content.title"
              provider="storyblok"
              width="270"
              height="270"
              sizes="sm:160px xxl:540px"
              loading="lazy"
            /> -->
            <picture>
              <source
                :srcset="`
                  ${category.parentCategory.content.image.filename}/m/filters:format(webp) 1920w,
                  ${category.parentCategory.content.image.filename}/m/160x160/filters:format(webp) 640w
                `"
                sizes="
                  (max-width: 767px) 100vw,
                  1920px
                "
                type="image/webp"
              />
              <img
                :src="`${category.parentCategory.content.image.filename}`"
                :srcset="`
                  ${category.parentCategory.content.image.filename}/m/filters:format(png) 1920w,
                  ${category.parentCategory.content.image.filename}/m/160x160/filters:format(png) 640w
                `"
                sizes="
                  (max-width: 767px) 100vw,
                  1920px
                "
                width="270"
                height="270"
                :alt="category.parentCategory.content.title"
                loading="lazy"
              />
            </picture>
          </div>

          <div class="categories__card-title">{{category.parentCategory.content.title}}</div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
  },
}
</script>

<style lang="scss">
.categories {
  padding: 70px 0 60px;

  @media screen and (max-width: 1023px) {
    padding: 60px 0 40px;
  }

  @media screen and (max-width: 767px) {
    padding: 40px 0 0;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    max-width: 1250px;
    padding: 0 25px;
    margin: 0 auto;

    @media screen and (max-width: 767px) {
      display: flex;
      white-space: nowrap;
      overflow-x: auto;
      padding: 0;
      scroll-snap-type: x mandatory;

      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */

    }
  }

  &__item {
    padding: 0 15px;
    scroll-snap-align: center;

    @media screen and (max-width: 1023px) {
      padding: 0 8px;
    }

    @media screen and (max-width: 767px) {
      padding-bottom: 15px;

      &:first-child {
        padding-left: 15px;
      }

      &:last-child {
        padding-right: 15px;
      }
    }
  }

  &__card {
    text-decoration: none;
    display: block;
    text-align: center;

    @media screen and (max-width: 767px) {
      min-width: 160px;
    }

    &:hover {
      .categories {
        &__card-image {
          img {
            transform: scale(1.06);
          }
        }

        &__card-title {
          background-size: 100% 100%;
        }
      }
    }
  }

  &__card-image {
    overflow: hidden;
    margin-bottom: 16px;
    padding-top: 100%;
    position: relative;
    background: var(--color-bg);
    border-radius: 20px;

    @media screen and (max-width: 1023px) {
      margin-bottom: 12px;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
      transition: transform .6s ease;
    }
  }

  &__card-title {
    display: inline;
    font-size: 18px;
    line-height: 22px;
    font-weight: 700;
    background-size: 0 100%;
    color: #000;
    background-repeat: no-repeat;
    background-image: linear-gradient(#fff0 calc(100% - 1px), #000 1px);
    transition: background-size 0.3s;

    @media screen and (max-width: 1023px) {
      font-size: 14px;
      line-height: 18px;
    }
  }
}
</style>
