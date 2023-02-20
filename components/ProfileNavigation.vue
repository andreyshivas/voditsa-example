<template>
  <nav class="profileNavigation">
    <ul class="profileNavigation__list">
      <li class="profileNavigation__item">
        <nuxt-link class="profileNavigation__link profileNavigation__link--exact" to="/profile">
          Личная информация
        </nuxt-link>
      </li>
      <li class="profileNavigation__item">
        <nuxt-link class="profileNavigation__link" to="/profile/favorites">
          Избранное
        </nuxt-link>
      </li>
      <li class="profileNavigation__item">
        <nuxt-link class="profileNavigation__link" to="/profile/orders">
          Мои заказы
        </nuxt-link>
      </li>
      <li class="profileNavigation__item">
        <nuxt-link class="profileNavigation__link" to="/profile/bonus">
          Бонусная программа
        </nuxt-link>
      </li>
      <li class="profileNavigation__item">
        <button type="button" class="profileNavigation__link profileNavigation__link--logout" @click="signOut">
          Выйти
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    async signOut() {
      try {
        await this.$store.dispatch('signOut');
        this.$router.push('/');
      } catch (error) {
        console.log('signOut');
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.profileNavigation {
  @media screen and (max-width: 1023px) {
    overflow-x: auto;

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  &__list {
    @media screen and (max-width: 1023px) {
      display: flex;
      white-space: nowrap;
    }
  }

  &__link {
    display: block;
    cursor: pointer;
    text-align: left;
    width: 100%;
    background: transparent;
    border: none;
    text-decoration: none;
    padding: 12px;
    border-radius: 4px;
    color: #000;
    font-size: 16px;
    line-height: 20px;
    position: relative;
    transition: background-color .2s ease;

    &:hover,
    &.nuxt-link-active {
      background: rgba(192,255,235,.5);
    }

    &--exact {
      &.nuxt-link-active {
        background: transparent;

        &:hover {
          background: rgba(192,255,235,.5);
        }
      }

      &.nuxt-link-exact-active {
        background: rgba(192,255,235,.5);
      }
    }
  }
}
</style>
