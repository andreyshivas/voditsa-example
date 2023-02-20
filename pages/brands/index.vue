<template>
  <div>
    <BrandsPage :info="stories" />
  </div>
</template>

<script>
import meta from "~/helpers/meta";

export default {
  head() {
    return meta({
      title: "Бренды. Интернет-магазин корейской косметики, купить корейскую косметику в Минске - Voditsa.by",
      description: "Бренды на сайте интернет-магазина корейской косметики voditsa.by. Купить косметику в интернет-магазине Voditsa. ❤️ Популярные бренды корейской косметики. ⭐ Выгодные цены. ⭐ Скидки и акции. ✔️ Доставка по Минску и Беларуси.",
    }, null, this);
  },
  data () {
    return {
      stories: [],
    }
  },
  asyncData (context) {
    let cache = context.store.state.cacheVersion ? context.store.state.cacheVersion : Math.floor(Date.now() / 1e3);

    return context.app.$storyapi.get(`cdn/stories/`, {
      version: 'published',
      cv: cache,
      starts_with: 'brands/',
      is_startpage: false,
      excluding_fields: 'text,meta,body',
      sort_by: "content.title:asc",
      per_page: 100,
    }).then((res) => {
      return res.data
    }).catch((res) => {
      if (!res.response) {
        console.error(res)
        context.error({ statusCode: 404, message: 'Failed to receive content form api' })
      } else {
        console.error(res.response.data)
        context.error({ statusCode: res.response.status, message: res.response.data })
      }
    })
  }
}
</script>
