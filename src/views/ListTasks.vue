<template>
  <div>
    <h1 style="text-align: center; margin-top: 20px; margin-bottom: 20px">
      Lista de Tarefas
    </h1>
    <div class="container-conteudo" v-for="(task, index) in tasks" :key="index">
      <v-card elevation="4" outlined shaped style="width: 50%; margin: 0 auto">
        <v-card-title>{{ task.titulo }}</v-card-title>
        <v-card-subtitle>{{ task.date }}</v-card-subtitle>
        <v-card-text class="black--text">{{ task.descricao }}</v-card-text>
        <v-btn
          @click="edit(index)"
          small
          class="ma-2"
          outlined
          fab
          color="black"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <template>
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                class="ma-2"
                outlined
                fab
                color="black"
                v-bind="attrs"
                v-on="on"
                @click="setSelectedTask(task, index)"
              >
                <v-icon>{{ icons.mdiDelete }}</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 black" style="color: white">
                Deseja excluir a tarefa selecionada?
              </v-card-title>

              <v-card-text>
                Para excluir a tarefa "{{ taskSelected.titulo }}" clique em
                deletar.
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                  Fechar
                </v-btn>
                <v-btn @click="confirmRemoveTask">Deletar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mdiDelete } from "@mdi/js";
export default {
  name: "ListTasks",
  data() {
    return {
      tasks: [],
      dialog: false,
      taskSelected: [],
      icons: {
        mdiDelete,
      },
    };
  },
  created() {
    this.tasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
  },
  methods: {
    async edit(index) {
      this.$router.push({ name: "formtask", params: { index } });
    },
    async confirmRemoveTask() {
      this.tasks.splice(this.taskSelected.index, 1);
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      this.dialog = false;
    },
    async setSelectedTask(task, index) {
      this.taskSelected = task;
      this.taskSelected.index = index;
    },
  },
};
</script>

<style scoped>
.container-conteudo {
  margin-top: 20px;
}
</style>
