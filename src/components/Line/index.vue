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
  const dataset: any[] = [
    {
      name: 'leehakjoo',
      values: {
        a: 10,
        b: 40,
        c: 60,
      },
    },
    {
      name: 'sadsa',
      values: {
        a: 50,
        b: 20,
        c: 10,
      },
    },
    {
      name: 'qweqwewqe',
      values: {
        a: 100,
        b: 50,
        c: 40,
      },
    },
  ];

  const categories = Object.keys(dataset[0].values);
  const x = d3.map(categories, (d) => d);
  const xDomain = new d3.InternSet(x);
  const xRange = [margin.left, props.width - margin.right];
  const xScale = d3.scaleBand(xDomain, xRange).padding(1);
  const z = d3.scaleOrdinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

  var line = d3
    .line()
    .x((d: any) => {
      return xScale(d.key) ?? 0;
    })
    .y(function (d: any) {
      return yScale(d.value);
    })
    .curve(d3.curveMonotoneX);

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
    .data(dataset)
    .enter()
    .append('g')
    .selectAll('circle')
    .data((d: any) => {
      console.log('d', d);
      const res = categories.map((key) => ({ key: key, value: d.values[key], name: d.name }));
      return res;
    })
    .enter()
    .append('circle')
    .attr('cx', (d, i) => {
      return xScale(d.key);
    })
    .attr('cy', function (d, i) {
      return yScale(d.value);
    })
    .attr('r', 3)
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('fill', (d: any, i) => {
      return z(d.name) as string;
    });

  svg
    .append('g')
    .selectAll('paths')
    .data(dataset)
    .enter()
    .append('g')
    .append('path')
    .attr('d', (d, i) => {
      const lineValues = categories.map((categorie) => {
        return {
          key: categorie,
          value: d.values[categorie],
          name: d.name,
        };
      });
      return line(lineValues);
    })
    .attr('transform', `translate(${margin.left}, 0)`)
    .style('fill', 'none')
    .style('stroke', (d: any, i: number) => {
      return z(d.name) as string;
    })
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
