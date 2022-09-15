<template>
  <div class="fill-height">
    <template v-if="isTasksEmpty">
      <div class="d-flex flex-column justify-center align-center fill-height">
        <img src="../assets/images/emptyCategorias.svg" />
        <v-btn to="/form" dense dark class="white--text mt-10"
          >Criar tarefa</v-btn
        >
      </div>
    </template>
    <template v-else>
      <div class="d-flex flex-column align-center justify-center">
        <v-badge
          bordered
          bottom
          color="deep-purple accent-4"
          dot
          offset-x="10"
          offset-y="10"
          class="height-avatar"
        >
          <v-avatar color="black" class="mt-10 height-avatar">
            <span class="white--text text-h5">{{ userIniciais }}</span>
          </v-avatar>
        </v-badge>
        <v-alert
          color="purple"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-account"
          class="mt-15"
        >
          Usuário: <strong>{{ userName }}</strong>
        </v-alert>

        <h2 class="mt-10 mb-2">Quantidade de tarefas por categoria:</h2>
        <v-container class="purple lighten-5">
          <v-row no-gutters style="height: 150px">
            <v-col>
              <div class="d-flex align-center justify-center">
                <div class="d-flex flex-column align-center mr-10">
                  asdasa
                  <v-progress-circular
                    :rotate="360"
                    :size="100"
                    :width="15"
                    :value="value"
                    color="teal"
                  >
                    {{ value }}
                  </v-progress-circular>
                </div>
                <div class="d-flex flex-column align-center mr-10">
                  asdasa
                  <v-progress-circular
                    :rotate="360"
                    :size="100"
                    :width="15"
                    :value="value"
                    color="teal"
                  >
                    {{ value }}
                  </v-progress-circular>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
  </div>
</template>

<script>
import TasksModel from "@/models/TasksModel";
import UsersModel from "@/models/UsersModel";

export default {
  data() {
    return {
      tasks: [],
      userIniciais: null,
      userName: null,
    };
  },
  methods: {
    async getTasks() {
      return await TasksModel.params({
        userId: JSON.parse(localStorage.getItem("authUser")).id,
      }).get();
    },
    async getNameUser() {
      let user = await UsersModel.params({
        id: JSON.parse(localStorage.getItem("authUser")).id,
      }).get();

      user = user[0];

      // pega inicias de nome composto
      let iniciaisNome = user.nome.split(" ");
      let inicial1 = iniciaisNome[0][0];
      let inicial2 = iniciaisNome[1][0];
      this.userIniciais = inicial1 + inicial2;
      this.userName = user.nome;
    },
  },
  computed: {
    isTasksEmpty() {
      return this.tasks.length === 0;
    },
  },
  async created() {
    this.tasks = await this.getTasks();
    console.log(this.tasks);
    await this.getNameUser();
  },
};
</script>

<style scoped>
.height-avatar {
  height: 130px !important;
  min-width: 100px !important;
  width: 130px !important;
}
</style>
