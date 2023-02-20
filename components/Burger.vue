<template>
  <button class="burger" type="button" aria-label="Бургер меню" @click="toggleMenu" :class="this.$store.state.isActiveMenu ? 'active' : ''">
    <span class="burger__wrapper">
      <span class="burger__line"></span>
      <span class="burger__line"></span>
      <span class="burger__line"></span>
    </span>
  </button>
</template>

<script>
export default {
  methods: {
    toggleMenu() {
      this.$store.commit('setMenuState', !this.$store.state.isActiveMenu);
    }
  }
}
</script>

<style lang="scss">
.burger {
  display: block;
  position: relative;
  box-shadow: none;
  width: 40px;
  height: 40px;
  padding: 8px;
  border: 0;
  margin-left: -8px;
  background: transparent !important;

  &__wrapper {
    display: block;
    position: relative;
    height: 24px;
    margin: 0 auto;
  }

  &__line {
    position: absolute;
    display: block;
    width: 100%;
    height: 1px;
    top: 50%;
    left: 0;
    background: #212121;
    transition: transform 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;

    &:nth-child(1) {
      transform: translateY(-7px);
    }

    &:nth-child(3) {
      transform: translateY(7px);
    }
  }

  &.active {
    .burger__line {
      &:nth-child(1) {
        transform: translateY(0) rotate(45deg);
      }

      &:nth-child(2) {
        transform: scale(0);
      }

      &:nth-child(3) {
        transform: translateY(0) rotate(-45deg);
      }
    }
  }
}
</style>
