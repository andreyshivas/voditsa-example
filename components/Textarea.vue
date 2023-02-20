<template>
  <div class="textarea">
    <label class="textarea__label" :for="name">{{label}}</label>
    <textarea class="textarea__field" @input="$emit('input', $event.target.value)" :placeholder="placeholder" :name="name" :id="name" :required="required" :readonly="readonly" :value="value"></textarea>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.textarea {
  display: block;
  margin-bottom: 20px;

  &__label {
    display: block;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 5px;
  }

  &__field {
    display: block;
    font-size: 16px;
    line-height: 20px;
    color: #212121;
    border: 1px solid #bababa;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    padding: 12px 16px;
    border-radius: 0;
    height: 150px;
    max-width: 100%;
    width: 100%;
    transition: color 0.2s ease, border-color 0.2s ease;

    &:focus,
    &:hover {
      color: #000;
      border: 1px solid #000;
    }
  }
}
</style>
