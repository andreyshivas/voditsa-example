<template>
  <div class="payments">
    <div class="payments__item"><img src="/images/logo-visa.svg" width="60" height="40" loading="lazy" alt="Логотип visa"></div>
    <div class="payments__item"><img src="/images/logo-visa-secure.svg" width="60" height="40" loading="lazy" alt="Логотип visa secure"></div>
    <div class="payments__item"><img src="/images/logo-alfabank.svg" width="60" height="40" loading="lazy" alt="Логотип Alfabank"></div>
    <div class="payments__item"><img src="/images/logo-mastercard-id-check.svg" width="60" height="40" loading="lazy" alt="Логотип Mastercard Id Check"></div>
    <div class="payments__item"><img src="/images/logo-mastercard.svg" width="60" height="40" loading="lazy" alt="Логотип Mastercard"></div>
    <div class="payments__item"><img src="/images/logo-belcart.svg" width="60" height="40" loading="lazy" alt="Логотип Belcart"></div>
    <div class="payments__item"><img src="/images/logo-belcart-internet-parol.svg" width="60" height="40" loading="lazy" alt="Логотип Belcart Internet Parol"></div>
    <div class="payments__item"><img src="/images/logo-apple-pay.svg" width="60" height="40" loading="lazy" alt="Логотип ApplePay"></div>
    <div class="payments__item"><img src="/images/logo-samsung-pay.svg" width="60" height="40" loading="lazy" alt="Логотип SamsungPay"></div>
  </div>
</template>

<style lang="scss">
.payments {
  display: flex;
  flex-wrap: wrap;
  margin-left: -5px;
  margin-right: -5px;

  &__item {
    width: 60px;
    flex-shrink: 0;
    margin: 5px;

    img {
      width: 100%;
    }

    @media screen and (max-width: 460px) {
      width: calc(20% - 10px);
    }

    @media screen and (max-width: 360px) {
      width: calc(25% - 10px);
    }
  }
}
</style>
