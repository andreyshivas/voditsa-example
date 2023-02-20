f<template>
  <div class="profilePage__content">
    <ProductsFavorite />
  </div>
</template>

<script>
import meta from "~/helpers/meta";

export default {
  head() {
    return meta({
      title: "Мои избранные товары. Интернет-магазин корейской косметики, купить корейскую косметику в Минске - Voditsa.by",
      description: "Ваши избранные товары на сайте интернет-магазина корейской косметики voditsa.by. Купить косметику в интернет-магазине Voditsa. ❤️ Популярные бренды корейской косметики. ⭐ Выгодные цены. ⭐ Скидки и акции. ✔️ Доставка по Минску и Беларуси.",
    }, null, this);
  },
};
</script>
