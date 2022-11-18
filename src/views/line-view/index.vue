<template>
  <div>
    <button @click="pushData()">추가</button>
    <button @click="popData()">삭제</button>
    <button @click="pushValue()">옵션 추가</button>

    <LineChart
      :width="700"
      :height="500"
      :data="data"
      x-label="name"
      y-label="score"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LineChart from "../../components/Line/index.vue";
const appendData = ref(1);

const data = ref([
  {
    name: "leehakjoo",
    values: {
      a: 100,
      b: 10,
      c: 100,
      d: 30,
      e: 70,
    },
  },
  {
    name: "sadsa",
    values: {
      a: 50,
      b: 20,
      c: 10,
      d: 70,
      e: 80,
    },
  },
  {
    name: "qweqwewqe",
    values: {
      a: 100,
      b: 50,
      c: 40,
      d: 10,
      e: 90,
    },
  },
  {
    name: "kim",
    values: {
      a: 50,
      b: 30,
      c: 70,
      d: 50,
      e: 80,
    },
  },
  {
    name: "lqq",
    values: {
      a: 40,
      b: 80,
      c: 100,
      d: 40,
      e: 10,
    },
  },
]);

const pushData = () => {
  data.value.push({
    name: "name" + appendData.value.toString(),
    values: {
      a: 40,
      b: 20,
      c: 40,
    },
  });
  appendData.value++;
};

const popData = () => {
  data.value.pop();
};
const pushValue = () => {
  for (let i = 0; i < data.value.length; i++) {
    data.value[i].values["d"] = 50;
  }
};
</script>

<style scoped></style>
