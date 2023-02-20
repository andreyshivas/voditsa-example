<template>
  <div class="profilePage">
    <div class="container">
      <h1 class="profilePage__title">Личный кабинет</h1>
    </div>
    <div class="profilePage__wrapper">
      <div class="profilePage__sidebar">
        <ProfileNavigation />
      </div>

      <NuxtChild />
    </div>
  </div>
</template>

<script>
import meta from "~/helpers/meta";

export default {
  head() {
    return meta({
      title: "Личный кабинет",
    }, null, this);
  },
};
</script>
