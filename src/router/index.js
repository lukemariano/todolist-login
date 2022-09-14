import Vue from "vue";
import VueRouter from "vue-router";
import ListTasks from "../views/ListTasks.vue";
import FormTask from "../views/FormTask.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "listtask",
    component: ListTasks,
  },
  {
    path: "/form",
    name: "formtask",
    component: FormTask,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// protegendo a rota de login para usuários não logados
router.beforeEach((to, from, next) => {
  if (
    to.name !== "login" &&
    to.name !== "register" &&
    !localStorage.getItem("authUser")
  ) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
