<template>
  <div class="brands">
    <BrandCard :brand="item" v-for="(item, index) in info" :key="item.uuid" />
  </div>
</template>


<script>
import BrandCard from '~/components/BrandCard.vue';

export default {
  components: {
    BrandCard,
  },
  props: {
    info: {
      type: Array,
      required: true,
    }
  }
}
</script>

<style lang="scss">
.brands {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  margin-bottom: 40px;

  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    row-gap: 20px;
  }

  @media screen and (max-width: 360px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
