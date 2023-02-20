<template>
  <div class="breadcrumbs" v-if="list && list.length">
    <ul class="breadcrumbs__list">
      <li class="breadcrumbs__item" v-for="(item, index) in list" :key="index">
        <nuxt-link v-if="item.link || item.link === ''" class="breadcrumbs__link" :to="`/${item.link.replace(/\/$/, '')}`">{{item.title}}</nuxt-link>
        <template v-else>{{item.title}}</template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
    }
  },

  jsonld() {
    if (!this.list && this.list.length < 1) {
      return;
    }

    const url = `${this.$config.siteURL}${this.$route.path}`;
    const list = [];

    this.list.forEach((item, index) => {
      let link = `${this.$config.siteURL}/${item.link}`;

      if (!item.link) {
        link = url;
      }

      if (item.link === '') {
        link = this.$config.siteURL;
      }

      const listItem = {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@id": link,
          "name": item.title
        }
      }

      list.push(listItem);
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}/#breadcrumb`,
      "itemListElement": list
    };
  },
}
</script>

<style lang="scss">
.breadcrumbs {
  &__list {
    display: flex;
    flex-wrap: wrap;
    margin-left: -3px;
    margin-right: -3px;
  }

  &__item {
    margin: 0 3px 5px;
    font-size: 12px;
    line-height: 16px;
    color: #898989;

    &:after {
      content: '/';
      margin-left: 5px;
    }

    &:last-child {
      &::after {
        display: none;
      }
    }
  }

  &__link {
    color: #898989;
    text-decoration: none;
    transition: color .2s ease;

    &:hover {
      color: var(--color-text-main);
    }
  }
}
</style>
