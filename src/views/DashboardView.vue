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
          <span class="text-h6"
            >Usuário: <strong>{{ userName }}</strong></span
          >
        </v-alert>
        <v-container
          class="purple lighten-5 rounded-lg altura-dinamica mt-5"
          fluid
        >
          <div class="d-flex justify-center">
            <h2 class="mt-2 mb-10">Quantidade de tarefas por categoria:</h2>
          </div>
          <v-row no-gutters style="height: fit-content">
            <v-col>
              <div class="d-flex align-center justify-center">
                <div
                  class="d-flex flex-column align-center mr-10"
                  v-for="(group, index) in contagemGroups"
                  :key="index"
                >
                  <v-alert shaped dark color="purple">
                    <p class="font-weight-bold text-h6" color="white">
                      {{ index }}
                    </p>
                  </v-alert>
                  <v-progress-circular
                    :rotate="360"
                    :size="110"
                    :width="18"
                    :value="(group * 100) / tasks.length"
                    color="purple dark"
                  >
                    <span class="font-weight-bold text-h6"
                      >{{ (group * 100) / tasks.length }}%</span
                    >
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
      contagemGroups: {},
      groupPorcent: null,
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
      try {
        let inicial1 = iniciaisNome[0][0];
        let inicial2 = iniciaisNome[1][0];
        this.userIniciais = inicial1 + inicial2;
        this.userName = user.nome;
      } catch {
        let inicial1 = iniciaisNome[0][0];
        this.userIniciais = inicial1;
        this.userName = user.nome;
      }
    },
    countGroups() {
      return this.tasks.reduce((a, b) => {
        a[b.groups] = a[b.groups] ? a[b.groups] + 1 : 1;
        return a;
      }, {});
    },
  },
  computed: {
    isTasksEmpty() {
      return this.tasks.length === 0;
    },
  },
  async created() {
    this.tasks = await this.getTasks();
    await this.getNameUser();
    this.contagemGroups = this.countGroups();
  },
};
</script>

<style scoped>
.height-avatar {
  height: 130px !important;
  min-width: 100px !important;
  width: 130px !important;
}

.altura-dinamica {
  height: fit-content !important;
  max-height: fit-content !important;
}
</style>
