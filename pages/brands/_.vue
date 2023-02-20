<template>
  <div class="brandPage">
    <BrandPageHeader :info="story" />

    <div class="container">
      <div class="brandProducts" v-if="products.length > 0">
        <div class="relatedProducts__item" v-for="product in products" :key="product.uuid" >
          <ProductCard :product="product" />
        </div>
      </div>

      <h3 v-if="products.length === 0">Товаров не найдено</h3>

      <div class="brandPage__button-wrapper">
        <button type="button" @click="goToCatalog" class="button button--transparent">Смотреть в каталоге</button>
      </div>
    </div>
  </div>
</template>

<script>
import meta from "~/helpers/meta";

export default {
  head() {
    return meta({
      title: `${this.story.content.title}. Интернет-магазин корейской косметики, купить корейскую косметику в Минске - Voditsa.by`,
      description: `Купить косметику бренда ${this.story.content.title} в интернет-магазине корейской косметики Voditsa.by.  ❤️ Популярные бренды корейской косметики. ⭐ Выгодные цены. ⭐ Скидки и акции. ✔️ Доставка по Минску и Беларуси.`,
    }, null, this);
  },
  data () {
    return {
      story: { content: {} },
      products: [],
    }
  },
  methods: {
    goToCatalog() {
      this.$router.push({ path: `/catalog?brand=${this.story.slug}` });
    },
  },
  async asyncData (context) {
    let version = context.query._storyblok || context.isDev ? "draft" : "published";
    let path = context.route.path;
    let cache = context.store.state.cacheVersion ? context.store.state.cacheVersion : Math.floor(Date.now() / 1e3);

    const story = await context.app.$storyapi.get(`cdn/stories/${path}`, {
      version: version,
      cv: cache
    })

    const products = await context.app.$storyapi.get(`cdn/stories/`, {
      version: 'published',
      cv: cache,
      // sort_by: sort,
      excluding_fields: 'text,meta,body',
      per_page: 12,
      filter_query: {
        component: {
          in: 'product',
        },
        brand: {
          in: story.data.story.uuid
        }
      }
    })

    return {
      story: story.data.story,
      products: products.data.stories
    }
  }
}
</script>

<style lang="scss">
.brandPage {
  padding: 40px 0;

  @media screen and (max-width: 767px) {
    padding: 20px 0 40px;
  }

  &__button-wrapper {
    text-align: center;
    padding-top: 30px;
  }
}

.brandProducts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  row-gap: 60px;
  margin-bottom: 20px;

  @media screen and (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    row-gap: 20px;
  }
}
</style>
