<template>
  <nuxt-link :to="`/${brand.full_slug.replace(/\/$/, '')}`" class="brandCard">
    <div class="brandCard__image-wrapper">
      <div class="brandCard__image">
        <nuxt-picture
          v-if="brand.content.logo && brand.content.logo.filename"
          :src="brand.content.logo.filename"
          :alt="brand.content.title"
          provider="storyblok"
          width="158px"
          height="158px"
          fit="in"
          sizes="xl:316px lg:316px md:316px sm:158px xs:158px"
          loading="lazy"
        />
      </div>
    </div>

    <span class="brandCard__title">{{brand.content.title}}</span>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    brand: {
      type: Object,
      require: true,
    }
  }
}
</script>

<style lang="scss">
.brandCard {
  display: block;
  text-decoration: none;
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  text-align: center;

  &:hover {
    .brandCard__image-wrapper {
      border: 1px solid #000;
    }

    .brandCard__title {
      background-size: 100% 100%;
    }
  }

  &__image-wrapper {
    background: #fff;
    border: 1px solid #EFEFEF;
    border-radius: 30px;
    margin-bottom: 12px;
    padding: 15px;
    transition: border-color .2s ease;

    @media screen and (max-width: 767px) {
      border-radius: 20px;
      margin-bottom: 4px;
    }
  }

  &__image {
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

  &__title {
    color: #000;
    background-size: 0 100%;
    background-repeat: no-repeat;
    background-image: linear-gradient(#fff0 calc(100% - 1px), #000 1px);
    transition: background-size 0.3s;

    @media screen and (max-width: 767px) {
      font-size: 14px;
      line-height: 18px;
    }
  }
}
</style>
