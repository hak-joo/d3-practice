<template>
  <div class="container"></div>
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

const x0 = d3.scaleBand().rangeRound([0, props.width]).paddingInner(0.1);
const x1 = d3.scaleBand().padding(0.05);

const y = d3.scaleLinear().rangeRound([props.height, 0]);
const z = d3
  .scaleOrdinal()
  .range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56",
    "#d0743c",
    "#ff8c00",
  ]);

const initChart = () => {
  const { data, height, width } = props;
  if (data.length === 0) return;
  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .attr("viewBox", [0, 0, props.width, props.height + 100])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("class", "svg-container");

  const g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  for (let i = 0; i < 1; i++) {
    const keys = Object.keys(data[i].values);

    x0.domain(data.map((d) => d.name));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, 100]);

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d) => "translate(" + x0(d.name) + ",0)")
      .selectAll("rect")
      .data((d) => {
        return keys.map((key) => ({ key: key, value: d.values[key] }));
      })
      .enter()
      .append("rect")
      .attr("x", (d: any) => x1(d.key) ?? 0)
      .attr("y", height)
      .attr("width", x1.bandwidth())
      .attr("fill", (d: any) => z(d.key) as string)
      .transition()
      .delay((d) => Math.random() * 500)
      .duration(1000)
      .attr("height", (d) => (d.value ? height - y(d.value) : 0))
      .attr("transform", (d) => {
        const transY = y(0) - y(d.value);
        if (!transY) return "";
        else return `translate(0,-${transY})`;
      });

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()!) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");
    // .text("Population");

    const legend = g
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        console.log("i", i);
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) {
        return d;
      });
  }
};

const updateChart = () => {
  const { data, height, width } = props;

  const svg = d3.select(".svg-container");

  svg.select("g").selectAll("g").remove();
  if (data.length === 0) return;
  const g = svg.select("g");
  y.domain([0, 100]);

  for (let i = 0; i < 1; i++) {
    const keys = Object.keys(data[i].values);

    x0.domain(data.map((d) => d.name));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d) => "translate(" + x0(d.name) + ",0)")
      .selectAll("rect")
      .data((d) => {
        return keys.map((key) => ({ key: key, value: d.values[key] }));
      })
      .enter()
      .append("rect")
      .attr("x", (d: any) => x1(d.key) ?? 0)
      .attr("y", height)
      .attr("width", x1.bandwidth())
      .attr("fill", (d: any) => z(d.key) as string)
      .transition()
      .delay((d) => Math.random() * 500)
      .duration(1000)
      .attr("height", (d) => (d.value ? height - y(d.value) : 0))
      .attr("transform", (d) => {
        const transY = y(0) - y(d.value);
        if (!transY) return "";
        else return `translate(0,-${transY})`;
      });

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()!) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");
    // .text("Population");

    const legend = g
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) {
        return d;
      });
  }
};

watch(props.data, () => {
  updateChart();
});

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
