<template>
  <div class="filterCategories">
    <div class="filterCategories__title">Категории</div>

    <div class="filterCategories__item" v-for="(category, index) in categories" :key="index" :class="(activeDropdown === category.parentCategory.uuid ? 'active' : 'closed')">
      {{checkActiveCategory(category.parentCategory)}}
      <nuxt-link :to="`/${category.parentCategory.full_slug.replace(/\/$/, '')}`" class="filterCategories__parent-category">
        {{category.parentCategory.content.title}}
      </nuxt-link>
      <button class="filterCategories__arrow" v-if="category.subCategories.length" type="button" @click="setActiveDropdown(category.parentCategory.uuid)"></button>

      <ul class="filterCategories__dropdown" v-if="category.subCategories.length">
        <li class="filterCategories__dropdown-item" v-for="subCategory in category.subCategories" :key="subCategory.uuid">
          <nuxt-link :to="`/${subCategory.full_slug.replace(/\/$/, '')}`" class="filterCategories__dropdown-link">{{subCategory.content.title}}</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeDropdown: null,
    }
  },
  methods: {
    setActiveDropdown(id) {
      if (this.activeDropdown === id) {
        this.activeDropdown = false;
      } else {
        this.activeDropdown = id;
      }
    },
    checkActiveCategory(category) {
      if (this.$route.path.includes(category.slug)) {
        if (this.activeDropdown === null) {
          this.activeDropdown = category.uuid;
        }
      }
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories
    }
  }
};
</script>

<style lang="scss">
.filterCategories {
  margin-bottom: 20px;

  @media screen and (max-width: 767px) {
    display: none;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  &__item {
    position: relative;

    &.active {
      .filterCategories {
        &__dropdown {
          display: block;
        }
      }
    }
  }

  &__parent-category {
    display: block;
    position: relative;
    font-size: 16px;
    line-height: 20px;
    padding: 6px 0;
    padding-right: 38px;
    transition: color .2s ease;

    &.nuxt-link-active {
      font-weight: 600;

      // & + .filterCategories__dropdown {
      //   display: block;
      // }
    }

    &:hover {
      color: #747474;
    }
  }

  &__arrow {
    display: block;
    position: absolute;
    z-index: 1;
    border: 0;
    box-shadow: none;
    cursor: pointer;
    right: 0;
    top: 0;
    width: 32px;
    height: 32px;
    background: url('/images/ico-arrow-dropdown.svg') no-repeat center center;
  }

  &__dropdown {
    // max-height: 0;
    // overflow: hidden;
    display: none;
    padding: 4px 0!important;
  }

  &__dropdown-link {
    display: block;
    position: relative;
    font-size: 16px;
    line-height: 20px;
    padding: 6px 12px;
    transition: color .2s ease;

    &.nuxt-link-active {
      font-weight: 600;
    }

    &:hover {
      color: #747474;
    }
  }
}
</style>
