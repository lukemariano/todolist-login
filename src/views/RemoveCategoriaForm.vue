<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <div>
      <h1 class="mb-5">REMOVER CATEGORIA DE UMA TAREFA:</h1>
      <form>
        <v-select
          outlined
          color="purple"
          v-model="form.groups"
          label="Selecione uma categoria para remover"
          id="groups"
          :items="form.groups"
        >
        </v-select>
        <v-btn
          color="purple"
          class="mr-4 white--text"
          @click="removerCategoria"
        >
          Remover
        </v-btn>
        <v-btn to="/dashboard" color="purple" class="white--text">
          Voltar
        </v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import GroupsModel from "@/models/GroupsModel";
import TasksModel from "@/models/TasksModel";

export default {
  data() {
    return {
      form: {
        groups: [],
      },
    };
  },
  methods: {
    async getGroups() {
      let groups = await GroupsModel.params({
        userId: JSON.parse(localStorage.getItem("authUser")).id,
      }).get();
      for (let group of groups) {
        this.form.groups.push(group.tipo);
      }
    },
    async removerCategoria() {
      let req = await GroupsModel.params({ tipo: this.form.groups }).get();
      req = req[0];

      // settar categoria como nula
      let nullTasks = await TasksModel.params({ groups: req.tipo }).get();
      // nullTasks = nullTasks[0];

      //editando todas as tasks para null value
      for (let task of nullTasks) {
        let removeTask = await TasksModel.find(task.id);
        removeTask.groups = null;
        removeTask.save();
        console.log(removeTask);
      }

      // deletando categoria cascade mode

      req = await GroupsModel.find(req.id);
      req.delete();

      this.$router.push({ name: "dashboard" });
    },
  },
  async created() {
    await this.getGroups();
  },
};
</script>
