<template>
  <div class="product">
    <div class="product__photos">
      <div class="product__photo">
        <nuxt-picture
          v-if="info.story.content.image && info.story.content.image.filename"
          :src="info.story.content.image.filename"
          :alt="info.story.content.title"
          provider="storyblok"
          width="570"
          height="456"
          fit="in"
          sizes="xl:1260px lg:1260px md:1260px sm:630px xs:630px"
          loading="lazy"
        />
      </div>

      <div class="product__tags">
        <div class="product__tag" v-if="isNew">New</div>
        <div class="product__tag product__tag--sale" v-if="salePercent > 0">-{{salePercent}}%</div>
      </div>
    </div>

    <div class="product__info-content">
      <h1 class="product__title">{{info.story.content.title}}</h1>

      <div class="product__description">{{info.story.content.description}} <strong v-if="info.story.content.size || info.story.content.items">({{info.story.content.size}}{{info.story.content.items}})</strong></div>

      <div class="product__price-wrapper">
        <div class="productPrice">
          <div class="productPrice__current">
            <div class="productPrice__current-value">{{info.story.content.price}} р.</div>
            <div class="productPrice__current-text" v-if="salePercent > 0">Со скидкой <strong>{{salePercent}}%</strong></div>
          </div>
          <div class="productPrice__full" v-if="info.story.content.price !== info.story.content.full_price">
            <div class="productPrice__full-value">{{info.story.content.full_price}} р.</div>
            <div class="productPrice__full-text">Без скидки</div>
          </div>
        </div>

        <div class="productBonus">
          <div class="productBonus__icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.9141 2.01789C15.0771 0.892785 16.9229 0.892786 18.0859 2.01789L18.9014 2.80684C19.5665 3.45022 20.4912 3.75069 21.4075 3.62109L22.531 3.46218C24.1332 3.23556 25.6264 4.32046 25.906 5.91429L26.102 7.03192C26.2619 7.94334 26.8334 8.72998 27.6509 9.16368L28.6532 9.6955C30.0826 10.4539 30.653 12.2093 29.9424 13.6631L29.444 14.6825C29.0377 15.5138 29.0377 16.4862 29.444 17.3175L29.9424 18.3369C30.653 19.7907 30.0826 21.5461 28.6532 22.3045L27.6509 22.8363C26.8334 23.27 26.2619 24.0567 26.102 24.9681L25.906 26.0857C25.6264 27.6795 24.1332 28.7644 22.531 28.5378L21.4075 28.3789C20.4912 28.2493 19.5665 28.5498 18.9014 29.1932L18.0859 29.9821C16.9229 31.1072 15.0771 31.1072 13.9141 29.9821L13.0986 29.1932C12.4335 28.5498 11.5088 28.2493 10.5925 28.3789L9.46904 28.5378C7.86682 28.7644 6.37358 27.6795 6.094 26.0857L5.89796 24.9681C5.73808 24.0567 5.16655 23.27 4.34914 22.8363L3.34679 22.3045C1.91737 21.5461 1.347 19.7907 2.05765 18.3369L2.55597 17.3175C2.96235 16.4862 2.96235 15.5138 2.55597 14.6825L2.05765 13.6631C1.347 12.2093 1.91737 10.4539 3.34679 9.6955L4.34914 9.16368C5.16655 8.72998 5.73808 7.94334 5.89796 7.03192L6.094 5.91429C6.37359 4.32046 7.86682 3.23556 9.46904 3.46218L10.5925 3.62109C11.5088 3.75069 12.4335 3.45022 13.0986 2.80683L13.9141 2.01789Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="11.5" cy="11.5" r="2.5" fill="white" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="20.5" cy="20.5" r="2.5" fill="white" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 22L22 10" stroke="black" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="productBonus__text">
            <template v-if="!this.$store.state.user">
              <button type="button" class="productBonus__link" @click="showLogin">
                Авторизуйтесь
              </button>, чтобы получить персональную скидку до <span class="productBonus__count">{{personalSale}}&nbsp;р.</span>
            </template>
            <template v-else>
              <strong>Персональная скидка</strong> до <span class="productBonus__count">{{personalSale}}&nbsp;р.</span> по <nuxt-link class="productBonus__link" to="/bonuses">бонусной программе</nuxt-link>
            </template>
          </div>
        </div>
      </div>

      <div class="product__info">

        <div class="product__info-items">
          <div class="product__info-item">
            <strong>Наличие: </strong>
            <span v-if="+info.story.content.in_stock === 0" style="color: red;">Нет в наличии</span>
            <span v-if="+info.story.content.in_stock >= 1">Есть</span>
            <!-- <span v-if="+info.story.content.in_stock < 3 && +info.story.content.in_stock !== 0" style="color: red;">Заканчивается</span> -->
            <!-- <span v-if="+info.story.content.in_stock >= 3">Есть</span> -->
          </div>
          <div class="product__info-item" v-if="info.story.content.size">
            <strong>Объем: </strong> {{info.story.content.size}}
          </div>
          <div class="product__info-item" v-if="info.story.content.items">
            <strong>Количество: </strong> {{info.story.content.items}}
          </div>
        </div>

        <nuxt-link v-if="brand" :to="`/${brand.full_slug.replace(/\/$/, '')}`" class="product__brand-logo">
          <nuxt-picture
            v-if="brand.content.logo && brand.content.logo.filename"
            :src="brand.content.logo.filename"
            :alt="brand.content.title"
            provider="storyblok"
            width="180"
            height="60"
            fit="in"
            sizes="xl:360px lg:360px md:360px sm:180px xs:180px"
          />
        </nuxt-link>
      </div>

      <div class="product__buttons">
        <template v-if="+info.story.content.in_stock !== 0">
          <button v-if="isAddedToCart" class="product__add button button--transparent" @click="showCart" type="button">В корзине</button>
          <button v-else class="product__add button" type="button" @click="addProductToCart">Добавить в корзину</button>
        </template>
        <div class="product__empty" v-else>
          Нет в наличии
        </div>
        <button type="button" class="productFavoriteButton" :class="isFavoriteProduct ? 'active' : ''" @click="addProductToFavorites">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.3036 21.6797C36.766 21.1472 36.1278 20.7248 35.4253 20.4366C34.7228 20.1483 33.9699 20 33.2095 20C32.4491 20 31.6961 20.1483 30.9936 20.4366C30.2912 20.7248 29.6529 21.1472 29.1153 21.6797L27.9997 22.7844L26.8841 21.6797C25.7983 20.6046 24.3256 20.0006 22.79 20.0006C21.2544 20.0006 19.7817 20.6046 18.6958 21.6797C17.61 22.7549 17 24.2131 17 25.7336C17 27.2541 17.61 28.7124 18.6958 29.7875L19.8115 30.8922L27.9997 39L36.188 30.8922L37.3036 29.7875C37.8414 29.2553 38.268 28.6233 38.5591 27.9277C38.8502 27.2321 39 26.4866 39 25.7336C39 24.9807 38.8502 24.2352 38.5591 23.5396C38.268 22.844 37.8414 22.212 37.3036 21.6797V21.6797Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="product__advantages">
        <div class="productAdvantage">
          <div class="productAdvantage__icon">
            <img src="/images/ico-delivery.svg" width="34" height="34" alt="Delivery">
          </div>
          <div class="productAdvantage__text">Бесплатная доставка по&nbsp;Беларуси от <strong>40 р.</strong></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import declOfNum from "~/helpers/declOfNum";
import { parseISO, differenceInMinutes } from 'date-fns';

export default {
  props: {
    info: {
      type: Object,
      required: true,
    }
  },
  computed: {
    brand() {
      const product = this.info.story;
      const rels = this.info.rels;
      const brandId = product.content.brand;
      const brandContent = rels.filter((brand) => {
        return brand.uuid === brandId;
      });

      if (brandContent.length) {
        return brandContent[0];
      }

      return null;
    },
    isFavoriteProduct() {
      const productsInFavorites = this.$store.state.userProfile.favorites;
      let result = false;

      productsInFavorites?.forEach((item) => {
        if (item === this.info.story.uuid) {
          result = true;
        }
      })
      return result;
    },
    isAddedToCart() {
      const productsInCart = this.$store.state.userProfile.cart;
      let result = false;

      productsInCart?.forEach((item) => {
        if (item.uuid === this.info.story.uuid) {
          result = true;
        }
      })
      return result;
    },
    bonusesText() {
      const bonuses = this.info.story.content.price ? this.info.story.content.price : this.info.story.content.full_price;
      return declOfNum(bonuses, ["балл", "балла", "баллов"]);
    },
    salePercent() {
      const price = this.info.story.content.price;
      const fullPrice = this.info.story.content.full_price;
      const salePercent = Math.round(((fullPrice - price) / fullPrice) * 100);
      return salePercent;
    },
    isNew() {
      const date = parseISO(this.info.story.first_published_at);
      const now = new Date();
      return differenceInMinutes(now, date) < 30240;
    },
    personalSale() {
      return (this.info.story.content.price * 0.1).toFixed(2);
    }
  },
  methods: {
    async addProductToCart() {
      try {
        await this.$store.dispatch('addProductToCart', this.info.story);
        this.$store.commit('setCartModalState', true);
      } catch (error) {
        console.log('addProductToCart');
        console.log(error);
      }
    },
    async addProductToFavorites() {
      try {
        if (!this.$store.state.user) {
          this.$store.commit('setLoginModalState', true);
          return false;
        }
        if (this.isFavoriteProduct) {
          await this.$store.dispatch('removeProductFromFavorites', this.info.story.uuid);
        } else {
          await this.$store.dispatch('addProductToFavorites', this.info.story.uuid);
        }
      } catch (error) {
        console.log('addProductToFavorites');
        console.log(error);
      }
    },
    showCart() {
      this.$store.commit('setCartModalState', true);
    },
    showLogin() {
      this.$store.commit("setLoginModalState", true);
    },
  }
}
</script>

<style lang="scss">
.product {
  display: grid;
  gap: 30px;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 60px;

  @media screen and (max-width: 1023px) {
    display: block;
  }

  @media screen and (max-width: 767px) {
    margin-bottom: 50px;
  }

  &__photos {
    position: relative;
  }

  &__photo {
    background: var(--color-bg);
    padding-top: 80%;
    overflow: hidden;
    position: relative;

    @media screen and (max-width: 1023px) {
      padding-top: 60%;
      margin-bottom: 30px;
    }

    @media screen and (max-width: 767px) {
      padding-top: 80%;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__tags {
    position: absolute;
    left: 0;
    top: 0;
  }

  &__tag {
    color: var(--color-dark);
    background: #C0FFEB;
    font-size: 14px;
    line-height: 20px;
    padding: 6px 20px;
    margin-right: 5px;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-weight: 700;

    &--sale {
      color: #fff;
      background: var(--color-dark);
    }
  }

  &__info-content {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 32px;
    line-height: 36px;
    font-weight: 700;
    color: var(--color-text-main);
    margin-bottom: 12px;

    @media screen and (max-width: 1023px) {
      font-size: 28px;
      line-height: 32px;
    }

    @media screen and (max-width: 767px) {
      font-size: 24px;
      line-height: 28px;
    }
  }

  &__description {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 30px;

    @media screen and (max-width: 1023px) {
      font-size: 18px;
      line-height: 22px;
    }
  }

  &__info {
    margin-bottom: 35px;
    display: grid;
    gap: 30px;
    grid-template-columns: 1fr 1fr;
    align-items: center;

    @media screen and (max-width: 1200px) {
      margin-bottom: 25px;
    }

    @media screen and (max-width: 767px) {
      order: 4;
      margin-top: 20px;
      margin-bottom: 20px;
      gap: 15px;
    }
  }

  &__info-item {
    font-size: 14px;
    line-height: 18px;
    margin: 10px 0;
  }

  &__brand-logo {
    display: block;
    width: 180px;
    height: 60px;
    padding: 5px;
    border: 1px solid #E4E4E4;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    margin-left: auto;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    @media screen and (max-width: 360px) {
      width: 120px;
    }
  }

  &__price-wrapper {
    order: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 1200px) {
      display: block;
    }

    @media screen and (max-width: 1023px) {
      display: flex;
    }

    @media screen and (max-width: 767px) {
      display: block;
      margin-bottom: 20px;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    margin-top: 35px;
    order: 3;

    @media screen and (max-width: 767px) {
      display: flex;
      justify-content: space-between;
      gap: 0;
      position: sticky;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 15px 0;
      background: #fff;
      z-index: 10;
      margin: 0;
    }
  }

  &__add {
    min-width: 270px;

    @media screen and (max-width: 1023px) {
      min-width: auto;
    }

    @media screen and (max-width: 767px) {
      padding-left: 20px;
      padding-right: 20px;
      flex: 1;
      max-width: 280px;
    }
  }

  &__advantages {
    order: 5;
    margin-top: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media screen and (max-width: 1023px) {
      grid-template-columns: 1fr;
    }

    @media screen and (max-width: 767px) {
      margin-top: 20px;
    }
  }
}

.productFavoriteButton {
  margin-left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  border: 0;
  background: #F7F7F7;
  border-radius: 50%;
  box-shadow: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color .2s ease;

  @media screen and (max-width: 767px) {
    margin-left: 15px;
  }

  path {
    transition: fill .2s ease!important;
    fill: transparent;
  }

  &:hover {
    background: rgba(var(--color-main), .5);
  }

  &.active {
    path {
      fill: #000;
    }
  }
}

.productPrice {
  display: flex;
  align-items: center;

  @media screen and (max-width: 1200px) {
    margin-bottom: 20px;
  }

  &__current {
    margin-right: 12px;
  }

  &__current-value {
    font-size: 32px;
    line-height: 38px;
    font-weight: 700;
  }

  &__current-text {
    font-size: 12px;
    line-height: 16px;
  }

  &__full {
    color: #A6A6A6;
  }

  &__full-value {
    font-size: 18px;
    line-height: 38px;
    font-weight: 700;
    text-decoration: line-through;
  }

  &__full-text {
    font-size: 12px;
    line-height: 16px;
  }
}

.productBonus {
  background: #F7F7F7;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  min-width: 300px;
  max-width: 300px;

  @media screen and (max-width: 480px) {
    min-width: auto;
  }

  &__icon {
    width: 32px;
    margin-top: 4px;
    flex-shrink: 0;
    margin-right: 16px;
  }

  &__count {
    color: var(--color-main2);
    font-weight: 700;
  }

  &__link {
    padding: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
    cursor: pointer;
    color: var(--color-text-main);
    text-decoration: none;
    border-bottom: 1px solid var(--color-text-main);
    transition: color .2s ease, border-color .2s ease;

    &:hover {
      color: var(--color-main2);
      border-bottom: 1px solid var(--color-main2);
    }
  }
}

.productAdvantage {
  display: flex;
  font-size: 14px;
  line-height: 18px;
  max-width: 280px;

  &__icon {
    flex-shrink: 0;
    margin-right: 18px;
  }
}
</style>
