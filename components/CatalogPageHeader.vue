<template>
  <div class="catalogPageHeader">
    <div class="catalogPageHeader__wrapper">
      <div class="catalogPageHeader__background" style="background-color: #E4F9FF;">
        <nuxt-picture
          src="https://a.storyblok.com/f/123770/1025x109/874a4ad1cd/bg-catalog.png"
          alt="Фон каталога"
          provider="storyblok"
          width="921px"
          height="142px"
          sizes="sm:100vw xxl:921px"
        />

      </div>
      <div class="catalogPageHeader__breadcrumbs">
        <Breadcrumbs :list="breadcrumbsList" />
      </div>
      <h1 class="catalogPageHeader__title">{{info.story.content.title}}</h1>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '~/components/Breadcrumbs.vue';

export default {
  components: {
    Breadcrumbs,
  },
  props: {
    parents: {
      type: Array,
      required: true,
    },
    info: {
      type: Object,
      required: true,
    }
  },
  computed: {
    breadcrumbsList() {
      const parentsPages = [...this.parents];
      parentsPages.sort((a, b) => {
        if (a.full_slug.length > b.full_slug.length) {
          return 1;
        } else {
          return -1;
        }
      });
      const result = [
        {
          title: 'Главная',
          link: ''
        },
      ];
      parentsPages.forEach((item) => {
        result.push({
          title: item.content.title,
          link: item.full_slug
        });
      });

      result.push({
        title: this.info.story.content.title
      });

      return result;
    }
  }
}
</script>

<style lang="scss">
.catalogPageHeader {
  max-width: 1170px;
  margin: 0 auto;
  margin-bottom: 50px;

  @media screen and (max-width: 767px) {
    margin-bottom: 30px;
  }

  &__wrapper {
    padding: 32px;
    position: relative;
    margin-left: auto;
    max-width: calc(80% - 15px);

    @media screen and (max-width: 767px) {
      max-width: 100%;
      padding: 20px;
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

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;

      @media screen and (max-width: 767px) {
        border-radius: 0;
      }
    }

    @media screen and (max-width: 767px) {
      border-radius: 0;
    }
  }

  &__breadcrumbs {
    position: relative;
    z-index: 2;
  }

  &__title {
    position: relative;
    z-index: 2;
    margin: 0;
    font-size: 48px;

    @media screen and (max-width: 1023px) {
      font-size: 38px;
    }

    @media screen and (max-width: 767px) {
      font-size: 28px;
    }
  }
}
</style>
