<template>
  <div class="profilePage__content" v-if="user">
    <form action="" class="profilePage__form" @submit.prevent="updateProfile">

      <template v-if="!isEdit">
        <div class="profilePage__subtitle">Имя</div>
        <h3>{{userProfile.firstname ? userProfile.firstname : '-'}}</h3>
      </template>

      <div class="input" v-else>
        <label class="input__label" for="firstname">Имя</label>
        <input class="input__field" v-model="firstname" autocomplete="firstname" type="text" id="firstname" name="firstname" placeholder="Введите имя">
      </div>


      <template v-if="!isEdit">
        <div class="profilePage__subtitle">Фамилия</div>
        <h3>{{userProfile.lastname ? userProfile.lastname : '-'}}</h3>
      </template>

      <div class="input" v-else>
        <label class="input__label" for="lastname">Фамилия</label>
        <input class="input__field" v-model="lastname" autocomplete="lastname" type="text" id="lastname" name="lastname" placeholder="Введите фамилию">
      </div>

      <div class="profilePage__info-title">Email</div>
      <h3 class="profilePage__info-text">
        {{user.email}}
      </h3>

      <template v-if="!isEdit">
        <div class="profilePage__subtitle">Телефон</div>
        <h3>{{userProfile.phone ? userProfile.phone : '-'}}</h3>
      </template>

      <div class="input" v-else>
        <label class="input__label" for="phone">Телефон</label>
        <input class="input__field" v-model="phone" autocomplete="phone" type="tel" id="phone" name="phone" placeholder="+375 25 612 21 12">
      </div>

      <template v-if="!isEdit">
        <div class="profilePage__subtitle">Дата рождения</div>
        <h3>{{this.userProfile.birthday ? formattedBirthday : '-'}}</h3>
      </template>

      <div class="input" v-else>
        <label class="input__label" for="phone">Дата рождения</label>
        <input class="input__field" v-model="birthday" autocomplete="birthday" type="date" id="birthday" name="birthday" placeholder="31.01.2000">
      </div>


      <button v-if="!isEdit" type="button" class="button" @click.prevent="isEdit = true">Редактировать</button>
      <button v-if="isEdit" type="submit" class="button">Сохранить</button>
      <button v-if="isEdit" type="button" @click="cancelUpdates" class="button button--transparent">Отменить</button>
    </form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      firstname: '',
      lastname: '',
      phone: '',
      birthday: '',
      isEdit: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
    formattedBirthday() {
      return new Date(this.userProfile.birthday).toLocaleDateString('ru-RU', { day: 'numeric',  month: 'long', year: 'numeric' });
    }
  },
  created() {
    this.firstname = this.userProfile.firstname;
    this.lastname = this.userProfile.lastname;
    this.phone = this.userProfile.phone;
    this.birthday = this.userProfile.birthday;
  },
  methods: {
    async updateProfile() {
      try {
        const profile = {};

        if (this.firstname || this.userProfile.firstname) {
          profile.firstname = this.firstname || this.userProfile.firstname;
        }

        if (this.lastname || this.userProfile.lastname) {
          profile.lastname = this.lastname || this.userProfile.lastname;
        }

        if (this.phone || this.userProfile.phone) {
          profile.phone = this.phone || this.userProfile.phone;
        }

        if (this.birthday || this.userProfile.birthday) {
          profile.birthday = this.birthday || this.userProfile.birthday;
        }
        console.log(profile);
        await this.$store.dispatch('updateProfile', profile);
        this.isEdit = false;
      } catch (error) {
        console.log('updateProfile');
        console.log(error);
      }
    },
    cancelUpdates() {
      this.firstname = this.userProfile.firstname;
      this.lastname = this.userProfile.lastname;
      this.phone = this.userProfile.phone;
      this.birthday = this.userProfile.birthday;
      this.isEdit = false;
    }
  }
}
</script>
