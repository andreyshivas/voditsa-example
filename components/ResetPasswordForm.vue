<template>
  <form action="" method="post" class="loginForm" @submit.prevent="sendResetPassword">
    <div v-if="!isSended" class="loginForm__wrapper">
      <h4>Сбросить пароль</h4>
      <Input type="email" label="Email" placeholder="" v-model="email" name="reset_email" autocomplete="username" :class="firstInput ? '' : 'show-error'" :required="true" />

      <div class="loginForm__errors" v-if="errorMessage">
        {{errorMessage}}
      </div>
      <button @click="firstInput = false" type="submit" class="button loginForm__submit" :class="isLoading ? 'button--loading' : ''">Сбросить</button>
    </div>

    <div v-if="isSended">
      <h4>Письмо для сброса пароля отправлено на вашу почту</h4>
    </div>
  </form>
</template>

<script>
import errors from '~/helpers/errors';

export default {
  data() {
    return {
      email: '',
      error: {},
      isLoading: false,
      isSended: false,
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
    async sendResetPassword() {
      if (this.isLoading) return;

      this.isLoading = true;
      try {
        await this.$store.dispatch('resetPassword', {
          email: this.email
        });

        this.isSended = true;
        this.firstInput = true;
        this.error = {};
      } catch (error) {
        console.log('sendResetPassword');
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
