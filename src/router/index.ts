import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Bar from "../views/bar-view/index.vue";
import Donut from "../views/donut-view/index.vue";
import MultiBar from "../views/multi-bar-view/index.vue";
import Line from "../views/line-view/index.vue";

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
  {
    path: "/multi-bar",
    name: "MultiBar",
    component: MultiBar,
  },
  {
    path: "/line",
    name: "LineView",
    component: Line,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
