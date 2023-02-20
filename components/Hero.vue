<template>
  <section class="hero">
    <div class="container">
      <div class="hero__background">
        <!-- <nuxt-picture
          src="https://a.storyblok.com/f/123770/1920x510/1663a3fc3f/bg-hero.png"
          alt="Корейская косметика"
          provider="storyblok"
          width="1920"
          height="510"
          sizes="sm:640px xxl:1920px"
        /> -->

        <picture>
          <source
            srcset="
              https://a.storyblok.com/f/123770/1920x510/1663a3fc3f/bg-hero.png/m/filters:format(webp) 1920w,
              https://a.storyblok.com/f/123770/1920x510/1663a3fc3f/bg-hero.png/m/1000x0:1720x510/filters:format(webp) 720w
            "
            sizes="
              (max-width: 360px) 100vw,
              1920px
            "
            type="image/webp"
          />
          <img
            src="https://a.storyblok.com/f/123770/1920x510/1663a3fc3f/bg-hero.png"
            srcset="
              https://a.storyblok.com/f/123770/1920x510/1663a3fc3f/bg-hero.png/m/filters:format(png) 1920w,
              https://a.storyblok.com/f/123770/1920x510/1663a3fc3f/bg-hero.png/m/1000x0:1720x510/filters:format(png) 720w
            "
            sizes="
              (max-width: 360px) 100vw,
              1920px
            "
            width="1920"
            height="510"
            alt="Корейская косметика"
          />
        </picture>
      </div>

      <div class="hero__wrapper">
        <h1 class="hero__title">Корейская косметика от популярных брендов</h1>
        <nuxt-link class="hero__button button" to="/catalog"
          >В магазин</nuxt-link
        >
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero {
  background: #f6ee81;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 510px;
  overflow: hidden;
  width: 100%;
  max-width: 1980px;
  margin: 0 auto;

  @media screen and (max-width: 1200px) {
    min-height: 440px;
  }

  @media screen and (max-width: 1023px) {
    min-height: 340px;
  }

  &__background {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    user-select: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center bottom;

      @media screen and (max-width: 767px) {
        object-position: 68% bottom;
      }

      @media screen and (max-width: 360px) {
        object-position: left bottom;
      }
    }
  }

  &__wrapper {
    position: relative;
    z-index: 2;
    padding-top: 160px;
    padding-bottom: 120px;

    @media screen and (max-width: 1200px) {
      padding: 140px 0 100px;
    }

    @media screen and (max-width: 1023px) {
      padding: 100px 0 80px;
    }

    @media screen and (max-width: 767px) {
      padding: 60px 0;
    }
  }

  &__title {
    max-width: 760px;

    @media screen and (max-width: 767px) {
      max-width: 580px;
    }
  }

  &__button {
    &:hover {
      color: #fff;
    }
  }
}
</style>
