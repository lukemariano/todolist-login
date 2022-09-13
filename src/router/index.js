import Vue from "vue";
import VueRouter from "vue-router";
import ListTasks from "../views/ListTasks.vue";
import FormTask from "../views/FormTask.vue";
import LoginView from "../views/LoginView.vue";

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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
