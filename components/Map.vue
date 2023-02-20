<template>
  <div class="map">
    <yandex-map
      :coords="coords"
      :zoom="12"
      :settings="settings"
    >
      <ymap-marker @click="onClick(item)" cluster-name="1" :coords="[item.Latitude, item.Longitude]" :marker-id="item.Address1Id" :hint-content="item.WarehouseName" v-for="item in filteredOffices" :key="item.Address1Id" />
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  components: { yandexMap, ymapMarker },
  props: {
    offices: {
      type: Array,
      required: true,
    },
    office: {
      type: Object,
      required: false,
    },
  },
  watch: {
    office() {
      if (this.office) {
        this.coords = [this.office.Latitude, this.office.Longitude];
      }
    },
  },
  data() {
    return {
      settings: {
        apiKey: 'bfceef85-70b2-413e-b94e-25dfe0c58a05',
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1',
      },
      coords: [
        53.903173,
        27.553477,
      ],
    }
  },
  computed: {
    filteredOffices() {
      if (this.office) {
        return [this.office];
      }
      return this.offices;
    },
  },
  methods: {
    onClick(office) {
      this.$emit('select', office);
    },
  },
  created() {
    if (this.office) {
      this.coords = [this.office.Latitude, this.office.Longitude];
    }
  },
}
</script>

<style lang="scss">
.ymap-container {
  height: 300px;
  background: var(--color-bg);
  margin-bottom: 20px;
}
</style>
