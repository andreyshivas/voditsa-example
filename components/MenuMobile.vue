<template>
  <div class="menuMobile" :class="this.$store.state.isActiveMenu ? 'active' : ''">
    <div class="menuMobile__wrapper" >
      <ul class="menuMobile__list">
        <li class="menuMobile__item">

          <nuxt-link class="menuMobile__link" to="/catalog">Каталог</nuxt-link>

          <button class="menuMobile__arrow" aria-label="Открыть подменю" @click="isCategoriesActive = true"></button>

          <div class="menuMobile__categories" :class="isCategoriesActive ? 'active' : ''">
            <div class="menuMobile__back-wrapper">
              <button class="menuMobile__back" @click="isCategoriesActive = false">Назад</button>
            </div>

            <div class="menuMobile__categories-item" v-for="category in categories" :key="category.uuid">
              <nuxt-link :to="`/${category.parentCategory.full_slug.replace(/\/$/, '')}`" class="menuMobile__column-title">{{category.parentCategory.content.title}}</nuxt-link>

              <ul class="menuMobile__submenu" v-if="category.subCategories.length">
                <li class="menuMobile__submenu-item" v-for="subCategory in category.subCategories" :key="subCategory.uuid">
                  <nuxt-link :to="`/${subCategory.full_slug.replace(/\/$/, '')}`" class="menuMobile__submenu-link">{{subCategory.content.title}}</nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </li>

        <li class="menuMobile__item menu-item-has-children" tabindex="-1">
          <nuxt-link class="menuMobile__link" to="/brands">Бренды</nuxt-link>
        </li>

        <li class="menuMobile__item menu-item-has-children" tabindex="-1">
          <nuxt-link class="menuMobile__link" to="/payment-and-delivery">Оплата и доставка</nuxt-link>
        </li>

        <li class="menuMobile__item menu-item-has-children" tabindex="-1">
          <nuxt-link class="menuMobile__link" to="/bonuses">Бонусы&nbsp;🎉</nuxt-link>
        </li>
      </ul>

      <div class="menuMobile__profile" v-if="this.$store.state.user">
        <h4 class="menuMobile__profile-title">Аккаунт</h4>
        <ul class="menuMobile__profile-list">
          <li class="menuMobile__profile-item">
            <nuxt-link class="menuMobile__profile-link menuMobile__profile-link--exact" to="/profile">
              Личная информация
            </nuxt-link>
          </li>
          <li class="menuMobile__profile-item">
            <nuxt-link class="menuMobile__profile-link" to="/profile/favorites">
              Избранное
            </nuxt-link>
          </li>
          <li class="menuMobile__profile-item">
            <nuxt-link class="menuMobile__profile-link" to="/profile/orders">
              Мои заказы
            </nuxt-link>
          </li>
          <li class="menuMobile__profile-item">
            <nuxt-link class="menuMobile__profile-link" to="/profile/bonus">
              Мои бонусы
            </nuxt-link>
          </li>
        </ul>
      </div>

      <div class="menuMobile__contacts">
        <div class="menuMobile__contacts-item">
          <a class="menuMobile__contacts-link" href="tel:+375259885789">+375 (25) 988-57-89</a>
          <div class="menuMobile__time">пн-вс: 10:00 - 21:00</div>
        </div>

        <div class="menuMobile__contacts-item">
          <a class="menuMobile__contacts-link" href="mailto:info@voditsa.by">info@voditsa.by</a>
        </div>

        <div class="menuMobile__socials">
          <a class="menuMobile__social-link" href="https://www.instagram.com/voditsa.by/" target="_blank" rel="noopener" aria-label="Instagram">
            <img src="/images/ico-instagram.svg" width="32" height="32" loading="lazy" alt="Instagram"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCategoriesActive: false
    }
  },
  watch: {
    $route() {
      if (this.$store.state.isActiveMenu) {
        this.$store.commit("setMenuState", false);
      }
    },
  },
  computed: {
    categories() {
      return this.$store.getters.categories
    }
  },
};
</script>

<style lang="scss">
.menuMobile {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  background: #fff;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  display: none;
  transform: translateX(-100%);
  z-index: 99;
  text-align: left;
  transition: transform 0.5s cubic-bezier(0.86, 0, 0.07, 1);

  &.active {
    transform: translateX(0);
  }

  @media screen and (max-width: 1023px) {
    display: block;
  }

  &__wrapper {
    padding-top: 80px;
    height: 100%;
    overflow: auto;
    overscroll-behavior: contain;
  }

  &__item {
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
  }

  &__link {
    display: block;
    text-decoration: none;
    background: none;
    border: 0;
    box-shadow: none;
    cursor: pointer;
    padding: 12px 20px;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #212121;
    position: relative;
    margin: 0;
    text-align: left;
    transition: color 0.2s ease;
    flex: 1;

    &.active {
      color: var(--color-main)-hover;
    }
  }

  &__arrow {
    display: block;
    width: 60px;
    flex-shrink: 0;
    background: url("/images/ico-arrow-link.svg") no-repeat center center;
    background-size: 24px 24px;
    border: 0;
    box-shadow: none;
    padding: 0;
    background-color: transparent !important;
  }

  &__categories {
    position: absolute;
    padding: 60px 0 20px;
    top: 0;
    left: 0;
    width: 100%;
    transform: translateX(100%);
    background: #fff;
    z-index: 9;
    overflow: auto;
    overscroll-behavior: contain;
    height: 100%;
    transition: transform 0.5s cubic-bezier(0.86, 0, 0.07, 1);

    &.active {
      transform: translateX(0);
    }
  }

  &__column-title {
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

  &__back {
    color: #212121 !important;
    display: block;
    background: transparent !important;
    padding: 12px 20px;
    padding-left: 40px;
    border: 0;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 600;
    line-height: 20px;
    position: relative;

    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 15px;
      top: 50%;
      width: 20px;
      height: 20px;
      background: url("/images/ico-arrow-link.svg") no-repeat center center;
      transform: translateY(-50%) rotate(180deg);
    }
  }

  &__contacts {
    padding: 30px 20px;
  }

  &__contacts-item {
    margin-bottom: 16px;

    @media screen and (max-width: 767px) {
      margin-bottom: 12px;
    }
  }

  &__contacts-link {
    font-size: 20px;
    background-size: 0 100%;
    color: #212121;
    background-repeat: no-repeat;
    background-image: linear-gradient(rgba(#212121, 0) calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s ease;

    &:hover {
      background-size: 100% 100%;
    }
  }

  &__time {
    opacity: 0.65;
  }

  &__social-link {
    display: block;
    width: 32px;
    height: 32px;
    opacity: 1;
  }

  &__profile {
    margin: 10px 0;
    padding: 20px 0;
    background: var(--color-bg);
  }

  &__profile-title {
    margin: 0;
    margin-bottom: 10px;
    padding: 0 20px;
    font-size: 16px;
  }

  &__profile-link {
    display: block;
    padding: 5px 20px;

    &.nuxt-link-active {
      background: #c0ffeb;
    }

    &--exact {
      &.nuxt-link-active {
        background: transparent;
      }

      &.nuxt-link-exact-active {
        background: #c0ffeb;
      }
    }
  }
}
</style>
