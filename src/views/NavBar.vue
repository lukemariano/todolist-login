<template>
  <div>
    <v-app-bar dense dark>
      <v-toolbar-title class="container-nav">
        <h3 class="title-nav">TodoList</h3>
        <v-btn class="button-style" to="/"
          ><h5 class="title-nav gray-color">Tarefas</h5></v-btn
        >
        <v-btn class="button-style" to="/form"
          ><h5 class="title-nav gray-color">Formulário</h5></v-btn
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn @click="logout()">
        <v-icon> mdi-arrow-left</v-icon> Deslogar
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    logout() {
      localStorage.removeItem("authUser");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.title-nav {
  display: inline-block;
  margin-right: 20px;
}
.container-nav {
  display: flex;
  align-items: center;
}

.gray-color {
  color: white;
}

.button-style {
  background-color: transparent;
}
</style>
