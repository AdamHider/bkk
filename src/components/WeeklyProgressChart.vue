<template>
  <div class="weekly-chart-wrapper">
    <apexchart
      type="line"
      :height="height"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import apexchart from 'vue3-apexcharts'

const props = defineProps({
  skillsData: { type: Array, required: true },
  stagesData: { type: Array, required: true },
  height: { type: [String, Number], default: 250 }
})


const chartSeries = computed(() => [
  {
    name: 'Навыки',
    data: props.skillsData.map(w => w.count)
  },
  {
    name: 'Этапы',
    data: props.stagesData.map(w => w.count)
  }
])

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'inherit',
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  colors: ['#e04c5d', '#fd955b'],
  stroke: {
    curve: 'smooth',
    width: 4,
    lineCap: 'round'
  },
  markers: {
    size: 4,
    strokeWidth: 2,
    hover: { size: 6 }
  },
  xaxis: {
    show: false,
    labels: { show: false },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    borderColor: '#f1f1f1',
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light'
  }
}))
</script>

<style scoped>
.weekly-chart-wrapper {
  width: 100%;
}
</style>
