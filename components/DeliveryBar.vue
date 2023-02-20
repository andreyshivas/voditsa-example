<template>
  <div class="deliveryBar">
    <div class="deliveryBar__wrapper" v-if="sum < 40">
      <div class="deliveryBar__bar-wrapper">
        <div class="deliveryBar__bar" :style="`width: ${sum < 40 ? ( sum / 40 * 100 ) : '100'}%;`"></div>
      </div>

      <div class="deliveryBar__text">
        До бесплатной доставки осталось <strong>{{(40 - sum).toFixed(2)}} р.</strong>
      </div>
    </div>

    <div class="deliveryBar__free" v-if="sum >= 40">
      Бесплатная доставка
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sum: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style lang="scss">
.deliveryBar {
  margin-bottom: 32px;

  @media screen and (max-width: 767px) {
    margin-bottom: 24px;
  }

  &__wrapper {
    background: var(--color-bg);
    padding: 20px 30px;

    @media screen and (max-width: 767px) {
      padding: 15px;
    }
  }

  &__bar-wrapper {
    width: 100%;
    height: 4px;
    background: #d2d2d2;
    border-radius: 2px;
    position: relative;
    margin-bottom: 12px;
  }

  &__bar {
    left: 0;
    background: #000;
    position: absolute;
    height: 100%;
    border-radius: 2px;
  }

  &__text {
    font-size: 14px;
    line-height: 18px;
  }

  &__free {
    display: inline-flex;
    background: var(--color-main);
    font-size: 16px;
    line-height: 20px;
    padding: 8px 12px;
  }
}
</style>
