<template>
  <aside class="loginSidebar" :class="this.$store.state.isActiveLoginSidebar ? 'active' : ''">
    <div class="loginSidebar__overflow" @click="hideSidebar"></div>
    <div class="loginSidebar__scroller">
      <div class="loginSidebar__wrapper">
        <h3 class="loginSidebar__title">Мой аккаунт</h3>

        <button class="loginSidebar__close" @click="hideSidebar" type="button" aria-label="Закрыть попап"></button>

        <template v-if="activeForm === 'login'">
          <LazyLoginForm />
          <div class="loginSidebar__login-links">
            <button class="loginSidebar__link" type="button" @click="activeForm = 'reset'">Забыли пароль?</button>
            <button class="loginSidebar__link" type="button" @click="activeForm = 'registration'">Зарегистрироваться</button>
          </div>
        </template>

        <template v-if="activeForm === 'reset'">
          <LazyResetPasswordForm />
          <div class="loginSidebar__login-links">
            <button class="loginSidebar__link" type="button" @click="activeForm = 'login'">Войти</button>
          </div>
        </template>

        <template v-if="activeForm === 'registration'">
          <LazyRegistrationForm />
          <div class="loginSidebar__login-links">
            <button class="loginSidebar__link" type="button" @click="activeForm = 'login'">Войти</button>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  watch: {
    $route() {
      if (this.$store.state.isActiveLoginSidebar) {
        this.$store.commit('setLoginModalState', false);
      }
    },
  },
  data() {
    return {
      activeForm: 'login',
    }
  },
  methods: {
    hideSidebar() {
      this.$store.commit('setLoginModalState', false);
    }
  }
}
</script>

<style lang="scss">
.loginSidebar {
  position: relative;
  z-index: 99999;

  &.active {
    .loginSidebar__overflow {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }

    .loginSidebar__scroller {
      transform: translateX(0);
    }

    .loginSidebar__wrapper {
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
    overscroll-behavior: contain;
    height: 100%;
    padding: 30px 60px;
    opacity: 0;
    transform: translateY(20px);
    transition: transform .6s .4s ease, opacity .4s .4s ease;

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

  &__title {
    margin-bottom: 60px;
  }

  &__link {
    display: inline;
    padding: 0;
    box-shadow: none;
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    line-height: 22px;
    font-family: var(--font-main);
    background-size: 0 100%;
    color: #212121;
    background-repeat: no-repeat;
    background-image: linear-gradient(rgba(#212121, 0) calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s ease;

    &:hover {
      background-size: 100% 100%;
    }
  }

  &__login-links {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }

  .loginForm {
    &__description {
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 30px;
    }

    &__errors {
      color: rgb(255, 83, 83);
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>
