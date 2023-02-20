<template>
  <div class="input">
    <label class="input__label" :for="name">{{label}}</label>
    <input class="input__field" :type="type" @input="$emit('input', $event.target.value)" :placeholder="placeholder" :name="name" :id="name" :required="required" :readonly="readonly" :autocomplete="autocomplete" :value="value">
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
    type: {
      type: String,
      default: 'text'
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
    },
    autocomplete: {
      type: [String, Boolean],
      default: false
    },
  }
}
</script>

<style lang="scss">
.input {
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
    min-height: 50px;
    max-width: 100%;
    width: 100%;
    transition: color 0.2s ease, border-color 0.2s ease;

    &:focus,
    &:hover {
      color: #000;
      border: 1px solid #000;
    }

    &:read-only {
      background: #f5f5f5;
      border: 1px solid #bababa;
      color: #212121;
    }

    &:invalid {
      .show-error & {
        border: 1px solid var(--color-error);
      }
    }
  }
}
</style>
