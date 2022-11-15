<template>
  <div class="container"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import * as d3 from "d3";
import { PieArcDatum } from "d3";

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

const totalValue = computed(() =>
  props.data.reduce((sum, curr) => {
    return sum + curr.value;
  }, 0)
);

const color = d3
  .scaleOrdinal()
  .range(["#3BCB60", "#0789f8", "#f9ba00", "#fe8c00", "#a6a8f8", "#47d7a8"]);

const path = d3
  .arc()
  .outerRadius(radius.value * 0.6)
  .innerRadius(radius.value * 0.5)
  .cornerRadius(5);

const pathBackGround = d3
  .arc()
  .outerRadius(radius.value * 0.6)
  .innerRadius(radius.value * 0.5);

const label = d3
  .arc()
  .outerRadius(radius.value * 0.95)
  .innerRadius(radius.value * 0.95);

const createLabelLocation = (d: any) => {
  const startCoord = label.centroid(d);
  const endCoord = label.centroid(d);
  if (midAngle(d) < Math.PI) {
    startCoord[0] -= 10;
    endCoord[0] -= 40;
  } else {
    startCoord[0] += 60;
    endCoord[0] = startCoord[0] - 30;
  }
  return [startCoord, endCoord, startCoord];
};

const pie = d3
  .pie()
  .value((d: any) => d.value)
  .sort(null);

const midAngle = (d: any) => {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
};

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

  const chartData = pie(props.data);

  const chartItem = g
    .selectAll(".chart__item")
    .data(chartData)
    .join("g")
    .attr("class", "chart__item");

  //도넛 테두리 배경 그리기
  chartItem
    .append("path")
    .transition()
    .duration(2000)
    .attrTween("d", (d: any) => {
      const originalEnd = d.endAngle;
      return (t: number) => {
        const currentAngle = d3.interpolate(
          pie.startAngle()([]),
          pie.endAngle()([])
        )(t);
        if (currentAngle < d.startAngle) return "";
        d.endAngle = Math.min(currentAngle, originalEnd);
        return pathBackGround(d as any);
      };
    })
    .attr("fill", "#EBEBEB");

  //도넛 안  색칠하기
  chartItem
    .data(chartData)
    .append("path")
    .transition()
    .duration(2500)
    .attrTween("d", (d: PieArcDatum<any>) => {
      const originalEnd = d.endAngle - 0.06;
      return (t: number) => {
        const currentAngle = d3.interpolate(
          pie.startAngle()([]),
          pie.endAngle()([])
        )(t);
        if (currentAngle < d.startAngle) return "";
        d.endAngle = Math.min(currentAngle, originalEnd);
        return path(d);
      };
    })
    .attr("fill", (d: any) => color(d.index) as string);

  //Key 글씨 표현
  chartItem
    .append("text")
    .attr("class", "chart__item__key")
    .attr("transform", (d: any) => "translate(" + label.centroid(d) + ")")
    .attr("dx", (d: any) => {
      if (midAngle(d) > Math.PI) {
        return `-${d.data.key.length * 5}px`;
      } else return "0";
    })
    .transition()
    .duration(1500)
    .attr("id", "key")
    .text((d: any) => d.data.key);

  //Value 글씨 표현
  chartItem
    .append("text")
    .attr("xlink:href", "#key")
    .attr("dy", "1.5em")
    .attr("dx", (d: any) => {
      if (midAngle(d) > Math.PI) {
        return `-${d.data.key.length * 5}px`;
      } else return "0";
    })
    .attr("transform", (d) => "translate(" + label.centroid(d) + ")")
    .text(
      (d: any) =>
        `${Math.ceil((d.value / totalValue.value) * 100)}% / ${d.value}`
    )
    .style("font-size", "10px");

  //Donut Value indicator
  chartItem
    .data(chartData)
    .append("polyline")
    .transition()
    .duration(1000)
    .attr("stroke", (d: any) => color(d.index) as string)
    .attr("stroke-width", 2)
    .attr("points", (d: any) => {
      return createLabelLocation(d);
    });
};

const updateChart = () => {
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
  //도넛 테두리 배경 그리기
  chartItem
    .append("path")
    .transition()
    .duration(2000)
    .attrTween("d", (d: any) => {
      const originalEnd = d.endAngle;
      return (t: number) => {
        const currentAngle = d3.interpolate(
          pie.startAngle()([]),
          pie.endAngle()([])
        )(t);
        if (currentAngle < d.startAngle) return "";
        d.endAngle = Math.min(currentAngle, originalEnd);
        return pathBackGround(d as any);
      };
    })
    .attr("fill", "#EBEBEB");

  //도넛 안  색칠하기
  chartItem
    .data(chartData)
    .append("path")
    .transition()
    .duration(2500)
    .attrTween("d", (d: PieArcDatum<any>) => {
      const originalEnd = d.endAngle - 0.06;
      return (t: number) => {
        const currentAngle = d3.interpolate(
          pie.startAngle()([]),
          pie.endAngle()([])
        )(t);
        if (currentAngle < d.startAngle) return "";
        d.endAngle = Math.min(currentAngle, originalEnd);
        return path(d);
      };
    })
    .attr("fill", (d: any) => color(d.index) as string);

  //Key 글씨 표현
  chartItem
    .append("text")
    .attr("class", "chart__item__key")
    .attr("transform", (d: any) => "translate(" + label.centroid(d) + ")")
    .attr("dx", (d: any) => {
      if (midAngle(d) > Math.PI) {
        return `-${d.data.key.length * 5}px`;
      } else return "0";
    })
    .transition()
    .duration(1500)
    .attr("id", "key")
    .text((d: any) => d.data.key);

  //Value 글씨 표현
  chartItem
    .append("text")
    .attr("xlink:href", "#key")
    .attr("dy", "1.5em")
    .attr("dx", (d: any) => {
      if (midAngle(d) > Math.PI) {
        return `-${d.data.key.length * 5}px`;
      } else return "0";
    })
    .attr("transform", (d) => "translate(" + label.centroid(d) + ")")
    .text(
      (d: any) =>
        `${Math.ceil((d.value / totalValue.value) * 100)}% / ${d.value}`
    )
    .style("font-size", "10px");

  //Donut Value indicator
  chartItem
    .data(chartData)
    .append("polyline")
    .transition()
    .duration(1000)
    .attr("stroke", (d: any) => color(d.index) as string)
    .attr("stroke-width", 2)
    .attr("points", (d: any) => {
      return createLabelLocation(d);
    });
};

onMounted(() => {
  initChart();
});

watch(props.data, () => {
  updateChart();
});
</script>

<style scoped lang="scss">
:deep(.chart) {
  opacity: 0.7;
}
:deep(.chart__item__key) {
  font-size: 14px;
  font-weight: bold;
}
</style>
