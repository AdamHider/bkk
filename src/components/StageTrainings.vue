<template>
  <div>
    <div class="text-caption row items-center q-mb-sm">
      <b>Занятия за неделю</b>
    </div>

    <div class="row justify-between q-gutter-x-xs no-wrap">
      <div v-for="day in weekDays" :key="day.dateString" class="col text-center">
        <q-avatar
          size="34px"
          font-size="12px"
          class="cursor-pointer relative-position"
          :color="getBubbleBg(day)"
          :text-color="getBubbleTextColor(day)"
          :style="day.isToday && !day.trainings.length ? 'box-shadow: 0 0 0 2px #e04c5d' : ''"
        >
          <b>{{ day.label }}</b>
          <q-menu>
            <q-list style="min-width: 160px" dense class="q-py-xs">
              <q-item-label header class="text-caption text-weight-bold q-py-xs">
                {{ day.fullDateLabel }}
              </q-item-label>

              <q-item v-for="t in day.trainings" :key="t.id" class="q-px-sm" style="min-height: 32px">
                <q-item-section avatar style="min-width: auto" class="q-pr-sm">
                  <q-icon
                    :name="t.status === 'active' ? 'hourglass_top' : 'check_circle'"
                    :color="t.status === 'active' ? 'orange-8' : 'blue-grey-6'"
                    size="16px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-caption">
                    <b>{{ formatTime(t.created_at) }}</b>
                    —
                    <span>{{ t.status === 'active' ? timeLeft : `${t.duration_minutes} мин.` }}</span>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="day.trainings.length == 0" header >
                <q-item-section>
                  <q-item-label class="text-caption text-grey-6">
                    Нет занятий
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  trainings: Array
})
const emit = defineEmits(['create-training'])

const timeLeft = ref('00:00')
let timerInterval = null

const activeTraining = computed(() => props.trainings.find(t => t.status === 'active'))

const weekDays = computed(() => {
  const days = []
  const now = new Date()
  const weekdayLabels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(now.getDate() - i)

    const dateString = d.toISOString().split('T')[0] // Быстрый способ получить YYYY-MM-DD
    const dayTrainings = props.trainings.filter(t => t.created_at?.substring(0, 10) === dateString)

    days.push({
      dateString,
      label: weekdayLabels[d.getDay()],
      fullDateLabel: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      trainings: dayTrainings,
      hasActive: dayTrainings.some(t => t.status === 'active'),
      isToday: d.toDateString() === now.toDateString()
    })
  }
  return days
})

const getBubbleBg = (day) => {
  if (day.hasActive) return 'primary'
  if (day.trainings.length) return 'blue-grey-6'
  return 'grey-3'
}

const getBubbleTextColor = (day) => {
  if (day.hasActive || day.trainings.length) return 'white'
  if (day.isToday) return 'primary'
  return 'grey-7'
}

const formatTime = (dateTimeStr) => dateTimeStr?.split(' ')[1]?.substring(0, 5) || ''

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  if (!activeTraining.value) return

  const updateTimer = () => {
    const diff = new Date(activeTraining.value.end_time).getTime() - new Date().getTime()
    if (diff <= 0) {
      timeLeft.value = '00:00'
      activeTraining.value.status = 'finished'
      clearInterval(timerInterval)
      return
    }
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    timeLeft.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
}

watch(activeTraining, () => startTimer(), { deep: true })
onMounted(() => startTimer())
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval) })
</script>
