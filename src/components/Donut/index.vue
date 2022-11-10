<template>
  <div class="container"></div>
</template>

<script setup lang="ts">
//https://bl.ocks.org/mbhall88/22f91dc6c9509b709defde9dc29c63f2
import { computed, onMounted, watch } from "vue";
import * as d3 from "d3";
export interface DonutChartOption {
  width: number;
  height: number;
  data: any[];
}

const props = withDefaults(defineProps<DonutChartOption>(), {
  width: 450,
  height: 450,
});
const margin = 50;

const radius = computed(() => Math.min(props.width, props.height) / 2 - margin);

const color = d3
  .scaleOrdinal()
  .range(["#3BCB60", "#0789f8", "#f9ba00", "#fe8c00", "#a6a8f8", "#47d7a8"]);

const initChart = () => {
  const svg = d3
    .select(".container")
    .append("svg")
    .attr("class", "donut-chart")
    .attr("width", props.width)
    .attr("height", props.height);

  const g = svg
    .append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${props.width / 2},${props.height / 2})`);

  const pie = d3
    .pie()
    .value((d: any) => d.value)
    .sort(null);

  const chartData = pie(props.data);

  const path = d3
    .arc()
    .outerRadius(radius.value - 5)
    .innerRadius(radius.value - 20)
    .cornerRadius(5);

  const pathBackGround = d3
    .arc()
    .outerRadius(radius.value - 4)
    .innerRadius(radius.value - 21);

  const label = d3.arc().outerRadius(radius.value).innerRadius(radius.value);

  const chartItem = g
    .selectAll(".chart__item")
    .data(chartData)
    .join("g")
    .attr("class", "chart__item");

  chartItem
    .append("path")
    .transition()
    .duration(2000)
    .attrTween("d", (d) => {
      const originalEnd = d.endAngle;
      return (t) => {
        const currentAngle = d3.interpolate(
          pie.startAngle()([]),
          pie.endAngle()([])
        )(t);
        if (currentAngle < d.startAngle) return "";
        d.endAngle = Math.min(currentAngle, originalEnd);
        return pathBackGround(d);
      };
    })
    .attr("fill", "#EBEBEB");

  chartItem
    .append("path")
    .transition()
    .duration(2000)
    .attrTween("d", (d) => {
      const originalEnd = d.endAngle - 0.06;
      return (t) => {
        const currentAngle = d3.interpolate(
          pie.startAngle()([]),
          pie.endAngle()([])
        )(t);
        if (currentAngle < d.startAngle) return "";
        d.endAngle = Math.min(currentAngle, originalEnd);
        return path(d);
      };
    })
    .attr("fill", (d: any) => color(d.index));

  chartItem
    .append("text")
    .attr("transform", (d: any) => {
      console.log("d", d);
      return "translate(" + label.centroid(d) + ")";
    })
    .attr("dx", (d) => `${d.startAngle}em`)
    .attr("dy", "1em")
    .text((d: any) => d.data.key);
};

const updateChart = () => {
  const path = d3
    .arc()
    .outerRadius(radius.value - 5)
    .innerRadius(radius.value - 20)
    .cornerRadius(5);

  const pathBackGround = d3
    .arc()
    .outerRadius(radius.value - 4)
    .innerRadius(radius.value - 21);

  const label = d3.arc().outerRadius(radius.value).innerRadius(radius.value);

  const pie = d3
    .pie()
    .value((d: any) => d.value)
    .sort(null);

  const chartData = pie(props.data);

  d3.select(".chart").selectAll(".chart__item").remove();

  const chartItem = d3
    .select(".chart")
    .selectAll(".chart__item")
    .data(chartData)
    .join("g")
    .attr("class", "chart__item");

  chartItem.append("path").attr("d", pathBackGround).attr("fill", "#EBEBEB");

  chartItem
    .append("path")
    .transition()
    .duration(2000)
    .attrTween("d", (d) => {
      const originalEnd = d.endAngle - 0.06;
      return (t) => {
        const currentAngle = d3.interpolate(
          pie.startAngle()([]),
          pie.endAngle()([])
        )(t);
        if (currentAngle < d.startAngle) return "";
        d.endAngle = Math.min(currentAngle, originalEnd);
        return path(d);
      };
    })
    .attr("fill", (d: any) => color(d.index));

  chartItem
    .append("text")
    .attr("transform", (d: any) => "translate(" + label.centroid(d) + ")")
    .attr("dy", "0.35em")
    .text((d: any) => d.data.key);
};

onMounted(() => {
  initChart();
});

watch(props.data, () => {
  updateChart();
});
</script>

<style scoped lang="scss">
.container {
}
:deep(.chart) {
  // stroke: #fff;
  // stroke-width: 2px;
  opacity: 0.7;
}
</style>
