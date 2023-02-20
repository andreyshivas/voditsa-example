<template>
  <div class="productInfo">
    <div class="productInfo__controls">
      <button @click="setTab(1)" class="productInfo__button" v-if="info.story.content.info" :class="activeItem === 1 ? 'active' : ''">Описание</button>
      <button @click="setTab(2)" class="productInfo__button" v-if="info.story.content.composition" :class="activeItem === 2 ? 'active' : ''">Состав</button>
      <button @click="setTab(3)" class="productInfo__button" v-if="info.story.content.use" :class="activeItem === 3 ? 'active' : ''">Применение</button>
    </div>

    <div class="productInfo__tab" v-if="info.story.content.info" v-show="activeItem === 1">
      <h3 class="productInfo__title">{{info.story.content.title}}</h3>

      <div class="productInfo__description">{{info.story.content.description}} <span v-if="info.story.content.size">({{info.story.content.size}})</span></div>


      <rich-text-renderer :document="info.story.content.info" />
    </div>
    <div class="productInfo__tab" v-if="info.story.content.composition" v-show="activeItem === 2">
      <rich-text-renderer :document="info.story.content.composition" />
    </div>
    <div class="productInfo__tab" v-if="info.story.content.use" v-show="activeItem === 3">
      <rich-text-renderer :document="info.story.content.use" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeItem: 1
    }
  },
  methods: {
    setTab(id) {
      this.activeItem = id;
    }
  }
}
</script>

<style lang="scss">
.productInfo {
  &__controls {
    display: flex;
    position: relative;
    overflow: auto;
    white-space: nowrap;
    font-size: 0;
    line-height: 0;

    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: #E5E5E5;
    }
  }

  &__button {
    display: block;
    position: relative;
    z-index: 2;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
    font-weight: 700;
    color: #212121;
    background: transparent;
    box-shadow: none;
    cursor: pointer;
    border: 0;
    padding: 13px 20px;
    border-bottom: 2px solid transparent;
    transition: border-color .2s;
    margin: 0;

    @media screen and (max-width: 767px) {
      padding-left: 15px;
      padding-right: 15px;
    }

    &.active,
    &:hover {
      border-bottom: 2px solid #212121;
    }
  }

  &__tab {
    padding: 30px 0;
  }

  &__title {
    font-size: 18px;
    line-height: 36px;
    margin-bottom: 0px;
  }

  &__description {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 36px;
    color: #A6A6A6;
  }
}
</style>
