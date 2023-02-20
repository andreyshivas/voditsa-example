<template>
  <nav class="menu" >
    <ul class="menu__list">
      <li class="menu__item menu-item-has-children" tabindex="-1">
        <nuxt-link class="menu__link" to="/catalog">
          <span class="menu__link-text">Каталог</span>
        </nuxt-link>

        <MenuCategories />
      </li>

      <li class="menu__item menu-item-has-children" tabindex="-1">
        <nuxt-link class="menu__link" to="/brands">
          <div class="menu__link-text">Бренды</div>
        </nuxt-link>
      </li>

      <li class="menu__item menu-item-has-children" tabindex="-1">
        <nuxt-link class="menu__link" to="/payment-and-delivery">
          <div class="menu__link-text">Оплата и доставка</div>
        </nuxt-link>
      </li>

      <li class="menu__item menu-item-has-children" tabindex="-1">
        <nuxt-link class="menu__link" to="/bonuses">
          <div class="menu__link-text">Бонусы</div>&nbsp;🎉
        </nuxt-link>
      </li>

    </ul>
  </nav>
</template>

<style lang="scss">
.menu {
  @media screen and (max-width: 1023px) {
    display: none !important;
  }

  &__list {
    display: flex;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background: none;
    border: 0;
    box-shadow: none;
    cursor: pointer;
    padding: 8px 16px;
    font-size: 16px;
    line-height: 20px;
    min-height: 80px;
    position: relative;
    margin: 0;
    transition: color 0.2s ease;

    &.active,
    &.nuxt-link-active,
    &:hover {
      .menu__link-text {
        background-size: 100% 100%;
      }
    }

    @media screen and (max-width: 1200px) {
      padding: 8px 10px;
    }
  }

  &__link-text {
    background-size: 0 100%;
    color: #212121;
    background-repeat: no-repeat;
    background-image: linear-gradient(rgba(#212121, 0) calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s ease;
  }

  &__item {
    margin: 0;
    padding: 0;

    &:hover,
    &.show-dropdown {
      z-index: 5;

      @media screen and (min-width: 1024px) {
        .menuCategories {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) translateX(-50%);
          transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.6s ease !important;
          pointer-events: all;
        }

        .menu__link {
          &__link-text {
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}
</style>
