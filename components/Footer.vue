<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__wrapper">
        <div class="footer__top">
          <div class="footer__info">
            <div class="footer__logo">
              <img src="/images/logo.svg" width="189" height="45" alt="Voditsa лого" />
            </div>

            <div class="footer__text">
              ИП Шевцова Ариадна Сергеевна<br>
              УНП 693163017<br>
              222603, Республика Беларусь, г. Несвиж, ул. Ленинская д. 55, оф. 1<br>
              Свидетельство о государственной регистрации № 693163017 от&nbsp;10.09.2021, выдано Несвижским райисполкомом<br>
              Интернет-магазин зарегистрирован в Торговом реестре РБ 17.09.2021
            </div>

          </div>

          <div class="footer__contacts">
            <h3 class="footer__title h4">Контакты</h3>

            <div class="footer__contacts-item">
              <a class="footer__contacts-link" href="tel:+375259885789">+375(25) 988-57-89</a>
              <div class="footer__time">пн-вс: 10:00 - 21:00</div>
            </div>

            <div class="footer__contacts-item">
              <a class="footer__contacts-link" href="mailto:info@voditsa.by">info@voditsa.by</a>
            </div>

            <div class="footer__socials">
              <a class="footer__social-link" href="https://www.instagram.com/voditsa.by/" target="_blank" rel="noopener" aria-label="Instagram">
                <img src="/images/ico-instagram.svg" width="24" height="24" loading="lazy" alt="Instagram">
              </a>
            </div>
          </div>

          <div class="footer__links">
            <h3 class="footer__title h4">Для клиента</h3>
            <ul class="footer__links-list">
              <li class="footer__link-item">
                <nuxt-link class="footer__link" to="/bonuses">Бонусная программа</nuxt-link>
              </li>
              <li class="footer__link-item">
                <nuxt-link class="footer__link" to="/payment-and-delivery">Доставка и оплата</nuxt-link>
              </li>
              <li class="footer__link-item">
                <nuxt-link class="footer__link" to="/public-offer">Публичная оферта</nuxt-link>
              </li>
              <li class="footer__link-item">
                <nuxt-link class="footer__link" to="/requisites">Реквизиты</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__payments">
          <FooterPayments />
        </div>
        <div class="footer__copyright">© {{currentYear}} Voditsa.by</div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss">
.footer {
  padding: 60px 0 40px;
  background: #f5f5f5;
  position: relative;

  @media screen and (max-width: 767px) {
    padding: 80px 0 30px;
  }

  p {
    margin-bottom: 12px !important;
  }

  &__top {
    display: grid;
    gap: 30px;
    grid-template-columns: 3fr 2fr 2fr;

    @media screen and (max-width: 767px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  &__info {
    @media screen and (max-width: 767px) {
      order: 4;
    }
  }

  &__logo {
    display: block;
    max-width: 189px;
    margin-bottom: 24px;

    @media screen and (max-width: 767px) {
      max-width: 130px;
      position: absolute;
      top: 30px;
      left: 20px;
    }

    @media screen and (max-width: 360px) {
      max-width: 110px;
    }
  }

  &__title {
    margin: 0;
    margin-bottom: 20px;
    font-weight: 600;

    @media screen and (max-width: 767px) {
      margin-bottom: 12px;
    }
  }

  &__link-item {
    margin-bottom: 4px;
  }

  &__link {
    background-size: 0 100%;
    color: #212121;
    background-repeat: no-repeat;
    background-image: linear-gradient(rgba(#212121, 0) calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s ease;

    &:hover {
      background-size: 100% 100%;
    }
  }

  &__text {
    font-size: 13px;
    line-height: 20px;
    margin-bottom: 30px;
    color: rgba(#212121, 0.65);

    @media screen and (max-width: 767px) {
      font-size: 12px;
      line-height: 18px;
    }
  }

  &__contacts {
    display: block;
    order: 3;
  }

  &__contacts-item {
    margin-bottom: 16px;

    @media screen and (max-width: 767px) {
      margin-bottom: 12px;
    }
  }

  &__contacts-link {
    font-size: 20px;
    background-size: 0 100%;
    color: #212121;
    background-repeat: no-repeat;
    background-image: linear-gradient(rgba(#212121, 0) calc(100% - 1px), #212121 1px);
    transition: background-size 0.3s ease;

    &:hover {
      background-size: 100% 100%;
    }
  }

  &__time {
    opacity: 0.65;
  }

  &__socials {
    @media screen and (max-width: 767px) {
      position: absolute;
      right: 20px;
      top: 33px;
    }
  }

  &__social-link {
    display: block;
    width: 24px;
    height: 24px;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__bottom {
    border-top: 1px solid rgba(#212121, 0.1);
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 767px) {
      display: block;
    }
  }

  &__copyright {
    font-size: 15px;
    line-height: 18px;
    color: #212121;
    margin-right: 24px;
    flex-shrink: 0;
  }

  &__payments {
    order: 2;

    @media screen and (max-width: 1023px) {
      max-width: 50%;
    }

    @media screen and (max-width: 767px) {
      margin-bottom: 12px;
      max-width: 100%;
    }
  }
}

</style>
