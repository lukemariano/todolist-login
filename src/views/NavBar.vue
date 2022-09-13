<template>
  <div>
    <v-app-bar dense dark>
      <v-toolbar-title class="container-nav">
        <h3 class="title-nav">TodoList</h3>
        <a href="/"><h5 class="title-nav gray-color">Tarefas</h5></a>
        <a href="/form"><h5 class="title-nav gray-color">Formulário</h5></a>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
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

a {
  text-decoration: none;
  color: gray;
}

.gray-color {
  color: gray;
}
</style>
