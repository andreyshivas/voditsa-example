<template>
  <div class="cartItem">
    <nuxt-link :to="`/${product.full_slug.replace(/\/$/, '')}`" class="cartItem__image">
      <nuxt-picture
        v-if="product.content.image && product.content.image.filename"
        :src="product.content.image.filename"
        :alt="product.content.title"
        provider="storyblok"
        width="110px"
        height="110px"
        sizes="xl:220px lg:220px md:220px sm:220px xs:220px"
        loading="lazy"
      />
    </nuxt-link>

    <div class="cartItem__content">
      <div class="cartItem__title-wrapper">
        <nuxt-link :to="`/${product.full_slug}`" class="cartItem__title">{{product.content.title}}</nuxt-link>
      </div>
      <div class="cartItem__description">
        {{product.content.description}}
      </div>

      <div class="cartItem__wrapper" v-if="+product.content.in_stock !== 0">
        <div class="cartItem__counter">
          <button type="button" @click="decrenentItem" class="cartItem__counter-button cartItem__counter-button--minus" :disabled="count === 1" title="Убрать 1 товар" aria-label="Убрать 1 товар"></button>
          <div class="cartItem__counter-value">{{count}}</div>
          <button type="button" @click="addProductToCart" :disabled="count === +product.content.in_stock" class="cartItem__counter-button cartItem__counter-button--plus" title="Добавить 1 товар" aria-label="Добавить 1 товар"></button>
        </div>

        <div class="cartItem__price-wrapper">
          <div class="cartItem__price">{{product.content.price}} р.</div>
          <div class="cartItem__price-sale" v-if="product.content.full_price !== product.content.price">{{product.content.full_price}} р.</div>
        </div>
      </div>

      <div v-if="+product.content.in_stock === 0">
        <div class="cartItem__out-of-stock">Нет в наличии</div>
      </div>
    </div>

    <button type="button" @click="removeProductFromCart" title="Удалить из корзины" aria-label="Удалить из корзины" class="cartItem__remove"></button>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    count() {
      const products = this.$store.state.userProfile.cart ? this.$store.state.userProfile.cart.slice() : [];

      const product = products.filter((item) => {
        if (item.uuid === this.product.uuid) {
          return item;
        }
      });

      return product[0].count || 1;
    }
  },
  methods: {
    async addProductToCart() {
      try {
        await this.$store.dispatch('addProductToCart', this.product);
      } catch (error) {
        console.log('addProductToCart');
        console.log(error);
      }
    },
    async decrenentItem() {
      try {
        await this.$store.dispatch('removeProductFromCart', {
          product: this.product,
          removeAll: false,
        });
      } catch (error) {
        console.log('decrenentItem');
        console.log(error);
      }
    },
    async removeProductFromCart() {
      try {
        await this.$store.dispatch('removeProductFromCart', {
          product: this.product,
          removeAll: true,
        });
      } catch (error) {
        console.log('removeProductFromCart');
        console.log(error);
      }
    }
  }
}
</script>

<style lang="scss">
.cartItem {
  display: flex;
  position: relative;
  white-space: normal;
  margin-bottom: 20px;

  &__image {
    display: block;
    width: 110px;
    height: 110px;
    overflow: hidden;
    position: relative;
    background: var(--color-bg);
    margin-right: 16px;
    flex-shrink: 0;

    @media screen and (max-width: 767px) {
      width: 90px;
      height: 90px;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
    }
  }

  &__content {
    padding: 8px 0;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 767px) {
      padding: 4px 0;
    }
  }

  &__title-wrapper {
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    max-width: 340px;
    padding-right: 30px;

    @media screen and (max-width: 767px) {
      font-size: 14px;
      line-height: 18px;
    }
  }

  &__title {
    background-size: 0 100%;
    color: #000;
    text-decoration: none;
    background-repeat: no-repeat;
    background-image: linear-gradient(#fff0 calc(100% - 1px), #000 1px);
    transition: background-size 0.3s;

    &:hover {
      background-size: 100% 100%;
    }
  }

  &__description {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 10px;
    max-width: 340px;

    @media screen and (max-width: 767px) {
      font-size: 12px;
      line-height: 16px;
    }
  }

  &__wrapper {
    display: flex;
    align-items: center;
    margin-top: auto;

    @media screen and (max-width: 767px) {
      justify-content: space-between;
    }
  }

  &__price-wrapper {
    display: flex;
    align-items: center;

    @media screen and (max-width: 767px) {
      flex-wrap: wrap;
    }
  }

  &__price {
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    margin-right: 5px;

    @media screen and (max-width: 767px) {
      font-size: 16px;
      line-height: 20px;
    }
  }

  &__price-sale {
    font-size: 14px;
    line-height: 18px;
    color: var(--color-text-gray);
    text-decoration: line-through;

    @media screen and (max-width: 767px) {
      font-size: 12px;
      line-height: 16px;
    }
  }

  &__counter {
    display: flex;
    align-items: center;
    margin-right: 20px;

    @media screen and (max-width: 767px) {
      margin-right: 0;
      margin-left: 5px;
      order: 2;
    }
  }

  &__counter-button {
    width: 30px;
    height: 30px;
    background-color: #f2f2f2;
    border: 0;
    box-shadow: none;
    cursor: pointer;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    transition: background-color .2s ease;

    &:hover {
      background-color: var(--color-main);
    }

    &:disabled {
      cursor: not-allowed;
      background-color: rgba(#f2f2f2, .2);
    }

    &--minus {
      background-image: url('/images/ico-minus.svg');
    }

    &--plus {
      background-image: url('/images/ico-plus.svg');
    }
  }

  &__counter-value {
    min-width: 30px;
    padding: 0 10px;
    font-size: 14px;
    line-height: 30px;
    font-weight: 700;
    text-align: center;
  }

  &__remove {
    position: absolute;
    right: 0px;
    top: 0px;
    background: url('/images/ico-close.svg') no-repeat center center;
    background-size: 16px;
    padding: 0;
    border: 0;
    box-shadow: none;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transition: background-color .2s ease;

    &:hover {
      background-color: var(--color-main);
    }
  }
}
</style>
