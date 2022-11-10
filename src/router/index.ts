import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import Bar from "../views/bar-view/index.vue";
import Donut from "../views/donut-view/index.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/bar",
    name: "BarView",
    component: Bar,
  },
  {
    path: "/donut",
    name: "DonutView",
    component: Donut,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
