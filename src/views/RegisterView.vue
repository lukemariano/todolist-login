<template>
  <v-row class="row-register fill-register">
    <v-col sm="7" class="flex-register">
      <img src="../assets/images/create.svg" />
    </v-col>
    <v-col sm="5" class="flex-register right-register">
      <div class="col-6">
        <h2 class="mb-6 text-center title-register">Faça o seu cadastro</h2>
        <form>
          <v-text-field
            id="nome"
            outlined
            label="Nome"
            type="text"
            placeholder="Lucas Mariano"
            v-model="form.nome"
            :error-messages="nomeErrors"
            required
            @input="$v.form.nome.$touch()"
            @blur="$v.form.nome.$touch()"
          ></v-text-field>
          <v-text-field
            id="email"
            outlined
            label="E-mail"
            type="email"
            placeholder="lucas@email.com"
            v-model="form.email"
            :error-messages="emailErrors"
            required
            @input="$v.form.email.$touch()"
            @blur="$v.form.email.$touch()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Senha"
            type="password"
            placeholder="Digite a sua senha"
            v-model="form.senha"
            id="senha"
            :error-messages="senhaErrors"
            required
            @input="$v.form.senha.$touch()"
            @blur="$v.form.senha.$touch()"
          ></v-text-field>
          <v-text-field
            outlined
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme a sua senha"
            v-model="form.confirmeSenha"
            id="confirmeSenha"
            :error-messages="confirmeSenhaErrors"
            required
            @input="$v.form.confirmeSenha.$touch()"
            @blur="$v.form.confirmeSenha.$touch()"
          ></v-text-field>

          <v-btn @click="register" color="primary btn-ajuste mb-4">
            <i class="fas fa-sign-in-alt"></i>Cadastrar</v-btn
          >
          <hr />
          <v-btn
            @click="goToLogin"
            outlined
            color="secundary"
            class="btn-ajuste mt-4"
          >
            <i class="fas fa-arrow-left"></i> Voltar</v-btn
          >
        </form>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import UsersModel from "@/models/UsersModel";

export default {
  data() {
    return {
      form: {
        email: null,
        senha: null,
        nome: null,
        confirmeSenha: null,
      },
    };
  },
  validations: {
    form: {
      nome: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        email,
      },
      senha: {
        required,
        minLength: minLength(6),
      },
      confirmeSenha: {
        required,
        sameAsPassword: sameAs("senha"),
      },
    },
  },
  mixins: [validationMixin],
  methods: {
    register() {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }

      const user = new UsersModel(this.form);
      user.save();

      this.goToLogin();
    },
    goToLogin() {
      this.$router.push({ name: "login" });
    },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.email && errors.push("Digite um e-mail válido");
      !this.$v.form.email.required && errors.push("E-mail é obrigatório");
      return errors;
    },
    senhaErrors() {
      const errors = [];
      if (!this.$v.form.senha.$dirty) return errors;
      !this.$v.form.senha.minLength && errors.push("Digite uma senha válida");
      !this.$v.form.senha.required &&
        errors.push("A senha é obrigatória é obrigatório");
      return errors;
    },
    nomeErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.nome.minLength && errors.push("Digite um nome válido");
      !this.$v.form.nome.required &&
        errors.push("O campo 'Nome' é obrigatório");
      return errors;
    },
    confirmeSenhaErrors() {
      const errors = [];
      if (!this.$v.form.confirmeSenha.$dirty) return errors;
      !this.$v.form.confirmeSenha.sameAsPassword &&
        errors.push("As senhas precisam ser iguais.");
      !this.$v.form.confirmeSenha.required &&
        errors.push("O campo 'Confirmar a sua senha' é obrigatório");
      return errors;
    },
  },
};
</script>

<style>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

.row-register {
  margin-left: 0;
}

.fill-register {
  width: 100%;
  height: 100vh;
}

.flex-register {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-register {
  background-color: #f2f2f2;
}

.btn-ajuste {
  width: 100%;
}

.title-register {
  font-weight: bold;
  font-size: 40px;
}
</style>
