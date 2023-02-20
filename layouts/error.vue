<template>
  <div class="errorPage">
    <div class="container">
      <h1>{{error.statusCode}}</h1>

      <div>{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    errorMessage() {
      if (this.error.statusCode === 404) {
        return 'Страница не найдена';
      }
      console.log('error page ', this.error.statusCode, this.$route.fullPath);
      return Array.isArray(this.error.message) ? this.error.message.join('. ') : this.error.message;
    },
  },
  created() {
    console.log('404 ', this.$route.fullPath);
  }
}
</script>

<style lang="scss">
.errorPage {
  padding: 60px 0;
  text-align: center;
}
</style>
