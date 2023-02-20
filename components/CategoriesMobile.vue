<template>
  <div class="categoriesMobile" :class="isActive ? 'active' : ''">
    <div class="categoriesMobile__overflow" @click="closeCategories"></div>
    <div class="categoriesMobile__wrapper">
      <div class="categoriesMobile__header">
        <h4 class="categoriesMobile__title">Категории</h4>
        <button class="categoriesMobile__close" @click="closeCategories" type="button" aria-label="Закрыть категории"></button>
      </div>

      <div class="categoriesMobile__scroller">
        <div class="categoriesMobile__item" v-for="category in categories" :key="category.uuid">
          <nuxt-link :to="`/${category.parentCategory.full_slug.replace(/\/$/, '')}`" class="categoriesMobile__item-title">{{category.parentCategory.content.title}}</nuxt-link>

          <ul class="categoriesMobile__submenu" v-if="category.subCategories.length">
            <li class="categoriesMobile__submenu-item" v-for="subCategory in category.subCategories" :key="subCategory.uuid">
              <nuxt-link :to="`/${subCategory.full_slug.replace(/\/$/, '')}`" class="categoriesMobile__submenu-link">{{subCategory.content.title}}</nuxt-link>
            </li>
          </ul>
        </div>
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
  },
  computed: {
    categories() {
      return this.$store.getters.categories
    }
  },
  methods: {
    closeCategories() {
      this.$emit('closeCategories');
    }
  }
};
</script>

<style lang="scss">
.categoriesMobile {
  position: relative;
  z-index: 99999;

  &.active {
    .categoriesMobile__overflow {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }

    .categoriesMobile__scroller {
      opacity: 1;
      transform: translateY(0);
    }

    .categoriesMobile__wrapper {
      transform: translateX(0);
    }
  }

  &__overflow {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9990;
    background: rgba(#000, .4);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity .2s ease, visibility .2s ease;
  }

  &__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    height: 100%;
    width: 100%;
    background: #fff;
    max-width: 720px;
    transform: translateX(-100%);
    transition: transform .4s ease;
  }

  &__scroller {
    overflow: auto;
    overscroll-behavior: contain;
    height: 100%;
    padding: 90px 0;
    opacity: 0;
    transform: translateY(20px);
    transition: transform .6s .4s ease, opacity .4s .4s ease;

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
      padding: 60px 0;
      padding-top: 80px;
      transition: transform .4s .3s ease, opacity .3s .3s ease;
    }
  }

  &__close {
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
      top: 21px;
      right: 5px;
      background-size: 20px;
    }
  }

  &__item-title {
    display: block;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #212121;
    padding: 12px 20px;

    &.nuxt-link-active {
      background: #f5f5f5;
    }

    &.nuxt-link-exact-active {
      background: #c0ffeb;
    }
  }

  &__submenu {
    margin-top: 12px !important;
    margin-bottom: 12px !important;
  }

  &__submenu-item {
    font-size: 16px;
    line-height: 20px;
  }

  &__submenu-link {
    display: block;
    padding: 8px 20px;

    &.nuxt-link-active {
      background: #c0ffeb;
    }
  }

  &__header {
    display: block;
    position: absolute;
    z-index: 2;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
    padding: 20px;
    background: #f1f1f1;
  }

  &__title {
    margin: 0;
  }

  &__close {
    position: absolute;
    top: 8px;
    right: 5px;
    background: url('/images/ico-close.svg') no-repeat center center;
    background-size: 20px;
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
  }
}
</style>
