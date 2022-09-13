<template>
  <div class="main-container">
    <div class="main-conteudo">
      <h1>Criar nova tarefa:</h1>
      <v-alert shaped outlined type="success" v-show="toast">
        I'm a shaped alert with a outline option
      </v-alert>
      <form>
        <v-text-field
          v-model="form.titulo"
          :error-messages="tituloErrors"
          label="Titulo da tarefa"
          required
          @input="$v.form.titulo.$touch()"
          @blur="$v.form.titulo.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="form.descricao"
          :error-messages="descricaoErrors"
          label="Descrição da tarefa"
          required
          @input="$v.form.descricao.$touch()"
          @blur="$v.form.descricao.$touch()"
        ></v-text-field>
        <v-select v-model="form.tag" label="Tag"></v-select>
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="form.date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="form.date"
              label="Picker in dialog"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="form.date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(form.date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-btn
          :disabled="!errorTitulo && !errorDescricao ? false : true"
          type="submit"
          class="mr-4"
          @click="salvarTask"
        >
          salvar
        </v-btn>
        <v-btn @click="limparCampos"> limpar campos </v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "FormTask",
  data: () => ({
    modal: false,
    toast: false,
    errorTitulo: null,
    errorDescricao: null,
    form: {
      titulo: "",
      descricao: null,
      tag: null,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    },
    methodSave: "new",
  }),
  mixins: [validationMixin],
  validations: {
    form: {
      titulo: {
        required,
        minLength: minLength(4),
      },
      descricao: {
        required,
        minLength: minLength(4),
      },
    },
  },
  methods: {
    async limparCampos() {
      this.form.date = null;
      this.form.titulo = null;
      this.form.descricao = null;
      this.form.tag = null;
    },
    async salvarTask() {
      if (this.methodSave === "update") {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[this.$route.params.index] = this.form;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        this.$router.push({ name: "listtask" });
        return;
      }

      let tasks = localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks"))
        : [];
      tasks.push(this.form);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      this.$router.push({ name: "listtask" });
    },
  },
  computed: {
    tituloErrors() {
      const errors = [];
      if (!this.$v.form.titulo.$dirty) return errors;
      !this.$v.form.titulo.minLength &&
        errors.push("O título precisa ter no mínimo 4 caracteres");
      !this.$v.form.titulo.required &&
        errors.push("Digite um titulo para a tarefa.");
      return errors;
    },
    descricaoErrors() {
      const errors = [];
      if (!this.$v.form.descricao.$dirty) return errors;
      !this.$v.form.descricao.minLength &&
        errors.push(
          "A descrição da tarefa precisa ter no mínimo 4 caracteres!"
        );
      !this.$v.form.descricao.required &&
        errors.push("Digite uma descrição para a tarefa.");
      return errors;
    },
  },
  watch: {
    tituloErrors() {
      if (this.tituloErrors.length === 0) {
        this.errorTitulo = null;
      } else {
        this.errorTitulo = this.tituloErrors;
      }
    },
    descricaoErrors() {
      if (this.descricaoErrors.length === 0) {
        this.errorDescricao = null;
      } else {
        this.errorDescricao = this.descricaoErrors;
      }
    },
  },
  created() {
    if (
      this.$route.params.index === 0 ||
      this.$route.params.index !== undefined
    ) {
      this.methodSave = "update";
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      this.form = tasks[this.$route.params.index];
    }
    // inicializar form com botão desabilitado
    if (this.methodSave === "new") {
      this.errorTitulo = this.tituloErrors;
      this.errorDescricao = this.descricaoErrors;
    }
  },
};
</script>

<style scoped>
.main-conteudo {
  padding: 10px;
  width: 75%;
  margin: 0 auto;
}
h1 {
  text-align: center;
  margin-top: 20px;
}
</style>
