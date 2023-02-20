<template>
  <div class="discount">
    <div class="discount__form" v-if="!coupon">
      <input class="discount__input" type="text" name="discount" placeholder="Промокод" v-model="discount">
      <button type="button" class="discount__button button button--transparent" @click="addCoupon">Применить</button>
      <div>{{error}}</div>
    </div>
  </div>
</template>

<script>
import { db } from "~/plugins/firebase.js"
import { doc, collection, query, where, getDoc, } from "firebase/firestore";
export default {
  data() {
    return {
      discount: '',
      error: null,
    }
  },
  watch: {
    coupon(oldValue, newValue) {
      console.log('watch', oldValue, newValue);
      // this.checkCoupon();
    }
  },
  computed: {
    coupon() {
      return this.$store.state.userProfile.discount
    },
    discountPrice() {
      return this.$store.getters.cartPrice.discountPrice;
    },
  },
  methods: {
    async checkCoupon() {
      const docRef = doc(db, "coupons", this.coupon.name);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const coupon = docSnap.data();
      console.log(coupon);

        if (coupon.active) {
          this.$store.dispatch('setDiscount', coupon);
        } else {
          this.$store.dispatch('setDiscount', null);
        }
      } else {
        this.$store.dispatch('setDiscount', null);
      }
    },
    async addCoupon() {
      const docRef = doc(db, "coupons", this.discount);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const coupon = docSnap.data();
        this.error = null;

        if (coupon.active) {
          this.$store.dispatch('setDiscount', coupon);
        } else {
          this.error = 'Купон не активен';
        }
      } else {
        this.error = 'Промокод не найден';
      }
    },
    async removeCoupon() {
      this.$store.dispatch('setDiscount', null);
      this.error = null;
    },
  },
}
</script>

<style lang="scss">
.discount {
  &__form {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input {
    max-width: 220px;
    height: 46px;
    border: 1px dotted #212121;
    background: #fff;
    outline: none;
    font-size: 16px;
    line-height: 20px;
    padding: 13px 15px;

    @media screen and (max-width: 420px) {
      max-width: calc(100% - 156px);
    }

    @media screen and (max-width: 340px) {
      max-width: calc(100% - 136px);
    }
  }

  &__button {
    flex-shrink: 0;
    padding-top: 11px;
    padding-bottom: 11px;
  }
}
</style>
