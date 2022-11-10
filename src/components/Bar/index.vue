<template>
  <div class="container"></div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, ref, watch } from "vue";

export interface BarChartOption {
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  data: any[];
}

const margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
};

const colors = ["red", "orange", "yellow", "green", "blue", "navy", "purple"];

const props = withDefaults(defineProps<BarChartOption>(), {
  width: 500,
  height: 500,
});

const initChart = () => {
  const xRange = [margin.left, props.width - margin.right];
  const yRange = [props.height - margin.bottom, margin.top];

  const X = d3.map(props.data, (d: any) => d[props.xLabel]);
  const Y = d3.map(props.data, (d: any) => d[props.yLabel]);

  const xDomain = new d3.InternSet(X);
  const yDomain = [0, 100];

  const I = d3.range(X.length).filter((i) => xDomain.has(X[i]));
  const xScale = d3.scaleBand(xDomain, xRange).padding(0.5);
  const yScale = d3.scaleLinear(yDomain, yRange);

  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(props.height / 100);

  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .attr("viewBox", [0, 0, props.width, props.height + 100])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("class", "svg-container");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", props.width - margin.left - margin.right)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "blue")
        .attr("text-anchor", "start")
        .text(props.yLabel)
    );

  const test = svg
    .append("g")
    .attr("class", "chart")
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", (i: number) => xScale(X[i]))
    .attr("y", props.height - margin.bottom)
    .attr("width", xScale.bandwidth())
    .attr("fill", (i) => colors[i % colors.length])
    .transition()
    .duration(2000)
    .attr("height", (i) => yScale(0) - yScale(Y[i]))
    .attr("transform", (i) => `translate(0,-${yScale(0) - yScale(Y[i])})`)
    .attr("class", "bar");
  // svg
  // .append("g")
  // .attr("class", "chart")
  // .selectAll("rect")
  // .data(I)
  // .join("rect")
  // .attr("x", (i: number) => xScale(X[i]))
  // .attr("y", (i) => yScale(Y[i]))
  // .attr("width", xScale.bandwidth())
  // .attr("fill", (i) => colors[i % colors.length])
  // .transition()
  // .duration(2000)
  // .attr("height", (i) => yScale(0) - yScale(Y[i]))
  // .attr("class", "bar");

  //밑 축
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${props.height - margin.bottom})`)
    .call(xAxis);

  svg.node();
};

const updateChart = () => {
  const svg = d3.select(".container");

  const xRange = [margin.left, props.width - margin.right];
  const yRange = [props.height - margin.bottom, margin.top];

  const X = d3.map(props.data, (d: any) => d[props.xLabel]);
  const Y = d3.map(props.data, (d: any) => d[props.yLabel]);

  const xDomain = new d3.InternSet(X);
  const yDomain = [0, 100];

  const I = d3.range(X.length).filter((i) => xDomain.has(X[i]));
  const xScale = d3.scaleBand(xDomain, xRange).padding(0.5);
  const yScale = d3.scaleLinear(yDomain, yRange);

  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(props.height / 100);

  d3.select(".chart")
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", (i: number) => xScale(X[i]))
    .attr("y", (i) => yScale(Y[i]))
    .attr("width", xScale.bandwidth())
    .attr("fill", (i) => colors[i % colors.length])
    .transition()
    .duration(2000)
    .attr("height", (i) => yScale(0) - yScale(Y[i]))
    .attr("class", "bar");

  d3.select(".x-axis")
    .attr("transform", `translate(0,${props.height - margin.bottom})`)
    .call(xAxis);
};

watch(
  () => {
    [...props.data];
  },
  () => {
    console.log("watch");
    updateChart();
  },
  { deep: true }
);

onMounted(() => {
  initChart();
});
</script>

<style scoped lang="scss">
.container {
  width: 1000px;
  height: 1000px;
}
.chart {
  width: 100%;
  height: 100%;
}

:deep(.bar) {
  background-color: blue;
}
</style>
