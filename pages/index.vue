<template>
  <div>
    <Hero />
    <LazyHydrate when-visible>
      <Categories />
    </LazyHydrate>
    <ProductsPreview :link="{ title: 'Новинки', url: '/catalog' }" />

    <LazyHydrate when-visible>
      <BrandsPreview />
    </LazyHydrate>

    <LazyHydrate never>
      <Instagram />
    </LazyHydrate>
  </div>
</template>

<script>
import meta from "~/helpers/meta";
import LazyHydrate from 'vue-lazy-hydration';

export default {
  components: {
    LazyHydrate,
  },
  head() {
    return meta(null, null, this);
  },
};
</script>
