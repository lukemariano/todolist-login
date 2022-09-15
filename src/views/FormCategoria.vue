<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <div>
      <h1>CRIAR CATEGORIA PARA TAREFAS:</h1>
      <form>
        <v-text-field
          outlined
          color="purple"
          class="mt-5"
          label="Titulo da tarefa"
          v-model="form.tipo"
        ></v-text-field>
        <v-btn color="purple" class="mr-4 white--text" @click="salvarCategoria">
          salvar
        </v-btn>
        <v-btn @click="limparCampos" color="purple" class="white--text">
          limpar campos
        </v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import GroupsModel from "@/models/GroupsModel";
export default {
  data() {
    return {
      form: {
        tipo: null,
        userId: JSON.parse(localStorage.getItem("authUser")).id,
      },
    };
  },
  methods: {
    async salvarCategoria() {
      const tipo = new GroupsModel(this.form);
      tipo.save();

      this.$router.push({ name: "dashboard" });
    },
    limparCampos() {
      this.form.tipo = null;
    },
  },
};
</script>
