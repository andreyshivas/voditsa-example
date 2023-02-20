<template>
  <form action="" method="post" class="loginForm" @submit.prevent="signUp">
    <h4>Регистрация</h4>
    <div class="loginForm__description">Создайте аккаунт, чтобы сохранять товары в избранное, синхронизировать корзину со своими устройствами, просматривать историю заказов, а также получать бонусы за заказы</div>
    <div class="loginForm__wrapper">

      <Input type="email" label="Email" placeholder="" v-model="email" name="registration_email" autocomplete="username" :class="firstInput ? '' : 'show-error'" :required="true" />

      <Input type="password" label="Пароль" placeholder="" v-model="password" name="registration_password" autocomplete="new-password" :class="firstInput ? '' : 'show-error'" :required="true" />

      <Input type="password" label="Подтвердите пароль" placeholder="" v-model="repeatPassword" name="repeat_password" autocomplete="new-password" :class="firstInput ? '' : 'show-error'" :required="true" />

      <div class="loginForm__errors" v-if="errorMessage">
        {{errorMessage}}
      </div>

      <button @click="firstInput = false" type="submit" class="button loginForm__submit" :class="isLoading ? 'button--loading' : ''">Зарегистрироваться</button>
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
      repeatPassword: '',
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
    async signUp() {
      if (this.password === this.repeatPassword) {
        if (this.isLoading) return;
        this.isLoading = true

        try {
          await this.$store.dispatch('signUpWithEmail', {
            email: this.email,
            password: this.password
          });

          this.$store.commit('setLoginModalState', false);
          this.error = {};
          this.firstInput = true;
          this.$router.push('/profile');

        } catch (error) {
          console.log('signUp');
          console.log(error)

          this.error = {
            code: error.code,
            message: error.message,
          };

        }

        this.isLoading = false;
      } else {
        this.error = {
          code: null,
          message: 'Пароли не совпадают'
        }
      }
    },
  }
}
</script>
