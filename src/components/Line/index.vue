<template>
  <div class="container" />
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, watch } from "vue";

export interface LineChartOption {
  width: number;
  height: number;
  xLabel?: string;
  yLabel?: string;
  data: any[];
}

const margin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const props = withDefaults(defineProps<LineChartOption>(), {
  width: 500,
  height: 500,
});

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

const generateCategories = (datas: any) => {
  let categories: any[] = [];
  datas.forEach((data: any) => categories.push(...Object.keys(data.values)));
  categories = [...new Set(categories)];
  return categories;
};

const getChartParams = (categories: any[], d: any) => {
  const data = categories.map((categorie) => ({
    key: categorie,
    value: d.values[categorie],
    name: d.name,
  }));
  return data;
};

const initChart = () => {
  const { width, height, data } = props;

  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height + 100])
    .attr("class", "svg-container");
};

const updateChart = () => {
  const { width, height, data } = props;

  const categories = generateCategories(data);
  const x = d3.map(categories, (d) => d);
  const xDomain = new d3.InternSet(x);
  const xRange = [margin.left, width - margin.right];
  const paddingX = 1;

  const xScale = d3.scaleBand(xDomain, xRange).padding(paddingX);
  const yScale = d3
    .scaleLinear()
    .domain([0, 140])
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((d: any) => xScale(d.key) ?? 0)
    .y((d: any) => yScale(d.value) ?? 0)
    .curve(d3.curveLinear);

  const svg = d3.select(".svg-container");

  svg.selectAll("g").remove();
  d3.select("#tooltip").remove();

  const g = svg.append("g").attr("transform", `translate(${margin.left}, 0)`);

  g.append("g")
    .attr("transform", "translate(0," + (height - margin.top) + ")")
    .call(d3.axisBottom(xScale));
  g.append("g")
    .call(d3.axisLeft(yScale).ticks(height / 100))
    .attr("transform", `translate(${margin.left}, 0)`);

  // Circles Start
  const circles = svg
    .append("g")
    .attr("class", "circles")
    .selectAll("circles")
    .data(data);

  circles
    .enter()
    .selectAll("circle")
    .data((d: any) => getChartParams(categories, d))
    .enter()
    .append("circle")
    .attr("cx", (d: any) => xScale(d.key) as number)
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 3)
    .attr("transform", `translate(${margin.left}, 0)`)
    .attr("fill", (d: any) => z(d.name) as string);
  // Circles End

  // Line Start
  const paths = svg
    .append("g")
    .attr("class", "paths")
    .selectAll("paths")
    .data(data);

  const line1 = paths
    .enter()
    .append("path")
    .attr("d", (d) => line(getChartParams(categories, d)))
    .attr("fill", "none")
    .attr("transform", `translate(${margin.left}, 0)`);

  const pathLengths = line1.nodes().map((node) => node.getTotalLength());
  const transitionPath = d3.transition().ease(d3.easeQuadIn).duration(1500);
  paths
    .enter()
    .selectAll("path")
    .attr("class", "line")
    .attr("stroke-dashoffset", (d, i) => pathLengths[i])
    .attr("stroke-dasharray", (d, i) => pathLengths[i])
    .transition(transitionPath)
    .delay((d) => Math.random() * 500)
    .attr("stroke-dashoffset", 0)
    .style("stroke", (d: any, i) => z(d.name) as string);
  //Line end

  const tooltip = d3
    .select(".container")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#e2e2e2")
    .style("padding", 6)
    .style("display", "none");

  const mouseG = svg.append("g").attr("class", "mouse-over-effects");
  mouseG
    .append("path")
    .attr("class", "mouse-line")
    .style("stroke", "#A9A9A9")
    .style("stroke-width", 1.5)
    .style("opacity", "0");

  const mousePerLine = mouseG
    .selectAll("mouse-per-line")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine
    .append("circle")
    .attr("r", 4)
    .style("stroke", (d: any) => z(d.name) as string)
    .style("fill", "none")
    .style("stroke-width", 3)
    .style("opacity", "0");
  mouseG
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseout", () => {
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line circle").style("opacity", "0");
      d3.selectAll(".mouse-per-line text").style("opacity", "0");
      d3.selectAll("#tooltip").style("display", "none");
    })
    .on("mouseover", () => {
      d3.select(".mouse-line").style("opacity", "1");
      d3.selectAll(".mouse-per-line circle").style("opacity", "1");
      d3.selectAll("#tooltip").style("display", "block");
    })
    .on("mousemove", (e: MouseEvent) => {
      const currentX = d3.pointer(e)[0];
      // console.log("currentX", currentX);
      const xScaleList = categories.map((categorie) => xScale(categorie));

      let target = "";
      let datas: any[] = [];
      d3.selectAll(".mouse-per-line").attr("transform", (d: any, i) => {
        // 마우스 기준 오른쪽 방향으로 가장 가까운 x축을 찾음
        target =
          categories[d3.bisectLeft(xScaleList as number[], currentX)] ??
          categories[categories.length - 1];

        datas.push({
          key: d.name,
          value: d.values[target],
        });

        //수직선 좌표 설정
        d3.select(".mouse-line").attr("d", function () {
          const strokeD = `M${d3.pointer(e)[0]},${height - margin.top} ${
            d3.pointer(e)[0]
          },${margin.top}`;
          return strokeD;
        });

        if (!xScale(target)) return "";

        //x좌표와 y좌표를 이동시켜 circle의 위치를 수정
        return `translate(${xScale(target)! + margin.left},${yScale(
          d.values[target]
        )})`;
      });

      let tooltipOffset = e.pageY - 20;
      const tooltipEl = document.getElementById("tooltip");
      const tooltipSize = tooltipEl!.clientHeight;
      if (e.offsetY + tooltipSize > height - margin.bottom)
        tooltipOffset = e.pageY - tooltipSize;

      const tooltipCont = tooltip
        .html(target)
        .attr("class", "tool-bar")
        .style("left", `${e.pageX + 20}px`)
        .style("top", `${tooltipOffset}px`)
        .selectAll()
        .data(datas);

      tooltipCont
        .enter()
        .append("div")
        .html((d) => `${d.key}: ${d.value}`)
        .attr("class", "tool-bar-item")
        .style("color", (d) => z(d.key) as string);
    });
};

watch(props.data, () => updateChart());

onMounted(() => {
  initChart();
  updateChart();
});
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

:deep(.tool-bar) {
  padding: 1rem 1rem;
}
</style>
