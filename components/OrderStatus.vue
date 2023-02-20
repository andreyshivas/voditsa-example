<template>
  <div class="orderStatus" :class="`orderStatus--${status}`">
    {{getStatusText(status)}}
  </div>
</template>

<script>
import { getStatusText } from "~/helpers/status";

export default {
  props: {
    status: {
      type: String,
      required: false,
    }
  },
  methods: {
    getStatusText(status) {
      return getStatusText(status);
    },
  },
}
</script>

<style lang="scss">
.orderStatus {
  padding: 5px 10px;
  display: inline-block;
  background: #f2f2f2;

  &--pending {
    background: #f2f2f2;
  }

  &--payed {
    background: #c0ffeb;
  }
}
</style>
