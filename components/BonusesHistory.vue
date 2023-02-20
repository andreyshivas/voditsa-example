<template>
  <div class="bonusesHistory">
    <div class="bonusesHistory__wrapper">
      <div class="bonusesHistory__table" v-if="bonuses !== null && bonuses.length">
        <div class="bonusesHistory__header">
          <div class="bonusesHistory__header-col">
            Событие
          </div>
          <div class="bonusesHistory__header-col">
            Дата
          </div>
          <div class="bonusesHistory__header-col">
            Кол-во баллов
          </div>
        </div>

        <div class="bonusesHistory__row" v-for="(item, index) in bonuses" :key="index">
          <div class="bonusesHistory__col">
            <div class="bonusesHistory__col-title">Событие</div>
            <div class="bonusesHistory__col-text" v-if="item.type === 'add' && item.order_number">
              Заказ №{{ item.order_number }}
            </div>
            <div class="bonusesHistory__col-text" v-if="item.type === 'remove' && item.order_number">
              Заказ №{{ item.order_number }} возвращен
            </div>
          </div>
          <div class="bonusesHistory__col">
            <div class="bonusesHistory__col-title">Дата</div>
            {{formattedDate(item.created_at)}}
          </div>
          <div class="bonusesHistory__col">
            <div class="bonusesHistory__col-title">Количество</div>
            <div class="bonusesHistory__value--add" v-if="item.type === 'add'">
              +{{ item.bonuses }}
            </div>
            <div class="bonusesHistory__value--remove" v-if="item.type === 'remove'">
              -{{ item.bonuses }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>import { db } from "~/plugins/firebase.js"
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";

export default {
  data() {
    return {
      bonuses: null,
      unsubscribe: null,
    }
  },
  watch: {
    user() {
      if (this.user.uid && this.bonuses === null) {
        this.geBonuses();
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
    async geBonuses() {
      if (this.user && this.user.uid) {

        const q = query(collection(db, "bonuses"), where("user", "==", this.user.uid));
        this.unsubscribe = onSnapshot(q, (querySnapshot) => {
          const bonuses = [];
          querySnapshot.forEach((doc) => {
              bonuses.push(doc.data());
          });

          this.bonuses = bonuses.sort((a, b) => {
            return b.created_at.seconds - a.created_at.seconds;
          });;
        });
      } else {
        this.bonuses = null;
      }
    },
    formattedDate(date) {
      return date.toDate().toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
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
    await this.geBonuses()
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
</script>

<style lang="scss">
.bonusesHistory {
  margin-top: 40px;

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

  &__value--add {
    color: green;
  }

  &__value--remove {
    color: red;
  }
}
</style>
