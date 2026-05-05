<template>
  <q-page class="bg-grey-1 q-pa-md">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <template v-else-if="child">
      <!-- Профиль ребенка -->
      <div class="row items-center q-mb-lg">
        <q-avatar size="60px" class="shadow-2 border-white">
          <img :src="child.avatar">
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-h6 text-weight-bold">{{ child.name }}</div>
          <div class="text-subtitle2 text-grey-7">
            Возраст: {{ child.age.display }}
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="row q-col-gutter-md">
        <!-- Прогресс-бар -->
        <div class="col-12">
          <q-card class="my-card text-center q-pa-md shadow-2">
            <q-card-section>
              <div class="text-overline text-primary">Общий прогресс</div>
              <q-circular-progress
                show-value
                font-size="16px"
                :value="masteredPercent"
                size="140px"
                :thickness="0.2"
                color="positive"
                track-color="grey-3"
                class="q-ma-md"
              >
                {{ masteredPercent }}%
              </q-circular-progress>

              <div class="row justify-around q-mt-sm">
                <div class="text-center">
                  <div class="text-weight-bold">{{ child.statistics.total_mastered }}</div>
                  <div class="text-caption text-grey">Всего</div>
                </div>
                <q-separator vertical inset />
                <div class="text-center">
                  <div class="text-weight-bold text-positive">+{{ child.statistics.mastered_monthly }}</div>
                  <div class="text-caption text-grey">За месяц</div>
                </div>
                <q-separator vertical inset />
                <div class="text-center">
                  <div class="text-weight-bold text-orange">{{ child.statistics.to_learn }}</div>
                  <div class="text-caption text-grey">Осталось</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Топ 5 навыков в работе -->
        <div class="col-12">
          <div class="text-subtitle1 text-weight-bold q-mb-sm q-ml-xs text-grey-9">Сейчас в работе</div>
          <q-card flat bordered class="bg-white rounded-borders">
            <q-list separator>
              <q-item v-for="(skill, index) in child.skills_preview" :key="index" v-ripple>
                <q-item-section avatar>
                  <q-icon name="psychology" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ skill.title }}</q-item-label>
                  <q-item-label caption>{{ skill.domain }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-4" />
                </q-item-section>
              </q-item>

              <q-item v-if="!child.skills_preview || child.skills_preview.length === 0" class="text-center text-grey q-pa-md">
                <q-item-section>Нет активных навыков в работе</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios' // Возвращаем любимый Axios

const childId = 1
const child = ref(null)
const loading = ref(true)

const masteredPercent = computed(() => {
  if (!child.value) return 0
  const stats = child.value.statistics
  const total = stats.total_mastered + stats.to_learn
  return total === 0 ? 0 : Math.round((stats.total_mastered / total) * 100)
})

const loadDashboard = async () => {
  loading.value = true
  try {
    // В Axios данные лежат в .data
    const response = await api.post('/Child/getItem', { child_id: childId })
    child.value = response.data
  } catch (error) {
    console.error('Ошибка API:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.my-card {
  border-radius: 20px;
}
.border-white {
  border: 2px solid white;
}
</style>
