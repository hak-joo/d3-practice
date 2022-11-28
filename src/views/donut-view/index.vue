<template>
  <div>
    <button @click="pushData()">추가</button>
    <button @click="popData()">삭제</button>

    <DonutChart :width="500" :height="500" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DonutChart from "../../components/Donut/index.vue";

const appendData = ref(1);
const data = ref([
  {
    key: "Team Tokens",
    value: 100,
  },
  {
    key: "Public Sale",
    value: 60,
  },
  {
    key: "Option pool",
    value: 100,
  },
  {
    key: "Foundation",
    value: 50,
  },
  {
    key: "Reserved",
    value: 100,
  },
]);
// const data = ref([{ a: 1 }, { b: 2 }, { c: 3 }]);
// const data = ref([
//   { name: "USA", value: 40 },
//   { name: "UK", value: 20 },
//   { name: "Canada", value: 30 },
//   { name: "Maxico", value: 10 },
// ]);
const pushData = () => {
  data.value.push({ key: appendData.value.toString(), value: 80 });
  // data.value = [
  //   ...data.value,
  //   {
  //     key: "1",
  //     value: 10,
  //   },
  // ];
  appendData.value++;
};

const popData = () => {
  data.value.pop();
};
</script>

<style scoped></style>
