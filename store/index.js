import { db, auth } from "~/plugins/firebase.js"
import { doc, addDoc, setDoc, getDoc, updateDoc, onSnapshot, collection, increment, Timestamp  } from 'firebase/firestore'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import bonusLevels from '~/helpers/bonusLevels';

// TODO ПОДЕЛИТЬ НА МОДУЛИ

export const state = () => ({
  user: null,
  userProfile: {
    cart: null,
    favorites: null,
    discount: null,
  },

  localCart: [],

  cacheVersion: null,

  products: [],
  categories: [],
  brands: [],

  isActiveMenu: false,
  isActiveCartSidebar: false,
  isActiveLoginSidebar: false,
  isActiveSearch: false,

  filters: [],
});

export const mutations = {
  setCacheVersion(state, version) {
    state.cacheVersion = version
  },

  setProducts(state, payload) {
    state.products = payload
  },

  setCategories(state, payload) {
    state.categories = payload
  },

  setBrands(state, payload) {
    state.brands = payload
  },

  setMenuState(state, payload) {
    state.isActiveMenu = payload
  },

  setCartModalState(state, payload) {
    state.isActiveCartSidebar = payload
  },

  setLoginModalState(state, payload) {
    state.isActiveLoginSidebar = payload
  },

  setSearchState (state, payload) {
    state.isActiveSearch = payload
  },

  setUser (state, payload) {
    state.user = payload
  },

  setUserProfile (state, payload) {
    state.userProfile = payload
  },

  setFilters (state, payload) {
    state.filters = payload
  },

  setLocalCart (state, payload) {
    state.localCart = payload
  },
};

export const actions = {
  setUser ({commit}, payload) {
    let user = null;

    if (payload) {
      user = {
        uid: payload.uid,
        displayName: payload.displayName,
        email: payload.email,
        emailVerified: payload.emailVerified,
      }
    }

    commit('setUser', user);
  },

  setUserProfile({commit, state}, payload) {
    const userProfile = Object.assign({}, state.userProfile);
    const newUserProfile = Object.assign(userProfile, payload);
    console.log('setUserProfile');

    commit('setUserProfile', newUserProfile);
  },

  async loadCacheVersion({commit}) {
    const response = await this.$storyapi.get(`cdn/spaces/me`);
    commit('setCacheVersion', response.data.space.version);
  },

  async loadSettings({commit, state}, payload) {
    let cache = state.cacheVersion ? state.cacheVersion : Math.floor(Date.now() / 1e3)
    let info = await this.$storyapi.get(`cdn/stories/`, {
      version: 'published',
      cv: cache,
      starts_with: `catalog/`,
      filter_query: {
        component: {
          in: 'category',
        }
      }
    });

    commit('setCategories', info.data.stories)
  },

  async nuxtServerInit({dispatch, commit}) {
    try {
      const spaceCache = await this.$storyapi.get(`cdn/spaces/me`);
      commit('setCacheVersion', spaceCache.data.space.version)
      await dispatch('loadSettings');
    } catch (error) {
      console.log('STORYBLOK ERRROR IN NUXT SERVER INIT');
      console.log(error);
    }
  },

  async signInWithEmail({ commit, dispatch, state }, { email, password }) {
    try {
      commit('setLocalCart', state.userProfile.cart);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch('setUser', user);
    } catch (error) {
      throw error;
    }
  },

  async resetPassword({ commit, dispatch }, { email }) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  },

  async signUpWithEmail ({ commit, state }, { email, password }) {
    try {
      commit('setLocalCart', state.userProfile.cart);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const ref = doc(db, "users", user.uid);

      await setDoc(ref, {
        email: email,
        uid: user.uid,
        cart: state.userProfile.cart || [],
        favorites: [],
        cart: state.userProfile.discount || null,
        bonuses: 0,
      });
    } catch (error) {
      throw error;
    }
  },

  async signOut ({ commit, dispatch }) {
    try {
      commit('setLocalCart', null);
      await signOut(auth);
      dispatch('setUserProfile', {
        cart: [],
        favorites: null,
        discount: null
      });
    } catch (error) {
      throw error
    }
  },

  fetchUserProfile ({ commit, dispatch, state }) {
    let localCart = state.localCart;
    let filteredCart = [];
    console.log('fetchUserProfile');

    const user = onSnapshot(doc(db, "users", state.user.uid), (doc) => {
      const userDBcart = doc.data().cart;

      if (localCart?.length) {
        console.log(localCart);
        let newCart = localCart;
        if (userDBcart?.length) {
          newCart = localCart.concat(userDBcart);
        }
        filteredCart = newCart.filter((v,i,a)=>a.findIndex(t=>(t.uuid===v.uuid))===i);
        localCart = [];
      }

      dispatch('setUserProfile', doc.data());

      if (!doc.data().bonuses) {
        dispatch('updateUserFields', {
          bonuses: 0
        });
      }

      if (!doc.data().discount) {
        dispatch('updateUserFields', {
          discount: null
        });
      }
      if (filteredCart.length) {
        dispatch('updateUserFields', {
          cart: filteredCart
        });
        filteredCart = [];
      }
    });
  },

  async updateUserFields ({ commit, state }, payload) {
    try {
      const user = state.user;

      const ref = doc(db, "users", state.user.uid);
      await updateDoc(ref, payload);
    } catch (error) {
      throw error;
    }
  },

  async addProductToFavorites ({ commit, dispatch, state }, productId) {
    try {
      const user = state.user;
      const products = state.userProfile.favorites || [];
      let updatedProducts = [];

      products.forEach((item) => {
        updatedProducts.push(item);
      });

      updatedProducts.push(productId);

      if (user) {
        const ref = doc(db, "users", state.user.uid);
        await updateDoc(ref, {
          favorites: updatedProducts
        });
      } else {
        dispatch('setUserProfile', {
          favorites: updatedProducts,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async setDiscount ({ commit, dispatch, state }, discount) {
    console.log('setDiscount');
    try {
      const user = state.user;

      if (user) {
        const ref = doc(db, "users", state.user.uid);
        await updateDoc(ref, {
          discount: discount
        });
      } else {
        dispatch('setUserProfile', {
          discount: discount,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async removeProductFromFavorites ({ commit, dispatch, state }, productId) {
    try {
      const user = state.user;
      const products = state.userProfile.favorites || [];
      let updatedProducts = [];

      products.forEach((item) => {
        if (item !== productId) {
          updatedProducts.push(item);
        }
      });

      if (user) {
        const ref = doc(db, "users", state.user.uid);
        await updateDoc(ref, {
          favorites: updatedProducts
        });
      } else {
        dispatch('setUserProfile', {
          favorites: updatedProducts,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async addProductToCart ({ commit, dispatch, state }, product) {
    try {
      const user = state.user;
      const products = state.userProfile.cart || [];
      const updatedProducts = []

      products.forEach((item) => {
        const newProduct = Object.assign({
          count: 0,
        }, item);

        if (newProduct.uuid === product.uuid) {
          newProduct.count++;
        }

        updatedProducts.push(newProduct);
      });

      const hasProducts = products.filter((item) => {
        if (item.uuid === product.uuid) {
          return item;
        }
      });

      if (hasProducts.length === 0) {
        updatedProducts.push(Object.assign({
          count: 1,
        }, product))
      }

      if (user) {
        const ref = doc(db, "users", state.user.uid);
        await updateDoc(ref, {
          cart: updatedProducts
        });
      } else {
        dispatch('setUserProfile', {
          cart: updatedProducts,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async loadCartProducts ({ commit, dispatch, state }) {
    console.log('loadCartProducts');
    try {
      const user = state.user;
      const cartProducts = state.userProfile.cart || [];
      let productIds = [];
      const updatedProducts = [];

      cartProducts.forEach((item) => {
        productIds.push(item.uuid);
      });

      if (productIds.length) {
        const cache = state.cacheVersion ? state.cacheVersion : Math.floor(Date.now() / 1e3);

        let info = await this.$storyapi.get(`cdn/stories/`, {
          version: 'published',
          cv: cache,
          starts_with: `catalog/`,
          by_uuids: productIds.join(','),
        });

        cartProducts.forEach((item) => {
          const currentProduct = info.data.stories.find((story) => {
            return story.uuid === item.uuid;
          });

          if (currentProduct && +currentProduct.content.in_stock !== 0) {
            updatedProducts.push({
              ...currentProduct,
              count: item.count,
            });
          }
        });

        if (user) {
          const ref = doc(db, "users", state.user.uid);
          await updateDoc(ref, {
            cart: updatedProducts
          });
        } else {
          dispatch('setUserProfile', {
            cart: updatedProducts,
          });
        }
      }
    } catch (error) {
      throw error;
    }
  },

  async createOrder ({ commit, dispatch, state, getters }, info) {
    console.log('createOrder action');
    try {
      const user = state.user;
      const products = state.userProfile.cart || [];

      const totalOrders = doc(db, "info", "orders");

      await updateDoc(totalOrders, {
        total: increment(1)
      });

      const newTotalOrders = await getDoc(doc(db, "info", "orders"));
      const orderNumber = newTotalOrders.data().total;
      let payment_id = '';
      let formUrl = '';
      let errorMessage = '';
      let done = false;
      if (info.paymethod === 'онлайн') {
        console.log('create-order store', info.sum);
        const payData = await this.$axios.post('/payment/create-order', {
          orderNumber: orderNumber,
          sum: info.sum,
          returnUrl: `${this.$config.siteURL}/checkout/success`,
        });

        if (payData.data.errorMessage) {
          errorMessage = payData.data.errorMessage
        }

        if (payData.data.formUrl) {
          payment_id = payData.data.orderId;
          formUrl = payData.data.formUrl;
        }
      }

      if (user) {
        const ref = await addDoc(collection(db, "orders"), {
          products: products,
          user: state.user.uid,
          price: info.sum,
          created_at: Timestamp.now(),
          status: 'pending',
          order_number: orderNumber,
          order_payment_number: orderNumber,
          payment_id: payment_id,
          formUrl: formUrl,
          info: info,
          discount: state.userProfile.discount,
        });

        const mail = await this.$axios.post('/mail/create-order', {
          products: products,
          price: info.sum,
          created_at: new Date().toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
          order_number: orderNumber,
          info: info,
          discount: state.userProfile.discount,
        });

        const sms = await this.$axios.post('/sms/create-order', {
          products: products,
          price: info.sum,
          created_at: new Date().toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
          order_number: orderNumber,
          info: info,
          discount: state.userProfile.discount,
        });

        done = true;

        dispatch('cleanCart');
      } else {
        const ref = await addDoc(collection(db, "orders"), {
          products: products,
          user: null,
          price: info.sum,
          created_at: Timestamp.now(),
          status: 'pending',
          order_number: orderNumber,
          order_payment_number: orderNumber,
          formUrl: formUrl,
          payment_id: payment_id,
          info: info,
          discount: state.userProfile.discount,
        });

        const mail = await this.$axios.post('/mail/create-order', {
          products: products,
          price: info.sum,
          created_at: new Date().toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
          order_number: orderNumber,
          info: info,
          discount: state.userProfile.discount,
        });

        const sms = await this.$axios.post('/sms/create-order', {
          products: products,
          price: info.sum,
          created_at: new Date().toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
          order_number: orderNumber,
          info: info,
          discount: state.userProfile.discount,
        });

        done = true;

        dispatch('cleanCart');
      }

      return { payment_id, orderNumber, formUrl, errorMessage, done };
    } catch (error) {
      throw error;
    }
  },

  async removeProductFromCart ({ commit, dispatch, state }, {product, removeAll}) {
    try {
      const user = state.user;
      const products = state.userProfile.cart || [];
      let updatedProducts = [];

      if (products) {
        if (removeAll) {
          updatedProducts = products.filter((item) => {
            if (item.uuid !== product.uuid) {
              return item
            }
          })
        } else {
          products.forEach((item) => {
            const newProduct = Object.assign({}, item);

            if (newProduct.uuid === product.uuid) {
              if (newProduct.count > 1) {
                newProduct.count--;
              }
            }

            updatedProducts.push(newProduct);
          });
        }
      }

      if (user) {
        const ref = doc(db, "users", state.user.uid);
        await updateDoc(ref, {
          cart: updatedProducts
        });
      } else {
        dispatch('setUserProfile', {
          cart: updatedProducts,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async cleanCart ({ commit, dispatch, state }) {
    try {
      const user = state.user;

      if (user) {
        const ref = doc(db, "users", state.user.uid);
        await updateDoc(ref, {
          cart: [],
          discount: null,
        });
      } else {
        dispatch('setUserProfile', {
          cart: [],
          discount: null,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async updateProfile ({ commit, state }, profile) {
    try {
      const ref = doc(db, "users", state.user.uid);
      await updateDoc(ref, profile);
    } catch (error) {
      throw error;
    }
  },

  setBrands({ commit }, payload) {
    commit('setBrands', payload);
  },
};

export const getters = {
  categories: (state) => {
    const data = state.categories;
    const structuredCategories = []

    const parentCategories = data.filter((item) => {
      if (item.full_slug.split('/').length === 3) {
        return item;
      }
    });

    parentCategories.forEach(parentCategory => {
      const subCategories = data.filter((item) => {
        if (item.full_slug.includes(parentCategory.full_slug) && item.full_slug !== parentCategory.full_slug) {
          return item;
        }
      });

      const category = {
        parentCategory,
        subCategories: [...subCategories],
      }

      structuredCategories.push(category);
    });

    return structuredCategories
  },

  favoritesCounter: (state) => {
    const products = state.userProfile.favorites;

    return products ? products.length : 0;
  },
  cartCounter: (state) => {
    const products = state.userProfile.cart || [];
    let result = 0;

    if (products) {
      products.forEach((product) => {
        result = result + product.count;
      });
    }

    return result;
  },

  personalSale: (state) => {
    const bonuses = state.userProfile.bonuses || 0;
    const info = bonusLevels(bonuses);
    return info.level;
  },

  cartPrice: (state) => {
    const products = state.userProfile.cart || [];
    let priceFull = 0;
    let price = 0;

    const discount = state.userProfile.discount;
    const discountValue = discount ? +discount.value : 0;
    let discountPrice = 0;

    if (products) {
      products.forEach((product) => {
        if (+product.content.in_stock === 0) {
          return;
        }

        if (+product.content.price === +product.content.full_price) {
          const priceDiscountDiff = (+product.content.price * product.count) * (discountValue / 100);
          discountPrice = discountPrice + priceDiscountDiff;
        }

        priceFull = priceFull + (+product.content.full_price * product.count);
        price = price + (+product.content.price * product.count);
      });
    }

    priceFull = parseFloat(priceFull.toFixed(2));
    price = parseFloat(price.toFixed(2));
    discountPrice = parseFloat(discountPrice.toFixed(2));

    return {
      priceFull,
      price,
      discountPrice
    };
  },
};
