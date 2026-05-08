<template>
  <div class="chart-container">
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
  height: { type: [String, Number], default: 160 }
})

const chartSeries = computed(() => [
  { name: 'Навыки', data: props.skillsData.map(w => w.count) },
  { name: 'Этапы', data: props.stagesData.map(w => w.count) }
])

const chartOptions = computed(() => {
  const allValues = [...chartSeries.value[0].data, ...chartSeries.value[1].data]
  const maxValue = Math.max(...allValues, 5) // Минимум 5 для красоты шкалы

  return {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'inherit',
      sparkline: { enabled: false }, // Выключаем, чтобы контролировать отступы вручную
    },
    colors: ['#e04c5d', '#fd955b'],
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round'
    },
    dataLabels: { 
      offsetY: -7,
      enabled: true,
      background: {
        borderRadius: 5,
        padding: 5
      } 

    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    markers: {
      size: 0,
      hover: { size: 5, strokeWidth: 2 }
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 4, // Пунктирная сетка — признак стиля
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: {
        top: -10,
        right: 20, // Небольшой отступ, чтобы линия не липла к краю
        bottom: -10,
        left: 20
      }
    },
    xaxis: {
      categories: props.skillsData.map(w => w.label), // Используем ваши новые лейблы
      labels: {
        show: true,
        rotate:20, // Держим горизонтально для аккуратности
        style: {
          colors: '#9e9e9e',
          fontSize: '10px',
          fontWeight: 600
        },
        offsetY: -5 // Приподнимаем ближе к сетке
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      show: false,
      min: 0,
      max: maxValue * 1.1 // Небольшой запас сверху
    },
    legend: { show: false },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light',
      x: { show: false },
      marker: { show: true },
      fixed: { enabled: false },
      style: { fontSize: '12px' },
      y: { formatter: (val) => `+${val}` }
    }
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style>