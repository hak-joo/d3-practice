<template>
  <div class="container" />
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, ref, watch } from "vue";

export interface BarChartOption {
  width: number;
  height: number;
  xLabel?: string;
  yLabel?: string;
  data: any[];
}

const margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
};

const props = withDefaults(defineProps<BarChartOption>(), {
  width: 500,
  height: 500,
});

const initChart = () => {
  var dataset1 = [
    [1, 1],
    [12, 20],
    [24, 36],
    [32, 50],
    [40, 70],
    [50, 100],
    [55, 106],
    [65, 123],
    [73, 130],
    [78, 134],
    [83, 136],
    [89, 138],
    [100, 140],
  ];

  // Step 3
  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .attr("viewBox", [0, 0, props.width, props.height + 100])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("class", "svg-container");

  var width = props.width;
  var height = props.height;

  // Step 4
  var xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, props.width - margin.right]),
    yScale = d3
      .scaleLinear()
      .domain([0, 140])
      .range([props.height - margin.bottom, margin.top]);

  var g = svg.append("g").attr("transform", `translate(${margin.left}, 0)`);

  // Step 6
  g.append("g")
    .attr("transform", "translate(0," + (height - margin.top) + ")")
    .call(d3.axisBottom(xScale));
  g.append("g")
    .call(d3.axisLeft(yScale).ticks(props.height / 100))
    .attr("transform", `translate(${margin.left}, 0)`);

  // Step 7
  svg
    .append("g")
    .selectAll("dot")
    .data(dataset1)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d[0]);
    })
    .attr("cy", function (d) {
      return yScale(d[1]);
    })
    .attr("r", 3)
    .attr("transform", `translate(${margin.left}, 0)`)
    .style("fill", "#CC0000");

  // Step 8
  var line = d3
    .line()
    .x(function (d) {
      return xScale(d[0]);
    })
    .y(function (d) {
      return yScale(d[1]);
    })
    .curve(d3.curveMonotoneX);

  svg
    .append("path")
    .datum(dataset1)
    .attr("class", "line")
    .attr("d", (d) => line(d))
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .attr("transform", `translate(${margin.left}, 0)`)
    .style("stroke-width", "2");
};

const updateChart = () => {};

watch(props.data, () => {
  updateChart();
});

onMounted(() => {
  initChart();
});
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
