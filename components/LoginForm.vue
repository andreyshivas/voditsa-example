<template>
  <form action="" method="post" class="loginForm" @submit.prevent="signIn">
    <h4>Войти</h4>
    <div class="loginForm__description">Войдите в аккаунт, чтобы сохранять товары в избранное, синхронизировать корзину со своими устройствами, просматривать историю заказов, а также получать бонусы за заказы</div>
    <div class="loginForm__wrapper">

      <Input type="email" label="Email" placeholder="" v-model="email" name="login_email" autocomplete="username" :class="firstInput ? '' : 'show-error'" :required="true" />

      <Input type="password" label="Пароль" placeholder="" v-model="password" name="login_password" autocomplete="current-password" :class="firstInput ? '' : 'show-error'" :required="true" />

      <div class="loginForm__errors" v-if="errorMessage">
        {{errorMessage}}
      </div>
      <button @click="firstInput = false" type="submit" class="button loginForm__submit" :class="isLoading ? 'button--loading' : ''">Войти</button>
    </div>
  </form>
</template>

<script>
import errors from '~/helpers/errors';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: {},
      isLoading: false,
      firstInput: true,
    }
  },
  computed: {
    errorMessage () {
      let errorMessage = this.error.message
      if (errors[this.error.code]) {
        errorMessage = errors[this.error.code]
      }
      return errorMessage
    }
  },
  methods: {
    async signIn() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        await this.$store.dispatch('signInWithEmail', {
          email: this.email,
          password: this.password
        });
        this.$store.commit('setLoginModalState', false);
        this.error = {};
        this.firstInput = true;
      } catch (error) {
        console.log('signIn');
        console.log(error)

        this.error = {
          code: error.code,
          message: error.message,
        };
      }
      this.isLoading = false;
    }
  }
}
</script>
