<template>
  <div>
    <button @click="pushData()">추가</button>
    <button @click="popData()">삭제</button>

    <BarChart
      :width="500"
      :height="500"
      :data="data"
      x-label="name"
      y-label="score"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BarChart from "../../components/Bar/index.vue";
const appendData = ref(1);
const data = ref([
  {
    name: "A",
    score: 100,
  },
  {
    name: "B",
    score: 80,
  },
  {
    name: "C",
    score: 90,
  },
  {
    name: "D",
    score: 90,
  },
  {
    name: "E",
    score: 90,
  },
  {
    name: "F",
    score: 90,
  },
]);

const pushData = () => {
  data.value.push({ name: appendData.value.toString(), score: 80 });
  appendData.value++;
};

const popData = () => {
  data.value.pop();
};
</script>

<style scoped></style>
