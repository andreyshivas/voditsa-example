
<template>
  <header class="header" :class="isFixed ? 'fixed' : ''">
    <div class="container">
      <div class="header__wrapper">
        <div class="header__burger">
          <Burger />
        </div>

        <nuxt-link class="header__logo" to="/">
          <img src="/images/logo.svg" width="189" height="45" alt="Voditsa лого" />
        </nuxt-link>

        <div class="header__menu">
          <Menu />
        </div>

        <div class="header__buttons">
          <button type="button" class="header__button header__button--search" @click="showSearch" aria-label="Поиск" title="Поиск">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5 13.5C17.0817 13.5 13.5 17.0817 13.5 21.5C13.5 25.9183 17.0817 29.5 21.5 29.5C25.9183 29.5 29.5 25.9183 29.5 21.5C29.5 17.0817 25.9183 13.5 21.5 13.5ZM12.5 21.5C12.5 16.5294 16.5294 12.5 21.5 12.5C26.4706 12.5 30.5 16.5294 30.5 21.5C30.5 26.4706 26.4706 30.5 21.5 30.5C16.5294 30.5 12.5 26.4706 12.5 21.5Z" fill="black"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M27.6464 27.6464C27.8417 27.4512 28.1583 27.4512 28.3536 27.6464L32.3536 31.6464C32.5488 31.8417 32.5488 32.1583 32.3536 32.3536C32.1583 32.5488 31.8417 32.5488 31.6464 32.3536L27.6464 28.3536C27.4512 28.1583 27.4512 27.8417 27.6464 27.6464Z" fill="black"/>
            </svg>


          </button>
          <nuxt-link v-if="this.$store.state.user" to="/profile/favorites" type="button" class="header__button header__button--favorite" aria-label="Избранные товары" title="Избранные товары">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32.3036 15.6797C31.766 15.1472 31.1278 14.7248 30.4253 14.4366C29.7228 14.1483 28.9699 14 28.2095 14C27.4491 14 26.6961 14.1483 25.9936 14.4366C25.2912 14.7248 24.6529 15.1472 24.1153 15.6797L22.9997 16.7844L21.8841 15.6797C20.7983 14.6046 19.3256 14.0006 17.79 14.0006C16.2544 14.0006 14.7817 14.6046 13.6958 15.6797C12.61 16.7549 12 18.2131 12 19.7336C12 21.2541 12.61 22.7124 13.6958 23.7875L14.8115 24.8922L22.9997 33L31.188 24.8922L32.3036 23.7875C32.8414 23.2553 33.268 22.6233 33.5591 21.9277C33.8502 21.2321 34 20.4866 34 19.7336C34 18.9807 33.8502 18.2352 33.5591 17.5396C33.268 16.844 32.8414 16.212 32.3036 15.6797V15.6797Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div class="header__button-counter" v-if="this.$store.getters.favoritesCounter > 0">{{this.$store.getters.favoritesCounter}}</div>
          </nuxt-link>
          <button v-if="!this.$store.state.user"  type="button" class="header__button header__button--favorite" @click="showLogin" aria-label="Избранные товары" title="Избранные товары">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32.3036 15.6797C31.766 15.1472 31.1278 14.7248 30.4253 14.4366C29.7228 14.1483 28.9699 14 28.2095 14C27.4491 14 26.6961 14.1483 25.9936 14.4366C25.2912 14.7248 24.6529 15.1472 24.1153 15.6797L22.9997 16.7844L21.8841 15.6797C20.7983 14.6046 19.3256 14.0006 17.79 14.0006C16.2544 14.0006 14.7817 14.6046 13.6958 15.6797C12.61 16.7549 12 18.2131 12 19.7336C12 21.2541 12.61 22.7124 13.6958 23.7875L14.8115 24.8922L22.9997 33L31.188 24.8922L32.3036 23.7875C32.8414 23.2553 33.268 22.6233 33.5591 21.9277C33.8502 21.2321 34 20.4866 34 19.7336C34 18.9807 33.8502 18.2352 33.5591 17.5396C33.268 16.844 32.8414 16.212 32.3036 15.6797V15.6797Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div class="header__button-counter" v-if="this.$store.getters.favoritesCounter > 0">{{this.$store.getters.favoritesCounter}}</div>
          </button>
          <nuxt-link v-if="this.$store.state.user" to="/profile" type="button" class="header__button" aria-label="Профиль" title="Профиль">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M33 33.5V31C33 29.6739 32.4732 28.4021 31.5355 27.4645C30.5979 26.5268 29.3261 26 28 26H18C16.6739 26 15.4021 26.5268 14.4645 27.4645C13.5268 28.4021 13 29.6739 13 31V33.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 22C25.7614 22 28 19.7614 28 17C28 14.2386 25.7614 12 23 12C20.2386 12 18 14.2386 18 17C18 19.7614 20.2386 22 23 22Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </nuxt-link>
          <button v-if="!this.$store.state.user" type="button" class="header__button" @click="showLogin" aria-label="Профиль" title="Профиль">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M33 33.5V31C33 29.6739 32.4732 28.4021 31.5355 27.4645C30.5979 26.5268 29.3261 26 28 26H18C16.6739 26 15.4021 26.5268 14.4645 27.4645C13.5268 28.4021 13 29.6739 13 31V33.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 22C25.7614 22 28 19.7614 28 17C28 14.2386 25.7614 12 23 12C20.2386 12 18 14.2386 18 17C18 19.7614 20.2386 22 23 22Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button type="button" class="header__button" @click="showCart" aria-label="Корзина" title="Корзина">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 13L14 17V31C14 31.5304 14.2107 32.0391 14.5858 32.4142C14.9609 32.7893 15.4696 33 16 33H30C30.5304 33 31.0391 32.7893 31.4142 32.4142C31.7893 32.0391 32 31.5304 32 31V17L29 13H17Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 17H32" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M27 21C27 22.0609 26.5786 23.0783 25.8284 23.8284C25.0783 24.5786 24.0609 25 23 25C21.9391 25 20.9217 24.5786 20.1716 23.8284C19.4214 23.0783 19 22.0609 19 21" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div class="header__button-counter" v-if="this.$store.getters.cartCounter > 0">{{this.$store.getters.cartCounter}}</div>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isFixed: false,
    };
  },
  methods: {
    setHeaderFixed() {
      if (window.scrollY !== 0 && !this.isFixed) {
        this.isFixed = true;
      }
      if (window.scrollY === 0) {
        this.isFixed = false;
      }
    },
    showCart() {
      this.$store.commit("setCartModalState", true);
    },
    showLogin() {
      this.$store.commit("setLoginModalState", true);
    },
    showSearch() {
      this.$store.commit("setSearchState", true);
    },
  },
  mounted() {
    this.setHeaderFixed();
    window.addEventListener("scroll", this.setHeaderFixed);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.setHeaderFixed);
  },
};
</script>

<style lang="scss">
.header {
  background: rgba(#fff, 0.8);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transform: translateZ(0);
  z-index: 999;
  transition: box-shadow 0.2s ease;

  &.active {
    height: 100%;

    &::before {
      display: block;
    }
  }

  &.fixed {
    box-shadow: 0 4px 7px rgba(#000, 0.03);
  }

  &__logo {
    position: relative;
    z-index: 999;
    display: block;
    max-width: 189px;
    flex-shrink: 0;

    @media screen and (max-width: 767px) {
      max-width: 130px;
      margin: 0 auto;
    }

    @media screen and (max-width: 360px) {
      max-width: 105px;
    }
  }

  &__menu {
    margin: 0 auto;

    @media screen and (max-width: 1023px) {
      position: absolute;
      left: 0;
      top: 0;
      padding-top: 68px;
      width: 100%;
      background: #fff;
      display: none;
      height: 100%;
      overflow: hidden;

      &.active {
        display: block;
      }
    }

    @media screen and (max-width: 767px) {
      padding-top: 60px;
    }
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80px;

    @media screen and (max-width: 767px) {
      min-height: 60px;
    }
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    margin-right: -8px;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    box-shadow: none;
    padding: 0;
    border: 0;
    background: transparent;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    margin: 0;
    margin-left: 6px;
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--color-main);
    }

    @media screen and (max-width: 767px) {
      width: 44px;
      height: 44px;
      margin: 0;
    }

    @media screen and (max-width: 400px) {
      width: 40px;
      height: 40px;
      margin: 0;
    }

    @media screen and (max-width: 360px) {
      width: 36px;
      height: 36px;
    }
  }

  &__button-counter {
    position: absolute;
    text-align: center;
    right: 0;
    top: 0;
    width: 18px;
    height: 18px;
    background: #000;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    border-radius: 50%;
    font-weight: 700;

    @media screen and (max-width: 360px) {
      font-size: 8px;
      line-height: 16px;
      width: 16px;
      height: 16px;
    }
  }

  &__burger {
    display: none;
    position: relative;
    z-index: 999;

    @media screen and (max-width: 1023px) {
      display: block;
      margin-right: 24px;
    }

    @media screen and (max-width: 767px) {
      margin-right: 12px;
    }

    @media screen and (max-width: 360px) {
      margin-right: 5px;
    }
  }
}
</style>
