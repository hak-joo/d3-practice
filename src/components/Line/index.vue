<template>
  <div class="container" />
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, ref, watch } from 'vue';

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
  const dataset = [
    {
      name: 'leehakjoo',
      values: {
        a: 1,
        b: 2,
        c: 3,
      },
    },
  ];
  const categories = Object.keys(dataset[0].values);
  const xx = d3.map(categories, (d) => d);
  const xxDomain = new d3.InternSet(xx);
  const xxRange = [margin.left, props.width - margin.right];
  const xxScale = d3.scaleBand(xxDomain, xxRange).padding(1);
  var dataset1 = [
    ['a', 1],
    ['b', 20],
    ['c', 36],
    ['d', 50],
    ['e', 70],
    ['f', 100],
    ['g', 106],
    ['h', 123],
    ['i', 130],
  ];
  const x = d3.map(dataset1, (d: any) => d[0]);

  const xDomain = new d3.InternSet(x);
  const xRange = [margin.left, props.width - margin.right];
  const xScale = d3.scaleBand(xDomain, xRange).padding(1);
  // Step 3
  const svg = d3
    .select('.container')
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('viewBox', [0, 0, props.width, props.height + 100])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('class', 'svg-container');

  var width = props.width;
  var height = props.height;

  // Step 4
  const yScale = d3
    .scaleLinear()
    .domain([0, 140])
    .range([props.height - margin.bottom, margin.top]);

  var g = svg.append('g').attr('transform', `translate(${margin.left}, 0)`);

  // Step 6
  g.append('g')
    .attr('transform', 'translate(0,' + (height - margin.top) + ')')
    .call(d3.axisBottom(xScale));
  g.append('g')
    .call(d3.axisLeft(yScale).ticks(props.height / 100))
    .attr('transform', `translate(${margin.left}, 0)`);

  // Step 7
  svg
    .append('g')
    .selectAll('dot')
    .data(dataset1)
    .enter()
    .append('circle')
    .attr('cx', function (d, i) {
      return xScale(x[i]);
    })
    .attr('cy', function (d) {
      return yScale(d[1]);
    })
    .attr('r', 3)
    .attr('transform', `translate(${margin.left}, 0)`)
    .style('fill', '#CC0000');

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
    .append('path')
    .datum(dataset1)
    .attr('class', 'line')
    .attr('d', (d) => line(d))
    .style('fill', 'none')
    .style('stroke', '#CC0000')
    .attr('transform', `translate(${margin.left}, 0)`)
    .style('stroke-width', '2');
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
