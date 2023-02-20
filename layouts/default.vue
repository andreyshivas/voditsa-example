<template>
  <div class="pageWrapper">
    <Header />
    <div class="pageWrapper__content">
      <Nuxt />
    </div>

    <LazyHydrate when-visible>
      <Footer />
    </LazyHydrate>

    <LazySearch v-if="this.$store.state.isActiveSearch" />

    <MenuMobile />
    <CartSidebar />
    <LoginSidebar />

    <img src="https://mc.yandex.ru/watch/86178557" style="position:absolute; left:-9999px;" alt="ym" loading="lazy" />

    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TFLNZ9N" height="0" width="0" style="display:none;visibility:hidden" loading="lazy"></iframe>
  </div>
</template>

<script>
import { auth } from "~/plugins/firebase.js"
import { onAuthStateChanged } from "firebase/auth";
import LazyHydrate from 'vue-lazy-hydration';

export default {
  components: {
    LazyHydrate,
  },
  data() {
    return {
      timeout: null,
    }
  },
  jsonld() {
    return {
      '@context': 'https://schema.org',
      "@graph": [
        {
          "@type":"Place",
          "@id":"https://voditsa.vercel.app/#place",
          "address": {
            "@type":"PostalAddress",
            "streetAddress":"Yakubovskogo, 40",
            "postalCode":"220018",
            "addressCountry":"Belarus"
          }
        },
        {
          "@type":[
            "HealthAndBeautyBusiness",
            "Organization"
          ],
          "@id":"https://voditsa.vercel.app/#organization",
          "name":"Voditsa.by",
          "url":"https://voditsa.vercel.app",
          "email":"info@voditsa.by",
          "address":{
            "@type":"PostalAddress",
            "streetAddress":"Yakubovskogo, 40",
            "postalCode":"220018",
            "addressCountry":"Belarus"
          },
          "logo":{
            "@type":"ImageObject",
            "@id":"https://voditsa.vercel.app/#logo",
            "url":"https://voditsa.vercel.app/images/logo.png",
            "caption":"Voditsa.by",
            "inLanguage":"ru-RU",
            "width":"800",
            "height":"164"
          },
          "openingHours":[
            "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday 09:00-21:00"
          ],
          "location":{
            "@id":"https://voditsa.vercel.app/#place"
          },
          "image":{
            "@id":"https://voditsa.vercel.app/#logo"
          },
          "telephone":"+375-25-988-57-89"
        },
        {
          "@type":"WebSite",
          "@id":"https://voditsa.vercel.app/#website",
          "url":"https://voditsa.vercel.app",
          "name":"Voditsa.by",
          "publisher":{
            "@id":"https://voditsa.vercel.app/#organization"
          },
          "inLanguage":"ru-RU"
        },
      ]
    };
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.$store.dispatch('setUser', user);
        this.$store.dispatch('fetchUserProfile');
      } else {
        if (this.$store.state.user) {
          this.$store.dispatch('setUser', null);
          this.$store.commit('setUserProfile', {
            cart: null,
            favorites: null,
            discount: null,
          });
        }
      }
    });

    console.log('config env ', this.$config.nodeEnv);
    if (this.$config.nodeEnv && this.$config.nodeEnv === 'production') {
      this.timeout = setTimeout(() => {
        // document.querySelector('[alt="ym"]')?.remove();
        // console.log('setTimeout metrika');
        // (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(86178557, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, trackHash:true });

        // this.$router.afterEach((to, from) => {
        //   if (window.ym) {
        //     window.ym(86178557, 'hit', to.fullPath);
        //   }
        // });


        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TFLNZ9N');


        this.$router.afterEach((to, from) => {
          if (window.ym) {
            window.ym(86178557, 'hit', to.fullPath);
          }

          if (window.dataLayer) {
            window.dataLayer.push({
              'event': 'nuxtPageView',
              'page':{
                'title': to.name,
                'url': to.fullPath,
              }
            });
          }
        });
      }, 5000);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
}
</script>
