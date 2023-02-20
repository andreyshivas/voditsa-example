<template>
  <div class="brandPageHeader">
    <div class="container">
      <div class="brandPageHeader__wrapper">
        <div class="brandPageHeader__breadcrumbs">
          <Breadcrumbs :list="breadcrumbsList" />
        </div>
        <div class="brandPageHeader__logo-wrapper">
          <div class="brandPageHeader__logo">
            <nuxt-picture
              v-if="info.content.logo && info.content.logo.filename"
              width="158"
              sizes="xs:158px"
              provider="storyblok"
              loading="lazy"
              :src="info.content.logo.filename"
            />
          </div>
        </div>
        <h1 class="brandPageHeader__title">{{info.content.title}}</h1>
        <div class="brandPageHeader__description">
          {{info.content.description}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      breadcrumbsList: [
        {
          title: 'Главная',
          link: ''
        },
        {
          title: 'Бренды',
          link: 'brands'
        },
        {
          title: this.info.content.title,
        },
      ]
    }
  }
}
</script>

<style lang="scss">
.brandPageHeader {
  margin-bottom: 50px;
  min-height: 140px;

  @media screen and (max-width: 767px) {
    margin-bottom: 40px;
  }

  &__wrapper {
    position: relative;
    padding-left: 170px;
    margin-left: auto;
    max-width: calc(80% - 15px);

    @media screen and (max-width: 767px) {
      max-width: 100%;
      display: block;
      padding: 0;
    }
  }

  &__logo-wrapper {
    background: #fff;
    border: 1px solid #EFEFEF;
    border-radius: 30px;
    margin-right: 32px;
    flex-shrink: 0;
    padding: 15px;
    width: 140px;
    position: absolute;
    left: 0;
    top: 0;

    @media screen and (max-width: 767px) {
      border-radius: 20px;
      position: relative;
      margin: 20px 0;
    }
  }

  &__logo {
    overflow: hidden;
    padding-top: 100%;
    position: relative;
    border-radius: 30px;

    @media screen and (max-width: 767px) {
      border-radius: 20px;
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

  &__breadcrumbs {
    position: relative;
    z-index: 2;
  }

  &__title {
    position: relative;
    z-index: 2;
  }

  &__description {
    margin-top: 10px;
  }
}
</style>
