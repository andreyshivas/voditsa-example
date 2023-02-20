<template>
  <div class="menuCategories">
    <div class="menuCategories__wrapper">
      <div class="menuCategories__columns">
        <div class="menuCategories__column" v-for="category in categories" :key="category.uuid">
          <nuxt-link :to="`/${category.parentCategory.full_slug.replace(/\/$/, '')}`" class="menuCategories__column-title">{{category.parentCategory.content.title}}</nuxt-link>

          <ul class="menuCategories__submenu" v-if="category.subCategories.length">
            <li class="menuCategories__submenu-item" v-for="subCategory in category.subCategories" :key="subCategory.uuid">
              <nuxt-link :to="`/${subCategory.full_slug.replace(/\/$/, '')}`" class="menuCategories__submenu-link">{{subCategory.content.title}}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    categories() {
      return this.$store.getters.categories
    }
  }
};
</script>

<style lang="scss">
.menuCategories {
  position: absolute;
  left: 50%;
  top: 100%;
  width: 1310px;
  max-width: 100%;
  // border-top: 1px solid rgba(#212121, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(-30px);
  z-index: 3;
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
  padding: 20px 40px 0;

  &__wrapper {
    background: #fff;
    // box-shadow: 0 30px 30px rgba(#000, .07);
    box-shadow: 0 -4px 30px -10px rgba(#000, .1);
    border-radius: 20px;
    padding: 30px 40px;
  }

  @media screen and (min-width: 1024px) {
    pointer-events: none;
  }

  &__columns {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 30px;
  }

  &__column-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-decoration: none;
    margin-bottom: 24px;
    background-size: 0 100%;
    color: #212121;
    background-repeat: no-repeat;
    background-image: linear-gradient(rgba(#212121, 0) calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s ease;

    &.nuxt-link-active,
    &:hover {
      background-size: 100% 100%;
    }
  }

  &__submenu {
    margin-top: 24px !important;
  }

  &__submenu-item {
    margin-bottom: 16px;
    font-size: 16px;
    line-height: 20px;
  }

  &__submenu-link {
    text-decoration: none;
    background-size: 0 100%;
    color: #212121;
    background-repeat: no-repeat;
    background-image: linear-gradient(rgba(#212121, 0) calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s ease;

    &:hover,
    &.nuxt-link-active {
      background-size: 100% 100%;
    }
  }
}
</style>
