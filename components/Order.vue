<template>
  <div class="order" v-if="order">

    <div class="order__row">
      <div class="order__title">Номер заказа</div>
      <div class="order__info">№{{order.order_number}}</div>
    </div>

    <div class="order__row">
      <div class="order__title">Статус</div>
      <div class="order__info">
        <OrderStatus :status="order.status" />
      </div>
    </div>

    <div class="order__row">
      <div class="order__title">Сумма</div>
      <div class="order__info">
        {{order.price}} р.
      </div>
    </div>

    <div class="order__row" v-if="order.discount">
      <div class="order__title">Использован промокод</div>
      <div class="order__info">
        {{order.discount.name}}
      </div>
    </div>

    <div class="order__row">
      <div class="order__title">Товары</div>
      <div class="order__product" v-for="product in order.products" :key="product.uuid">
        {{product.content.title}} x {{product.count}}
      </div>
    </div>

    <div class="order__row">
      <div class="order__title">Дата</div>
      <div class="order__info">
        {{orderDate}}
      </div>
    </div>

    <div class="order__row" v-if="order.info.comment">
      <div class="order__title">Комментарий к заказу</div>
      <div class="order__info">
        {{order.info.comment}}
      </div>
    </div>

    <div class="order__row">
      <div class="order__title">Доставка</div>
      <div class="order__info">
        {{order.info.delivery}}
      </div>
    </div>

    <template v-if="order.info.delivery === 'курьером' || order.info.delivery === 'белпочта'">
      <div class="order__row">
        <div class="order__title">Город</div>
        <div class="order__info">
          {{order.info.city}}
        </div>
      </div>

      <div class="order__row">
        <div class="order__title">Улица</div>
        <div class="order__info">
          {{order.info.street}}
        </div>
      </div>

      <div class="order__row">
        <div class="order__title">Дом</div>
        <div class="order__info">
          {{order.info.home}}
        </div>
      </div>

      <div class="order__row" v-if="order.info.building">
        <div class="order__title">Корпус</div>
        <div class="order__info">
          {{order.info.building}}
        </div>
      </div>

      <div class="order__row" v-if="order.info.floor">
        <div class="order__title">Этаж</div>
        <div class="order__info">
          {{order.info.floor}}
        </div>
      </div>

      <div class="order__row" v-if="order.info.entrance">
        <div class="order__title">Подъезд</div>
        <div class="order__info">
          {{order.info.entrance}}
        </div>
      </div>

      <div class="order__row" v-if="order.info.flat">
        <div class="order__title">Квартира</div>
        <div class="order__info">
          {{order.info.flat}}
        </div>
      </div>
    </template>

    <div class="order__row">
      <div class="order__title">Телефон</div>
      <div class="order__info">
        {{order.info.phone}}
      </div>
    </div>

    <div class="order__row">
      <div class="order__title">Email</div>
      <div class="order__info">
        {{order.info.email}}
      </div>
    </div>

    <div class="order__row" v-if="order.info.office">
      <div class="order__title">Отделение Европочты</div>
      <div class="order__info">
        <!-- {{order.info.office}} -->
        {{order.info.office.WarehouseName}}
      </div>
    </div>

    <div class="order__row">
      <div class="order__title">Имя</div>
      <div class="order__info">
        {{order.info.firstname}} {{order.info.lastname}}
      </div>
    </div>

    <div class="order__row">
      <div class="order__title">Способ оплаты</div>
      <div class="order__info">
        {{getPaymethodText(order.info.paymethod)}}
      </div>
    </div>

    <!-- <div class="order__row"><strong>order.address</strong>: {{order.info.address}}</div> -->

    <div v-if="order.status === 'pending' && paymentData">
      <!-- {{paymentData}}
      <hr> -->
      <div>{{paymentData.actionCodeDescription}}</div>
      <button v-if="paymentData.errorCode !== '0' || orderStatus !== 2" type="button" class="button button--big" :class="isLoading ? 'button--loading' : ''" @click="pay">Перейти к оплате</button>
    </div>

    <!-- <div v-if="order.info.paymethod === 'онлайн' && order.status !== 'pending'">
      Оплачен
    </div> -->

  </div>
</template>

<script>
import { getPaymethodText } from '~/helpers/status.js';
import { db } from "~/plugins/firebase.js"
import { doc, collection, query, where, onSnapshot, updateDoc } from "firebase/firestore";
export default {
  data() {
    return {
      order: null,
      paymentData: null,
      isLoading: false,
      orderStatus: '',
      docId: null,
      paymentId: null,
    }
  },
  watch: {
    user() {
      if (this.user.uid && this.order === null) {
        this.getOrder();
      }
    },
    paymentIdComputed() {
      if (this.paymentId) {
        this.getPaymentInfo();
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
    orderDate() {
      const date = this.order.created_at;
      return new Date(date.seconds * 1000 + date.nanoseconds / 1000000).toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    },
    paymentIdComputed() {
      return this.paymentId;
    }
  },
  methods: {
    async getOrder() {
      const orderNumber = +this.$route.params.id;
      const paymentIdQuery = this.$route.query.orderId;

      if (!orderNumber) {
        // 404
      }

      if (orderNumber) {
        const q = query(collection(db, "orders"), where("order_number", "==", orderNumber));
        const orders = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (+orderNumber === doc.data().order_number) {
              this.order = doc.data();
              this.paymentId = doc.data().payment_id;
              this.docId = doc.id;
            }
          });
        });
      }

      if (paymentIdQuery) {
        const q = query(collection(db, "orders"), where("payment_id", "==", paymentIdQuery));
        const orders = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (paymentIdQuery === doc.data().payment_id) {
              this.order = doc.data();
              this.docId = doc.id;
            }
          });
        });

        const paymentData = await this.$axios.post('/payment/check-order', {
          paymentId: paymentIdQuery,
        });

        this.orderStatus = +paymentData.data.orderStatus;
        this.paymentData = paymentData.data;
      }
    },
    async getPaymentInfo() {
      if (this.order.status !== 'payed') {
        const paymentData = await this.$axios.post('/payment/check-order', {
          paymentId: this.paymentId,
        });
        this.orderStatus = +paymentData.data.orderStatus;

        if (paymentData.data.errorCode === '0' && this.docId && this.order.status === 'pending' && this.orderStatus === 2) {
          const ref = doc(db, "orders", this.docId);

          await updateDoc(ref, Object.assign({}, {
            status: 'payed',
          }));
        }

        this.paymentData = paymentData.data;
      }
    },
    async pay() {
      this.isLoading = true;
      const orderNumber = this.order.order_payment_number ? (this.order.order_payment_number + '').split('-') : this.order.order_number;
      const newOrderNumber = orderNumber.length && orderNumber[1] ? `${orderNumber[0]}-${+orderNumber[1] + 1}` : `${this.order.order_number}-1`

      let payment_id = '';
      let formUrl = '';
      const paymentData = await this.$axios.post('/payment/create-order', {
        orderNumber: newOrderNumber,
        sum: this.order.price,
        returnUrl: `${this.$config.siteURL}/checkout/success`,
      });

      if (paymentData.data.formUrl) {
        payment_id = paymentData.data.orderId;
        formUrl = paymentData.data.formUrl;
      }
      console.log(paymentData);
      const ref = doc(db, "orders", this.docId);

      await updateDoc(ref, {
        order_payment_number: newOrderNumber,
        payment_id: payment_id,
        formUrl: formUrl,
      });

      window.location.href = paymentData.data.formUrl;

      this.isLoading = false;
    },
    getPaymethodText(paymethod) {
      return getPaymethodText(paymethod);
    },
  },
  async fetch() {
    await this.getOrder()
  },
}
</script>

<style lang="scss">
.order {
  display: block;

  &__title {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 5px;
    color: #A6A6A6;
  }

  &__row {
    margin-bottom: 10px;
  }
}
</style>
