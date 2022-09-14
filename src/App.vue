<template>
  <v-app>
    <NavBar v-if="notIsLoginPage" />
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./views/NavBar.vue";
export default {
  name: "App",
  data: () => ({
    //
  }),
  components: { NavBar },
  computed: {
    notIsLoginPage() {
      return this.$route.name !== "login" && this.$route.name !== "register";
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave {
  opacity: 0;
}
</style>
