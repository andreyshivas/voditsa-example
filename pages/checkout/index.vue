<template>
  <div class="checkoutPage">
    <div class="container">
      <template v-if="products && products.length > 0">

        <h1 class="checkoutPage__title">Оформление заказа</h1>

        <form action="" method="post" @submit.prevent="createOrder" class="checkoutPage__wrapper">
          <div class="checkoutPage__form">
            <h3 class="checkoutPage__subtitle">Личная информация</h3>

            <Input type="text" label="Имя" placeholder="Имя" v-model="firstname" name="firstname" :class="firstInput ? '' : 'show-error'" :required="true" />
            <Input type="text" label="Фамилия" placeholder="Фамилия" v-model="lastname" name="lastname" :class="firstInput ? '' : 'show-error'" :required="true" />
            <Input type="email" label="Email" placeholder="Email" v-model="email" name="email" :class="firstInput ? '' : 'show-error'" :required="true" :readonly="user ? true : false" :autocomplete="user ? 'off' : false" />
            <Input type="tel" label="Телефон" placeholder="Телефон" v-model="phone" name="phone" :class="firstInput ? '' : 'show-error'" :required="true" />

            <h3 class="checkoutPage__subtitle">Доставка</h3>

            <div class="checkoutPage__delivery-wrapper">

              <div class="checkoutPage__delivery-items">
                <label class="radio">
                  <input class="radio__input" type="radio" name="delivery" v-model="delivery" value="самовывоз" />
                  <div class="radio__item"></div>
                  <div class="radio__text">Самовывоз</div>
                </label>

                <label class="radio">
                  <input class="radio__input" type="radio" name="delivery" v-model="delivery" value="курьером" />
                  <div class="radio__item"></div>
                  <div class="radio__text">Курьером по Минску</div>
                </label>

                <label class="radio">
                  <input class="radio__input" type="radio" name="delivery" v-model="delivery" value="белпочта" />
                  <div class="radio__item"></div>
                  <div class="radio__text">Белпочта</div>
                </label>

                <label class="radio">
                  <input class="radio__input" type="radio" name="delivery" v-model="delivery" value="европочта" />
                  <div class="radio__item"></div>
                  <div class="radio__text">Европочта</div>
                </label>
              </div>

              <template v-if="delivery === 'самовывоз'">

                <h3>Минск, ул. Якубовского 40</h3>

              </template>

              <template v-if="delivery === 'курьером'">

                <Input type="text" label="Город" placeholder="Город" v-model="city" name="city" :readonly="delivery === 'курьером'" :class="firstInput ? '' : 'show-error'" :required="true" />
                <div class="checkoutPage__form-row">
                  <Input type="text" label="Улица" placeholder="Улица" v-model="street" name="street" :class="firstInput ? '' : 'show-error'" :required="true" />
                  <Input type="text" label="Дом" placeholder="Дом" v-model="home" name="home" :class="firstInput ? '' : 'show-error'" :required="true" />
                </div>
                <div class="checkoutPage__form-row">
                  <Input type="text" label="Корпус" placeholder="Корпус" v-model="building" name="building" />
                  <Input type="text" label="Подъезд" placeholder="Подъезд" v-model="entrance" name="entrance" />
                </div>
                <div class="checkoutPage__form-row">
                  <Input type="text" label="Этаж" placeholder="Этаж" v-model="floor" name="floor" />
                  <Input type="text" label="Квартира" placeholder="Квартира" v-model="flat" name="flat" />
                </div>

              </template>

              <template v-if="delivery === 'белпочта'">

                <Input type="text" label="Город" placeholder="Город" v-model="city" name="city" :class="firstInput ? '' : 'show-error'" :required="true" />
                <div class="checkoutPage__form-row">
                  <Input type="text" label="Улица" placeholder="Улица" v-model="street" name="street" :class="firstInput ? '' : 'show-error'" :required="true" />
                  <Input type="text" label="Дом" placeholder="Дом" v-model="home" name="home" :class="firstInput ? '' : 'show-error'" :required="true" />
                </div>
                <div class="checkoutPage__form-row">
                  <Input type="text" label="Корпус" placeholder="Корпус" v-model="building" name="building" />
                  <Input type="text" label="Квартира" placeholder="Квартира" v-model="flat" name="flat" />
                </div>

              </template>

              <template v-if="delivery === 'европочта'">

                <Map v-if="offices" :offices="offices" :office="office" @select="selectOffice" />

                <div v-show="!office">
                  <Input type="text" label="Отделение" placeholder="Поиск" v-model="officeSearch" name="office" />

                  <div class="checkoutPage__offices-list-wrapper">
                    <div class="checkoutPage__offices-list">
                      <button type="button" class="checkoutPage__office-button" v-for="item in filteredOffices" :key="item.Address1Id" @click="office = item">
                        {{item.WarehouseName}}
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="office" class="checkoutPage__office">
                  <div class="checkoutPage__office-title">
                    {{office.WarehouseName}}
                  </div>
                  <div class="checkoutPage__office-info">
                    {{office.Info1}}
                  </div>
                   <!-- {{office}} -->

                  <button type="button" class="checkoutPage__office-remove" @click="office = null" aria-label="Удалить офис"></button>
                </div>

              </template>
            </div>


            <Textarea label="Комментарий к заказу (необязательно)" placeholder="Комментарий к заказу" v-model="comment" name="comment" />

          </div>

          <div class="checkoutPage__info">
            <h3 class="checkoutPage__subtitle">Ваш заказ</h3>

            <div class="checkoutPage__info-wrapper">
              <table class="checkoutPage__products">
                <thead>
                  <tr>
                    <th class="product-name">Товар</th>
                    <th class="product-total">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :product="product" v-for="product in products" :key="product.uuid">
                    <td>
                      {{product.content.title}}&nbsp;
                      <strong>×&nbsp;{{product.count ? product.count : 1}}</strong>
                    </td>
                    <td>
                      <span><bdi>{{(product.count ? product.count : 1) * +product.content.price}}&nbsp;<span>р.</span></bdi></span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table class="checkoutPage__bill">
                <tbody>
                  <tr>
                    <td>Сумма заказа</td>
                    <td>{{sum}} р.</td>
                  </tr>
                  <tr v-if="delivery !== 'самовывоз'">
                    <td>Доставка</td>
                    <td>{{deliveryPrice === 0 ? 'Бесплатно' : deliveryPrice + ' р.' }}</td>
                  </tr>
                  <!-- <tr>
                    <td>Скидка</td>
                    <td class="checkoutPage__salePrice">{{sale}} р.</td>
                  </tr> -->
                  <tr>
                    <td>Персональная скидка</td>
                    <td class="checkoutPage__salePrice">
                      <button type="button" class="checkoutPage__login" @click="showLogin" v-if="!user">
                        Авторизоваться
                      </button>
                      <template v-if="user">
                        -{{personalSale}} р.
                      </template>
                    </td>
                  </tr>
                  <tr v-if="coupon">
                    <td>Промокод: {{coupon.name}}</td>
                    <td>-{{discount}} р.</td>
                  </tr>
                  <tr>
                    <td>Итого</td>
                    <td class="checkoutPage__totalPrice">{{totalSum}} р.</td>
                  </tr>
                </tbody>
              </table>

              <div class="checkoutPage__payment-inputs">
                <label class="radio">
                  <input class="radio__input" type="radio" name="paymethod" v-model="paymethod" value="наличными" />
                  <div class="radio__item"></div>
                  <div class="radio__text">Наличными</div>
                </label>

                <label class="radio">
                  <input class="radio__input" type="radio" name="paymethod" v-model="paymethod" value="картой" />
                  <div class="radio__item"></div>
                  <div class="radio__text">Картой</div>
                </label>

                <label class="radio">
                  <input class="radio__input" type="radio" name="paymethod" v-model="paymethod" value="онлайн" />
                  <div class="radio__item"></div>
                  <div class="radio__text">Картой онлайн</div>
                </label>
              </div>

              <button @click="firstInput = false" v-if="paymethod === 'онлайн'" type="submit" class="checkoutPage__pay button button--big" :class="isLoading ? 'button--loading' : ''">Перейти к оплате</button>
              <button @click="firstInput = false" v-else type="submit" class="checkoutPage__pay button button--big" :class="isLoading ? 'button--loading' : ''">Оформить заказ</button>

              <div class="checkoutPage__errorMessage" v-if="errorMessage">{{errorMessage}}</div>
            </div>

          </div>
        </form>
      </template>

      <div v-if="products && products.length === 0" class="checkoutPage__empty">
        <h2>Корзина пуста</h2>
        <nuxt-link class="button" to="/catalog">Перейти в каталог</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "~/plugins/firebase.js"
import { doc, getDoc, updateDoc, Timestamp  } from 'firebase/firestore';
import meta from "~/helpers/meta";

export default {
  head() {
    return meta({
      title: "Оформление заказа. Интернет-магазин корейской косметики, купить корейскую косметику в Минске - Voditsa.by",
      description: "Оформление заказа на сайте интернет-магазина корейской косметики voditsa.by. Купить косметику в интернет-магазине Voditsa. ❤️ Популярные бренды корейской косметики. ⭐ Выгодные цены. ⭐ Скидки и акции. ✔️ Доставка по Минску и Беларуси.",
    }, null, this);
  },
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      delivery: 'самовывоз',
      address: '',
      city: '',
      street: '',
      home: '',
      building: '',
      entrance: '',
      floor: '',
      flat: '',
      office: null,
      officeSearch: '',
      comment: '',
      paymethod: 'наличными',
      errorMessage: '',
      offices: false,
      isLoading: false,
      firstInput: true,
    }
  },
  watch: {
    delivery(value) {
      this.firstInput = true;
      this.errorMessage = '';
      if (value === 'курьером') {
        this.city = 'Минск'
      }
      if (value === 'европочта' && !this.offices) {
        this.getOffices();
      }
    },
    userProfile() {
      this.setFields();
    },
  },
  created() {
    this.setFields();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
    products() {
      return this.$store.state.userProfile.cart;
    },
    deliveryPrice() {
      return this.$store.getters.cartPrice.priceFull > 40 || this.delivery === 'самовывоз' ? 0 : 4;
    },
    discount() {
      return this.$store.getters.cartPrice.discountPrice;
    },
    coupon() {
      return this.$store.state.userProfile.discount
    },
    sum() {
      const sum = this.$store.getters.cartPrice.price.toFixed(2);
      return parseFloat(sum);
    },
    sale() {
      const sale = (this.$store.getters.cartPrice.priceFull - this.$store.getters.cartPrice.price).toFixed(2);
      return parseFloat(sale);
    },
    personalSale() {
      const personalSale = (this.$store.getters.cartPrice.price * (this.$store.getters.personalSale / 100)).toFixed(2);
      return parseFloat(personalSale);
    },
    totalSum() {
      const totalSum = (this.$store.getters.cartPrice.price + this.deliveryPrice - this.personalSale - this.discount).toFixed(2);
      return parseFloat(totalSum);
    },
    filteredOffices() {
      let offices = this.offices || [];
      let filteredOffices = [];

      if (this.officeSearch.length > 1) {
        filteredOffices = offices.filter(office => {
          return office.WarehouseName.toLowerCase().includes(this.officeSearch.toLowerCase());
        });
      } else {
        filteredOffices = this.offices;
      }

      return filteredOffices;
    }
  },
  methods: {
    showLogin() {
      this.$store.commit("setLoginModalState", true);
    },
    setFields() {
      const user = this.userProfile;

      if (user.firstname) {
        this.firstname = user.firstname
      }
      if (user.lastname) {
        this.lastname = user.lastname
      }
      if (user.email) {
        this.email = user.email
      }
      if (user.phone) {
        this.phone = user.phone
      }
    },
    async createOrder() {
      const sum = this.totalSum;
      if (this.delivery === 'европочта' && !this.office) {
        return this.errorMessage = 'Выберите отделение Европочты';
      }
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const info = await this.$store.dispatch('createOrder', {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          phone: this.phone,
          delivery: this.delivery,
          address: this.address,
          city: this.city,
          street: this.street,
          home: this.home,
          building: this.building,
          flat: this.flat,
          floor: this.floor,
          entrance: this.entrance,
          office: this.office,
          comment: this.comment,
          paymethod: this.paymethod,
          sum: sum
        });

        if (info.errorMessage) {
          this.errorMessage = info.errorMessage;
        }

        if (info.formUrl) {
          window.location.href = info.formUrl;
        }

        console.log(info);
        if (info.done && !info.formUrl) {
          this.$router.push(`checkout/success?order=${info.orderNumber}`);
          // this.$store.dispatch('clearCart');
        }
      } catch (error) {
        console.log('createOrder');
        console.log(error);
      }
      this.isLoading = false;
    },
    async getOffices() {
      try {
        const offices = await getDoc(doc(db, "info", "offices"));
        const lastUpdate = offices.data().updated_at;
        const lastUpdateDay = lastUpdate.toDate().toLocaleDateString('ru-RU', { day: 'numeric',  });
        const currentDay = new Date().toLocaleDateString('ru-RU', { day: 'numeric',  });

        if (lastUpdateDay === currentDay) {
          this.offices = offices.data().list;
        } else {
          const info = await this.$axios.get(`/evropochta/offices`);

          if (info) {
            await updateDoc(doc(db, "info", "offices"), {
              updated_at: Timestamp.now(),
              list: info.data.Table
            });
            this.offices = info.data.Table;
          }
        }
      } catch (error) {
        console.log('getOffices');
        console.log(error);
      }
    },
    selectOffice(office) {
      this.office = office;
    }
  }
}
</script>

<style lang="scss">
.checkoutPage {
  padding: 60px 0;

  @media screen and (max-width: 767px) {
    padding: 40px 0;
  }

  &__title {
    text-align: center;
  }

  &__empty {
    text-align: center;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;

    @media screen and (max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }

  &__info-wrapper {
    background: #f2f2f2;
    padding: 30px;
  }

  &__pay {
    width: 100%;
    margin-top: 30px;
  }

  &__products {
    width: 100%;

    thead {
      tr {
        th {
          text-align: left;
          padding: 10px 0;
          font-weight: 700;
          border-bottom: 1px solid rgba(#333, .1);

          &:last-child {
            text-align: right;
          }
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 10px 0;

          &:last-child {
            text-align: right;
          }
        }
      }
    }
  }

  &__bill {
    width: 100%;

    tbody {
      tr {
        td {
          padding: 10px 0;
          border-top: 1px solid rgba(#333, .1);

          &:last-child {
            font-size: 18px;
            line-height: 22px;
            text-align: right;
          }
        }
      }
    }
  }

  &__salePrice {
    color: #ff0000;
  }

  &__totalPrice {
    font-size: 22px;
    line-height: 26px;
    font-weight: 600;
  }

  &__delivery-items {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
    margin-bottom: 20px;

    .radio {
      padding: 5px 10px;
    }
  }

  &__delivery-wrapper {
    margin-bottom: 30px;
  }

  &__login {
    font-size: 16px;
    line-height: 20px;
    background: none;
    padding: 0;
    box-shadow: none;
    cursor: pointer;
    border: 0;
    text-decoration: none;
    border-bottom: 1px solid var(--color-text-main);
    transition: color .2s ease, border-color .2s ease;

    &:hover {
      color: var(--color-main2);
      border-bottom: 1px solid var(--color-main2);
    }
  }

  &__office-button {
    display: block;
    text-align: left;
    border: 0;
    background: transparent;
    border-radius: 4px;
    box-shadow: none;
    font-size: 16px;
    line-height: 20px;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    transition: background-color .2s ease;

    &:hover {
      background: #f2f2f2;
    }
  }

  &__office {
    padding: 20px;
    border-radius: 4px;
    background: rgba(#c0ffeb, .5);
    position: relative;
  }

  &__office-title {
    font-weight: 700;
    margin-bottom: 5px;
  }

  &__office-info {
    font-size: 14px;
    line-height: 18px;
  }

  &__office-remove {
    width: 40px;
    height: 40px;
    position: absolute;
    right: 0;
    top: 0;
    background: transparent;
    border-radius: 50%;
    box-shadow: none;
    border: 0;
    background: url('/images/ico-remove.svg') no-repeat center center;
    cursor: pointer;
    transition: background-color .2s ease;

    &:hover {
      background-color: #f2f2f2;
    }
  }

  &__offices-list-wrapper {
    position: relative;

    &::before {
      content: '';
      width: calc(100% - 10px);
      height: 100%;
      position: absolute;
      pointer-events: none;
      bottom: 0;
      left: 0;
      height: 60px;
      background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 65%, rgba(255,255,255,0) 100%);
    }
  }

  &__offices-list {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 10px;
    padding-bottom: 60px;

    /* Works on Firefox */
    scrollbar-width: thin;
    scrollbar-color: #212121 #f2f4f8;

    /* Works on Chrome, Edge, and Safari */
    &::-webkit-scrollbar {
      width: 4px;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f2f4f8;
      border-radius: 20px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #212121;
      border-radius: 20px;
      border: 0;
    }
  }

  &__form-row {
    display: grid;
    gap: 30px;
    grid-template-columns: 1fr 1fr;
  }

  &__payment-inputs {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;

    .radio {
      padding: 5px 10px;
    }
  }

  &__errorMessage {
    color: var(--color-error);
    margin-top: 5px;
  }
}
</style>
