const axios = require("axios");

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    target: 'server',

    title: 'Voditsa',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'apple-mobile-web-app-title', content: 'Voditsa' },
      { name: 'application-name', content: 'Voditsa' },
      { name: 'msapplication-TileColor', content: '#2b5797' },
      { name: 'theme-color', content: '#c0ffeb' },
      { name: 'og:locale', content: 'ru_RU' },
      { name: 'og:type', content: 'website' },
      { name: 'og:site_name', content: 'voditsa.by' },
      { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW, MAX-IMAGE-PREVIEW:LARGE, MAX-SNIPPET:-1, MAX-VIDEO-PREVIEW:-1' },
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#c0ffeb' },
      { rel: 'preload', href: '/fonts/Inter-Bold.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/Inter-SemiBold.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/Inter-Medium.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/Inter-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    ]
  },

  loading: {
    color: '#614cff',
    height: '4px',
    throttle: 300,
    duration: 5000,
    // continuous: true,
  },

  /*
   ** Transition
   */
   pageTransition: {
    name: 'pageFade',
    mode: 'out-in'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/styles/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/composition-api.js',
    '~/plugins/rich-text-renderer.js',
    '~/plugins/jsonld',
    { src: '~/plugins/focus-visible.js', mode: 'client' },
    { src: '~/plugins/persistedState.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['storyblok-nuxt', { accessToken: 'token', cacheProvider: 'memory' }],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // '@nuxtjs/firebase',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    'nuxt-feed-yandex-market',
  ],

  image: {
    storyblok: {
      baseURL: 'https://img2.storyblok.com'
    }
  },

  // firebase: {
  //   config: {
  //     apiKey: "AIzaSyDhK1T51NMt2uGN-f8V2GRS_upO3w06Avo",
  //     authDomain: "voditsa.firebaseapp.com",
  //     projectId: "voditsa",
  //     storageBucket: "voditsa.appspot.com",
  //     messagingSenderId: "530949849514",
  //     appId: "1:530949849514:web:262628fb11bffdc226abd3",
  //     measurementId: "G-9L04GK9N42",
  //   },
  //   services: {
  //     auth: {
  //       initialize: {
  //         onAuthStateChangedAction: 'onAuthStateChanged',
  //       },
  //       ssr: true,
  //     },
  //     firestore: {
  //       enablePersistence: {
  //         synchronizeTabs: true
  //       },
  //     },
  //     storage: true,
  //   }
  // },

  publicRuntimeConfig: {
    siteURL: process.env.SITE_URL || 'https://voditsa.vercel.app',
    testENV: process.env.TEST_ENV || 'env default',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  privateRuntimeConfig: {
    // apiSecret: process.env.API_SECRET
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.SITE_URL,
  },

  sitemap: {
    hostname: process.env.SITE_URL,
    gzip: true,
    exclude: [
      '/checkout/**',
      '/profile/**',
      '/profile',
      '/checkout',
      '/catalog',
      '/brands',
      '/admin',
    ],
    routes: function (callback) {
      const token = 'NcxA3pcveYYv6flQsPrlfAtt'
      const version = 'published'
      let cache_version = 0

       // other routes that are not in Storyblok with their slug.
      let routes = ['/'] // adds / directly

       // Load space and receive latest cache version key to improve performance
      axios.get(`https://api.storyblok.com/v2/cdn/spaces/me?token=${token}`).then((space_res) => {

         // timestamp of latest publish
        cache_version = space_res.data.space.version

         // Call for all Links using the Links API: https://www.storyblok.com/docs/Delivery-Api/Links
        axios.get(`https://api.storyblok.com/v2/cdn/links?token=${token}&version=${version}&cv=${cache_version}`).then((res) => {
          Object.keys(res.data.links).forEach((key) => {
            const slug = res.data.links[key].slug;
            let isValidRoute = true;
            if (slug === 'home' || slug === 'settings' || slug.includes('settings/') || slug.includes('filters')) {
              isValidRoute = false;
            }

            if (isValidRoute) {
              routes.push('/' + slug.replace(/\/$/, ''));
            }
          });

          callback(null, routes)
        });
      });
    }
  },

  feedYml: {
    async data() {
      const token = 'token'
      const version = 'published'
      let cache_version = 0;

      const space = await axios.get(`https://api.storyblok.com/v2/cdn/spaces/me?token=${token}`);
      cache_version = space.data.space.version;

      const categoriesData = await axios.get(`https://api.storyblok.com/v2/cdn/stories/?version=${version}&cv=${cache_version}&per_page=100&page=1&starts_with=catalog&filter_query%5Bcomponent%5D%5Bin%5D=category&token=${token}`);
      const productsData = await axios.get(`https://api.storyblok.com/v2/cdn/stories/?version=${version}&cv=${cache_version}&per_page=100&page=1&starts_with=catalog&filter_query%5Bcomponent%5D%5Bin%5D=product&token=${token}`);

      const categories = categoriesData.data.stories;
      const products = productsData.data.stories;
      const structuredCategories = []

      const parentCategories = categories.filter((item) => {
        if (item.full_slug.split('/').length === 3) {
          return item;
        }
      });

      parentCategories.forEach(parentCategory => {
        structuredCategories.push({
          name: parentCategory.content.title,
          id: parentCategory.id + '',
        });

        const subCategories = categories.filter((item) => {
          if (item.full_slug.includes(parentCategory.full_slug) && item.full_slug !== parentCategory.full_slug) {
            return item;
          }
        });

        subCategories.forEach(subCategory => {
          structuredCategories.push({
            name: subCategory.content.title,
            id: subCategory.id + '',
            parentId: parentCategory.id + '',
          });
        });
      });

      const filteredProducts = products.map((item) => {
        const categorySlug = item.full_slug.split('/').slice(0, -1).join('/');
        const category = categories.find((category) => {
          return categorySlug === category.full_slug.replace(/\/$/, '');
        });

        return {
          id: item.id + '',
          bid: item.id,
          name: item.content.title,
          url: `https://voditsa.vercel.app/${item.full_slug}`,
          price: parseFloat(item.content.price),
          currencyId: 'BYN',
          // count: 1,
          categoryId: category.id + '',
          // category: category.id,
          picture: [item.content.image.filename],
        };
      });

      return {
        name: 'voditsa.by',
        company: 'voditsa.by',
        url: 'https://voditsa.vercel.app',
        currencies: [
          {
            id: 'BYN',
            rate: 1
          }
        ],
        categories: structuredCategories,
        'delivery-options': [
          {
            cost: 4,
            days: [0, 4],
          },
        ],
        offers: filteredProducts
      };
    },
    path: '/yandex-market.xml',
    validate: true,
    cacheTime: 1000 * 3600 * 24
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: false,
    // if you omit a module key form configuration sensible defaults will be applied
    // manifest: false,

    // workbox: {
    //   importScripts: [
    //     '/firebase-auth-sw.js'
    //   ],
    //   // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
    //   // only set this true for testing and remember to always clear your browser cache in development
    //   dev: process.env.NODE_ENV === 'development',
    // }
  },

  /*
   ** Router middleware
   */
  router: {
    prefetchLinks: false,
    // middleware: 'ua-logger',
  },

  serverMiddleware: [
    { path: '/api', handler: '~/api/storyblok.js' },
    { path: '/payment', handler: '~/api/payment.js' },
    { path: '/evropochta', handler: '~/api/evropochta.js' },
    { path: '/mail', handler: '~/api/mail.js' },
    { path: '/sms', handler: '~/api/sms.js' },
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isServer }) {
    }
  }
}
