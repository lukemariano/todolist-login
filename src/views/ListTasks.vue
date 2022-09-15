<template>
  <div>
    <div class="container-filtro">
      <form class="mb-2 style-form mt-12">
        <v-text-field
          v-model="filter.titulo"
          id="titulo"
          label="Ex: Estudar para a prova"
          class="mr-2"
        >
        </v-text-field>

        <v-select
          d-inline
          v-model="filter.status"
          :items="optionsList"
          class="mr-2 style-filtro"
        >
        </v-select>
        <v-btn @click="filterTasks" dense dark class="white--text mr-4 ml-2"
          >Buscar</v-btn
        >
        <v-btn @click="clearFilter" dense dark class="white--text"
          >Limpar filtro</v-btn
        >
      </form>
    </div>
    <template v-if="isLoading">
      <div class="loading-spin">
        <v-progress-circular
          :size="70"
          indeterminate
          color="black"
        ></v-progress-circular>
      </div>
    </template>
    <template v-if="isTasksEmpty && !isLoading">
      <div class="emptyNote mt-15">
        <img src="../assets/images/emptyNotes.svg" class="emptyNote-image" />
        <v-btn to="/form" dense dark class="white--text mt-4"
          >Criar tarefa</v-btn
        >
      </div>
    </template>
    <template v-if="!isTasksEmpty && !isLoading">
      <div class="container-conteudo" v-for="task in tasks" :key="task.id">
        <v-card
          elevation="4"
          outlined
          shaped
          style="width: 50%; margin: 0 auto"
        >
          <div class="style-title-date">
            <v-card-title :class="{ finishedTask: isFinished(task) }">{{
              task.titulo.toUpperCase()
            }}</v-card-title>
            <v-card-title class="d-flex flex-column"
              ><v-alert
                :color="colorOverdue(task.date, task.status)"
                dark
                icon="mdi-firework"
                dense
                class="text-subtitle2"
              >
                {{ overduePresente(task.date) }} </v-alert
              ><v-alert shaped dark color="success">
                {{ task.groups }}
              </v-alert></v-card-title
            >
          </div>
          <v-card-text
            class="black--text"
            :class="{ finishedTask: isFinished(task) }"
            >{{ task.descricao }}</v-card-text
          >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="updateStatus(task.id, status.FINISHED)"
                small
                class="ma-2"
                outlined
                fab
                color="black"
                v-bind="attrs"
                v-on="on"
              >
                <i class="fa-solid fa-clipboard-check"></i>
              </v-btn>
            </template>
            <span>Concluir tarefa</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="updateStatus(task.id, status.ARCHIVED)"
                small
                class="ma-2"
                outlined
                fab
                color="black"
                v-bind="attrs"
                v-on="on"
              >
                <i class="fa-regular fa-folder-open"></i>
              </v-btn>
            </template>
            <span>Arquivar tarefa</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="edit(task.id)"
                small
                class="ma-2"
                outlined
                fab
                color="black"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar tarefa</span>
          </v-tooltip>
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
                  @click="setSelectedTask(task.id)"
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
    </template>
  </div>
</template>

<script>
import { mdiDelete } from "@mdi/js";
import TasksModel from "@/models/TasksModel";
import Status from "@/valueObjects/status";

export default {
  name: "ListTasks",
  data() {
    return {
      tasks: [],
      dialog: false,
      taskSelected: [],
      status: Status,
      icons: {
        mdiDelete,
      },
      filter: {
        titulo: null,
        status: null,
      },
      optionsList: [
        { value: null, text: "Selecione algum status" },
        { value: Status.OPEN, text: "Aberto" },
        { value: Status.FINISHED, text: "Concluído" },
        { value: Status.ARCHIVED, text: "Arquivado" },
      ],
      isLoading: false,
    };
  },
  async created() {
    this.isLoading = true;
    this.tasks = await this.getTasks();
    this.isLoading = false;
  },
  methods: {
    async edit(id) {
      this.$router.push({ name: "formtask", params: { id } });
    },
    async confirmRemoveTask() {
      this.taskSelected.delete();
      this.tasks = await this.getTasks();
      this.dialog = false;
    },
    async setSelectedTask(id) {
      this.taskSelected = await TasksModel.find(id);
    },
    async updateStatus(id, status) {
      let task = await TasksModel.find(id);
      task.status = status;
      await task.save();

      this.tasks = await this.getTasks();
    },
    isFinished(tarefa) {
      return tarefa.status === this.status.FINISHED;
    },

    async filterTasks() {
      // desestruturação
      let filter = { ...this.filter };
      filter = this.clean(filter);
      filter.userId = JSON.parse(localStorage.getItem("authUser")).id;
      this.tasks = await TasksModel.params(filter).get();
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
      return obj;
    },
    async clearFilter() {
      this.filter = {
        titulo: null,
        status: null,
      };
      this.tasks = await this.getTasks();
    },
    overduePresente(data) {
      if (!data) {
        return;
      }
      //2022-09-14 --> [2022, 09, 14]
      return data.split("-").reverse().join("/");
    },
    colorOverdue(data, status) {
      if (!data) {
        return "#2A3B4D";
      }

      if (status === this.status.FINISHED) {
        return "success";
      }
      // data atual no formato americano
      let dateNow = new Date().toISOString().split("T")[0];

      if (data === dateNow) {
        return "warning";
      }

      if (data < dateNow) {
        return "error";
      }

      return "#2A3B4D";
    },
    async getTasks() {
      // this.isLoading = true;
      // let self = this;
      // setTimeout(function () {
      //   self.isLoading = false;
      // }, 500);
      return await TasksModel.params({
        userId: JSON.parse(localStorage.getItem("authUser")).id,
        status: this.status.OPEN + "&status=" + this.status.FINISHED,
      }).get();
    },
  },
  computed: {
    isTasksEmpty() {
      return this.tasks.length === 0;
    },
  },
};
</script>

<style scoped>
.container-conteudo {
  margin-top: 20px;
}

.emptyNote-image {
  width: 500px;
  height: 500px;
}

.emptyNote {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.finishedTask {
  opacity: 0.7;
  text-decoration: line-through;
}

.container-filtro {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.style-form {
  display: flex;
  align-items: center;
  width: 55%;
}

.style-filtro {
  width: 00px;
}

.style-title-date {
  display: flex;
  justify-content: space-between;
}

.loading-spin {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65vh;
}
</style>
