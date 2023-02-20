<template>
  <div class="productCard" v-if="product.content">
    <nuxt-link :to="`/${product.full_slug.replace(/\/$/, '')}`" class="productCard__image">
      <!-- <nuxt-picture
        v-if="product.content.image && product.content.image.filename"
        :src="product.content.image.filename"
        :alt="product.content.title"
        provider="storyblok"
        width="284px"
        height="284px"
        sizes="xl:562px lg:562px md:562px sm:284px xs:284px"
        loading="lazy"
      /> -->

      <picture>
        <source
          :srcset="`
            ${product.content.image.filename}/m/filters:format(webp) 1920w,
            ${product.content.image.filename}/m/180x180/filters:format(webp) 720w
          `"
          sizes="
            (max-width: 767px) 100vw,
            1920px
          "
          type="image/webp"
        />
        <img
          :src="`${product.content.image.filename}`"
          :srcset="`
            ${product.content.image.filename}/m/filters:format(png) 1920w,
            ${product.content.image.filename}/m/180x180/filters:format(png) 720w
          `"
          sizes="
            (max-width: 767px) 100vw,
            1920px
          "
          width="284"
          height="284"
          :alt="product.content.title"
          loading="lazy"
        />
      </picture>
    </nuxt-link>

    <div class="productCard__tags">
      <div class="productCard__tag" v-if="isNew">New</div>
      <div class="productCard__tag productCard__tag--sale" v-if="salePercent > 0">-{{salePercent}}%</div>
    </div>

    <button class="productCard__favorite" aria-label="Добавить в избранное" title="Добавить в избранное" :class="isFavoriteProduct ? 'active' : ''" @click="addProductToFavorites">
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32.3036 15.6797C31.766 15.1472 31.1278 14.7248 30.4253 14.4366C29.7228 14.1483 28.9699 14 28.2095 14C27.4491 14 26.6961 14.1483 25.9936 14.4366C25.2912 14.7248 24.6529 15.1472 24.1153 15.6797L22.9997 16.7844L21.8841 15.6797C20.7983 14.6046 19.3256 14.0006 17.79 14.0006C16.2544 14.0006 14.7817 14.6046 13.6958 15.6797C12.61 16.7549 12 18.2131 12 19.7336C12 21.2541 12.61 22.7124 13.6958 23.7875L14.8115 24.8922L22.9997 33L31.188 24.8922L32.3036 23.7875C32.8414 23.2553 33.268 22.6233 33.5591 21.9277C33.8502 21.2321 34 20.4866 34 19.7336C34 18.9807 33.8502 18.2352 33.5591 17.5396C33.268 16.844 32.8414 16.212 32.3036 15.6797V15.6797Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="productCard__content">
      <div class="productCard__title-wrapper">
        <nuxt-link :to="`/${product.full_slug.replace(/\/$/, '')}`" class="productCard__title">{{product.content.title}}</nuxt-link>
      </div>
      <div class="productCard__description">
        {{product.content.description}}
      </div>

      <div class="productCard__footer">
        <div class="productCard__price-wrapper">
          <div class="productCard__price">{{product.content.price}} р.</div>
          <div class="productCard__price-sale" v-if="product.content.price !== product.content.full_price">{{product.content.full_price}} р.</div>
        </div>
        <template v-if="+product.content.in_stock !== 0">
          <button v-if="isAddedToCart" class="button button--transparent productCard__button " @click="showCart" type="button">В корзине</button>
          <button v-else class="button productCard__button" type="button" :class="isLoading ? 'button--loading' : ''" @click="addProductToCart">В корзину</button>
        </template>
        <div class="productCard__sold-out" v-else>
          Нет в наличии
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseISO, differenceInMinutes } from 'date-fns';

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFavorite: false,
      isLoading: false,
    }
  },
  computed: {
    isFavoriteProduct() {
      const productsInFavorites = this.$store.state.userProfile.favorites;
      let result = false;

      productsInFavorites?.forEach((item) => {
        if (item === this.product.uuid) {
          result = true;
        }
      })
      return result;
    },
    isAddedToCart() {
      const productsInCart = this.$store.state.userProfile.cart;
      let result = false;

      productsInCart?.forEach((item) => {
        if (item.uuid === this.product.uuid) {
          result = true;
        }
      })
      return result;
    },
    salePercent() {
      const price = this.product.content.price;
      const fullPrice = this.product.content.full_price;
      const salePercent = Math.round(((fullPrice - price) / fullPrice) * 100);
      return salePercent;
    },
    isNew() {
      const date = parseISO(this.product.first_published_at);
      const now = new Date();
      return differenceInMinutes(now, date) < 30240;
    }
  },
  methods: {
    async addProductToFavorites() {
      try {
        if (!this.$store.state.user) {
          this.$store.commit('setLoginModalState', true);
          return false;
        }
        if (this.isFavoriteProduct) {
          await this.$store.dispatch('removeProductFromFavorites', this.product.uuid);
        } else {
          await this.$store.dispatch('addProductToFavorites', this.product.uuid);
        }
      } catch (error) {
        console.log('addProductToFavorites');
        console.log(error);
      }
    },
    async addProductToCart() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$store.dispatch('addProductToCart', this.product);
        this.$store.commit('setCartModalState', true);
      } catch (error) {
        console.log('addProductToCart');
        console.log(error);
      }
      this.isLoading = false;
    },
    showCart() {
      this.$store.commit('setCartModalState', true);
    },
  }
}
</script>

<style lang="scss">
.productCard {
  position: relative;
  white-space: normal;
  display: flex;
  flex-direction: column;

  &:hover {
    .productCard__image {
      background: #e8e8e8;
      img {
        transform: scale(1.07);
      }
    }
  }

  &__image {
    display: block;
    padding-top: 100%;
    overflow: hidden;
    position: relative;
    background: var(--color-bg);
    margin-bottom: 16px;
    transition: background-color .4s ease;

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
      transition: transform 0.6s ease;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__title-wrapper {
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
    margin-bottom: 10px;

    &:hover {
      .productCard__title {
        background-size: 100% 100%;
      }
    }
  }

  &__title {
    background-size: 0 100%;
    color: #212121;
    text-decoration: none;
    background-repeat: no-repeat;
    background-image: linear-gradient(#fff0 calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s;
  }

  &__description {
    font-size: 16px;
    line-height: 20px;

    @media screen and (max-width: 767px) {
      font-size: 14px;
      line-height: 18px;
    }
  }

  &__price-wrapper {
    display: flex;
    align-items: center;
    padding: 15px 0;
  }

  &__price {
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    margin-right: 5px;

    @media screen and (max-width: 767px) {
      font-size: 18px;
      line-height: 22px;
    }
  }

  &__price-sale {
    font-size: 14px;
    line-height: 18px;
    color: var(--color-text-gray);
    text-decoration: line-through;

    @media screen and (max-width: 767px) {
      font-size: 13px;
      line-height: 16px;
    }
  }

  &__tags {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
  }

  &__tag {
    padding: 4px 6px;
    background: #C0FFEB;

    &--sale {
      color: #fff;
      background: #000;
    }
  }

  &__favorite {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 46px;
    height: 46px;
    padding: 0;
    border: 0;
    background: #fff;
    border-radius: 50%;
    box-shadow: none;
    cursor: pointer;
    transition: background-color .2s ease;

    @media screen and (max-width: 767px) {
      width: 40px;
      height: 40px;
    }

    svg {
      transition: fill .2s ease!important;
      fill: transparent;
    }

    &:hover {
      background: rgba(var(--color-main), .5);
    }

    &.active {
      svg {
        fill: #212121;
      }
    }
  }

  &__footer {
    margin-top: auto;
    display: block;
    width: 100%;
  }

  &__sold-out {
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    font-size: 16px;
    line-height: 20px;
    padding: 18px 30px;
    background: rgba(#f2f2f2, .8);

    @media screen and (max-width: 767px) {
      padding-top: 14px;
      padding-bottom: 14px;
    }

    @media screen and (max-width: 400px) {
      padding-left: 10px;
      padding-right: 10px;
    }

    @media screen and (max-width: 360px) {
      font-size: 14px;
    }
  }

  &__button {
    @media screen and (max-width: 767px) {
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
}
</style>
