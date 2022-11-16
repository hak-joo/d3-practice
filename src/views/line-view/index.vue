<template>
  <div>
    <button @click="pushData()">추가</button>
    <button @click="popData()">삭제</button>
    <button @click="pushValue()">옵션 추가</button>

    <LineChart
      :width="500"
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
    name: "A",
    values: {
      "20221113": 70,
      "20221114": 40,
    },
  },
  //   {
  //     name: "B",
  //     values: {
  //       "20221113": 70,
  //       "20221114": 90,
  //     },
  //   },
  //   {
  //     name: "C",
  //     values: {
  //       "20221113": 70,
  //       "20221114": 50,
  //     },
  //   },
]);

const pushData = () => {
  data.value.push({
    name: "name" + appendData.value.toString(),
    values: {
      math: 50,
      eng: 60,
    },
  });
  appendData.value++;
};

const popData = () => {
  data.value.pop();
};
const pushValue = () => {
  for (let i = 0; i < data.value.length; i++) {
    data.value[i].values["kor"] = 100;
  }
};
</script>

<style scoped></style>
