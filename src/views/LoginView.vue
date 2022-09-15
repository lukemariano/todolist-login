<template>
  <v-row class="row-login fill-login">
    <v-col sm="5" class="flex-login left-login">
      <div class="col-6">
        <h2 class="mb-6 text-center title-login">Faça o login</h2>
        <form>
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
          <p class="red--text">{{ errorLogin }}</p>
          <v-btn small class="forget-password mb-3 primary--text"
            >Esqueceu a sua senha?</v-btn
          >

          <v-btn @click="login" color="primary btn-ajuste mb-4">
            <i class="fas fa-sign-in-alt"></i>Entrar</v-btn
          >
          <hr />
          <v-btn
            @click="register"
            outlined
            color="secundary"
            class="btn-ajuste mt-4"
          >
            <i class="fas fa-user-plus"></i> Registrar</v-btn
          >
        </form>
      </div>
    </v-col>
    <v-col sm="7" class="flex-login">
      <img src="../assets/images/login.svg" />
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
import UsersModel from "@/models/UsersModel";

export default {
  data() {
    return {
      errorLogin: null,
      form: {
        email: null,
        senha: null,
      },
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      senha: {
        required,
        minLength: minLength(6),
      },
    },
  },
  mixins: [validationMixin],
  methods: {
    async login() {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }

      let user = await UsersModel.params({ email: this.form.email }).get();

      //validação email
      if (!user || !user[0] || !user[0].email) {
        this.errorLogin = "Email e/ou senha incorretos.";
        this.clearForm();
        setTimeout(() => {
          this.errorLogin = null;
        }, 4000);
        return;
      }

      user = user[0];

      // validação senha
      if (user.senha !== this.form.senha) {
        this.errorLogin = "Email e/ou senha incorretos.";
        this.clearForm();
        setTimeout(() => {
          this.errorLogin = null;
        }, 4000);
        return;
      }

      // se logado com sucesso, realizar salvamento das infos no navegador do usuário
      localStorage.setItem("authUser", JSON.stringify(user));
      this.$router.push({ name: "dashboard" });
    },
    clearForm() {
      this.form = {
        email: null,
        senha: null,
      };
    },
    register() {
      this.$router.push({ name: "register" });
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

.row-login {
  margin-left: 0;
}

.fill-login {
  width: 100%;
  height: 100vh;
}

.flex-login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-login {
  background-color: #f2f2f2;
}

.btn-ajuste {
  width: 100%;
}

.forget-password {
  background-color: transparent !important;
  border: none !important;
  text-decoration: none !important;
  box-shadow: none !important;
  text-align: left;
  padding: 0 !important;
}

.title-login {
  font-weight: bold;
  font-size: 40px;
}
</style>
