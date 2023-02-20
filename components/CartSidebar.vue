<template>
  <aside class="cartSidebar" :class="this.$store.state.isActiveCartSidebar ? 'active' : ''">
    <div class="cartSidebar__overflow" @click="hideCart"></div>
    <div class="cartSidebar__scroller">
      <div class="cartSidebar__wrapper">
        <h3 class="cartSidebar__title">
          Корзина
        </h3>

        <button class="cartSidebar__close" @click="hideCart" type="button" aria-label="Закрыть корзину"></button>

        <template v-if="products && products.length">

          <DeliveryBar :sum="totalSum" />

          <CartItem :product="product" v-for="product in products" :key="product.uuid" />

          <div class="cartSidebar__bottom">
            <div class="cartSidebar__price-wrapper">
              <div class="cartSidebar__price cartSidebar__price--sale" v-if="sale > 0">
                <div class="cartSidebar__price-title">Скидка</div>
                <div class="cartSidebar__price-value">-{{sale}} р. </div>
              </div>
              <div class="cartSidebar__price  cartSidebar__price--bonus">
                <div class="cartSidebar__price-title">Персональная скидка</div>
                <div class="cartSidebar__price-value">
                  <template v-if="user">
                    -{{personalSale}} р.
                  </template>
                </div>
                <button type="button" class="cartSidebar__login" @click="showLogin" v-if="!user">
                  Авторизоваться
                </button>
              </div>
              <div class="cartSidebar__price" v-if="coupon">
                <div class="cartSidebar__price-title">

                  <div class="cartSidebar__discount-info">
                    Промокод: <div class="cartSidebar__discount-name">{{coupon.name}}</div>

                    <button class="cartSidebar__discount-remove" type="button" @click="removeCoupon" aria-label="Удалить промокод"></button>
                  </div>
                </div>
                <div class="cartSidebar__price-value">-{{discount}} р. </div>
              </div>
              <div class="cartSidebar__price">
                <div class="cartSidebar__price-title">Итого</div>
                <div class="cartSidebar__price-value">{{totalSum}} р. </div>
              </div>
            </div>
            <Discount />

            <nuxt-link to="/checkout" class="cartSidebar__pay button button--big">Оформить заказ</nuxt-link>
          </div>
        </template>

        <div v-else class="cartSidebar__empty">
          <h3 class="cartSidebar__empty-title">Корзина пуста</h3>

          <div class="cartSidebar__empty-text" v-if="!this.$store.state.user">
            Если в корзине были товары —
            <button type="button" class="cartSidebar__empty-link" @click="showLogin">
              авторизуйтесь
            </button>, чтобы просмотреть их.
          </div>

          <nuxt-link to="/catalog" class="cartSidebar__empty-button button">Перейти в каталог</nuxt-link>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  watch: {
    $route() {
      if (this.$store.state.isActiveCartSidebar) {
        this.$store.commit('setCartModalState', false);
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    products() {
      return this.$store.state.userProfile.cart;
    },
    discount() {
      return this.$store.getters.cartPrice.discountPrice;
    },
    coupon() {
      return this.$store.state.userProfile.discount
    },
    sale() {
      const sale = this.$store.getters.cartPrice.priceFull - this.$store.getters.cartPrice.price;
      return parseFloat(sale);
    },
    personalSale() {
      const personalSale = (this.$store.getters.cartPrice.price * (this.$store.getters.personalSale / 100)).toFixed(2);
      return parseFloat(personalSale);
    },
    totalSum() {
      const totalSum = (this.$store.getters.cartPrice.price - this.personalSale - this.discount).toFixed(2);
      return parseFloat(totalSum);
    },
  },
  methods: {
    showLogin() {
      this.$store.commit("setLoginModalState", true);
    },
    hideCart() {
      this.$store.commit('setCartModalState', false);
    },
    async removeCoupon() {
      this.$store.dispatch('setDiscount', null);
    },
  }
}
</script>

<style lang="scss">
.cartSidebar {
  position: relative;
  z-index: 99999;

  &.active {
    .cartSidebar__overflow {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }

    .cartSidebar__scroller {
      transform: translateX(0);
    }

    .cartSidebar__wrapper {
      transform: translateY(0);
      opacity: 1;
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

  &__scroller {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    height: 100%;
    width: 100%;
    background: #fff;
    max-width: 720px;
    transform: translateX(100%);
    transition: transform .4s ease;
  }

  &__wrapper {
    overflow: auto;
    height: 100%;
    padding: 30px 60px;
    opacity: 0;
    transform: translateY(20px);
    transition: transform .6s .4s ease, opacity .4s .4s ease;
    overscroll-behavior: contain;

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
      padding: 30px 15px;
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

  &__bottom {
    margin-top: 32px;
  }

  &__price-wrapper {

    @media screen and (max-width: 767px) {
      margin-bottom: 16px;
    }
  }

  &__price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 30px;

    &--sale {
      color: #A6A6A6;
    }

    &--bonus {
      color: var(--color-main2);
    }
  }

  &__price-title {
    font-size: 16px;
    line-height: 20px;

    @media screen and (max-width: 767px) {
      font-size: 14px;
      line-height: 18px;
    }
  }

  &__price-value {
    font-size: 28px;
    line-height: 32px;
    font-weight: 700;

    @media screen and (max-width: 767px) {
      font-size: 22px;
      line-height: 26px;
    }
  }

  &__pay {
    width: 100%;
    margin-top: 30px;
  }

  &__empty {
    text-align: center;
    padding: 120px 0;
  }

  &__empty-text {
    font-size: 16px;
    line-height: 20px;
    max-width: 400px;
    margin: 0 auto 25px;
  }

  &__empty-link {
    font-size: 16px;
    line-height: 20px;
    background: none;
    padding: 0;
    box-shadow: none;
    cursor: pointer;
    border: 0;
    text-decoration: none;
    border-bottom: 1px solid var(--color-text-main);
    transition: color .2s ease, border-color .2s ease;

    &:hover {
      color: var(--color-main2);
      border-bottom: 1px solid var(--color-main2);
    }
  }

  &__login {
    font-size: 16px;
    line-height: 20px;
    background: none;
    padding: 0;
    box-shadow: none;
    cursor: pointer;
    border: 0;
    text-decoration: none;
    border-bottom: 1px solid var(--color-text-main);
    transition: color .2s ease, border-color .2s ease;

    &:hover {
      color: var(--color-main2);
      border-bottom: 1px solid var(--color-main2);
    }
  }

  &__discount-info {
    display: flex;
    align-items: center;
  }

  &__discount-name {
    font-weight: 700;
    margin: 0 5px;
  }

  &__discount-remove {
    display: block;
    width: 40px;
    height: 40px;
    background: transparent;
    border-radius: 50%;
    box-shadow: none;
    border: 0;
    background: url('/images/ico-remove.svg') no-repeat center center;
    cursor: pointer;
    transition: background-color .2s ease;

    &:hover {
      background-color: #f2f2f2;
    }
  }
}
</style>
