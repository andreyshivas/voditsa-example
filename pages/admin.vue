<template>
  <div class="adminOrders">
    <div class="container">
      <div class="orders">
        <div class="orders__wrapper">
          <div class="orders__empty" v-if="orders !== null && orders.length === 0">
            <div class="orders__empty-text">
              У вас еще не было создано заказов
            </div>
            <nuxt-link to="/catalog" class="button">Перейти в каталог</nuxt-link>
          </div>
          <div class="orders__table" v-if="orders !== null && orders.length">
            <div class="orders__header">
              <div class="orders__header-col">
                Заказ
              </div>
              <div class="orders__header-col">
                Имя
              </div>
              <div class="orders__header-col">
                Дата
              </div>
              <div class="orders__header-col">
                Статус
              </div>
              <div class="orders__header-col">
                Сумма
              </div>
              <div class="orders__header-col">
                Кол-во товаров
              </div>
              <div class="orders__header-col">

              </div>
            </div>

            <div class="orders__row" v-for="(order, index) in orders" :key="index + order.user">
              <div class="orders__col">
                <div class="orders__col-title">Заказ</div>
                №{{order.order_number}}
              </div>
              <div class="orders__col">
                <div class="orders__col-title">Заказ</div>
                {{order.info.firstname}} {{order.info.lastname}}
              </div>
              <div class="orders__col">
                <div class="orders__col-title">Дата</div>
                {{formattedDate(order.created_at)}}
              </div>
              <div class="orders__col">
                <div class="orders__col-title">Статус</div>
                <OrderStatus :status="order.status" />
              </div>
              <div class="orders__col">
                <div class="orders__col-title">Сумма</div>
                {{order.price}} р.
              </div>
              <div class="orders__col">
                <div class="orders__col-title">Количество</div>
                {{productsCount(order.products)}}
                </div>
              <div class="orders__col">
                <nuxt-link :to="`/profile/orders/${order.order_number}`" class="button orders__btn">Подробнее</nuxt-link>
              </div>
              <!-- <div class="orders__col" v-for="product in order.products" :key="product.uuid">
                {{product.content.title}}
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>import { db } from "~/plugins/firebase.js"
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      orders: null,
    }
  },
  watch: {
    user() {
      if (this.user.uid && this.orders === null) {
        if (this.userProfile.is_admin) {
          this.getOrders();
        } else {
          this.$router.push("/");
        }
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
  },
  methods: {
    async getOrders() {
      let orders = [];
      if (this.user && this.user.uid) {

        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((doc) => {
          orders.push(doc.data());
        });

        orders = orders.sort((a, b) => {
          return b.created_at.seconds - a.created_at.seconds;
        });

        this.orders = orders;
      } else {
        this.orders = null;
      }
    },
    formattedDate(date) {
      return date.toDate().toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric',  });
    },
    productsCount(products) {
      let count = 0;
      products.forEach((product) => {
        count += product.count;
      });
      return count;
    }
  },
  async fetch() {
    await this.getOrders()
  },
}
</script>

<style lang="scss">
.adminOrders {
  padding: 100px 0;
}

.orders {
  &__table {
    display: table;
    width: 100%;

    @media screen and (max-width: 1023px) {
      display: block;
    }
  }

  &__header {
    display: table-header-group;

    @media screen and (max-width: 1023px) {
      display: none;
    }
  }

  &__header-col {
    display: table-cell;
    padding: 10px;
    font-weight: 700;
    border-bottom: 1px solid #e6e6e6;

    @media screen and (max-width: 1023px) {
      border: 0;
    }
  }

  &__row {
    display: table-row;

    @media screen and (max-width: 1023px) {
      display: block;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #212121;
    }
  }

  &__col {
    display: table-cell;
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;
    height: 70px;
    vertical-align: middle;

    @media screen and (max-width: 1023px) {
      display: block;
      margin-bottom: 10px;
      border: 0;
      height: auto;
      padding: 0;
    }
  }

  &__col-title {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 5px;
    color: #A6A6A6;
    display: none;

    @media screen and (max-width: 1023px) {
      display: block;
    }
  }

  &__empty {
    padding: 15px;
    background: #f2f2f2;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    @media screen and (max-width: 640px) {
      display: block;
      text-align: center;
    }
  }

  &__empty-text {
    margin-right: 15px;

    @media screen and (max-width: 640px) {
      margin: 0 auto 15px;
    }
  }
}
</style>
