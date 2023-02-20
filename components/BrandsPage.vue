<template>
  <div class="brandsPage">
    <div class="brandsPage__header">
      <div class="brandsPage__background" style="background-color: #E0FFF5;">
        <nuxt-picture
          src="https://a.storyblok.com/f/123770/1289x109/d363896826/bg-brands.png"
          alt="Фон для брендов"
          provider="storyblok"
          width="1170px"
          sizes="sm:100vw xxl:1170px"
        />
      </div>
      <h1 class="brandsPage__title">Бренды</h1>
    </div>

    <div class="container">
      <Brands :info="info" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Array,
      required: true,
    }
  }
}
</script>

<style lang="scss">
.brandsPage {
  padding: 40px 0;

  @media screen and (max-width: 767px) {
    padding: 0 0 40px;
  }

  &__header {
    text-align: center;
    padding: 32px;
    position: relative;
    max-width: 1170px;
    margin: 0 auto;
    margin-bottom: 50px;

    @media screen and (max-width: 1250px) {
      max-width: calc(100% - 80px);
    }

    @media screen and (max-width: 767px) {
      max-width: 100%;
      margin-bottom: 40px;
      padding: 30px 20px;
    }
  }

  &__background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;

    @media screen and (max-width: 767px) {
      border-radius: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;

      @media screen and (max-width: 767px) {
        border-radius: 0;
        object-position: 10% bottom;
      }
    }
  }

  &__title {
    position: relative;
    z-index: 2;
    margin: 0;
    font-size: 36px;
    line-height: 40px;

    @media screen and (max-width: 767px) {
      font-size: 28px;
      line-height: 32px;
    }
  }
}
</style>
