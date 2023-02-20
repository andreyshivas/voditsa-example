<template>
  <div class="productPage">
    <div class="container">
      <div class="productPage__breadcrumbs">
        <Breadcrumbs :list="breadcrumbsList" />
      </div>

      <Product :info="info.pageData" />
      <ProductInfo :info="info.pageData" />
    </div>

    <RelatedProducts :productInfo="info.pageData.story" />
  </div>
</template>

<script>
import {format, add } from 'date-fns';

export default {
  props: {
    info: {
      type: Object,
      required: true,
    }
  },
  jsonld() {
    if (!this.info.pageData) {
      return;
    }

    const url = `${this.$config.siteURL}${this.$route.path}`;
    const category = this.breadcrumbsList[this.breadcrumbsList.length - 2];

    let date = add(new Date(), {
      months: 12,
    });

    date = format(date, 'yyyy-MM-dd');

    return {
      '@context': 'https://schema.org',
      "@graph": [{
        '@type': 'Product',
        "brand": {
          "@type": "Brand",
          "name": this.info.pageData.rels[0]?.content.title,
        },
        "sku": this.info.pageData.story.id,
        "gtin": this.info.pageData.story.content.gtin,
        "name": this.info.pageData.story.content.title,
        "description": this.info.pageData.story.content.description,
        "category": category.title,
        "mainEntityOfPage": {
            "@id": `${url}/#webpage`
        },
        "offers": {
            "@type": "Offer",
            "price":  this.info.pageData.story.content.price,
            "priceCurrency": "BYN",
            "priceValidUntil": date,
            "availability": "https://schema.org/InStock",
            "itemCondition": "NewCondition",
            "url": url,
            "seller": {
              "@type": "Organization",
              "@id": "https://voditsa.vercel.app/",
              "name": "Voditsa.by",
              "url": "https://voditsa.vercel.app",
              "logo": "https://voditsa.vercel.app/images/logo.png",
            }
        },
        "@id": `${url}/#richSnippet`,
        "image": {
          "@id": this.info.pageData.story.content.image.filename
        }
      }]
    };
  },
  computed: {
    breadcrumbsList() {
      const parentsPages = [...this.info.parentsPages];
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
        title: this.info.pageData.story.content.title
      });

      return result;
    }
  }
}
</script>

<style lang="scss">
.productPage {
  padding: 60px 0 10px;

  @media screen and (max-width: 1023px) {
    padding-top: 40px;
  }

  @media screen and (max-width: 767px) {
    padding-top: 30px;
  }

  &__breadcrumbs {
    margin-bottom: 12px;
  }

  &__wrapper {
    display: grid;
    gap: 30px;
    grid-template-columns: 1fr 1fr;
  }

  &__photo {
    background: var(--color-bg);
    padding-top: 50%;
  }
}
</style>
