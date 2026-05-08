<template>
  <div class="weekly-chart-wrapper">
    <apexchart
      type="area"
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
  height: { type: [String, Number], default: 220 }
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
    sparkline: { enabled: false }, // Оставляем false, чтобы видеть подписи месяцев
    fontFamily: 'inherit',

    height: 250,
    type: 'area'
  },
  // Мягкий синий и мягкий зеленый
  colors: ['#3b82f6', '#10b981'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 2, // Тонкая линия выглядит изящнее
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3, // Легкая заливка сверху
      opacityTo: 0.05,  // Почти исчезает к низу
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: props.skillsData.map(w => w.label),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#94a3b8', fontSize: '11px' }
    }
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false
  },
  grid: {
    show: true,
    borderColor: '#f1f5f9',
    strokeDashArray: 0, // Сплошная, но очень бледная линия
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } }, // Оставляем только горизонтальные направляющие
    padding: { top: 0, right: 0, bottom: 0, left: 0 }
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    style: { fontSize: '12px' },
    y: {
      formatter: (val) => `${val}`
    }
  }
}))
</script>

<style scoped>
.weekly-chart-wrapper {
  width: 100%;
  /* Убираем лишние отступы самого svg */
  margin-left: -10px;
}
</style>
