<template>
  <q-page class="bg-white">
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="child">
      <div class="bg-main-primary relative-position overflow-hidden">
          <BubbleBackground/>
        <div class="row items-center text-center justify-center q-px-md">
            <div class="col-3 q-pt-md">
              <div class="q-pa-sm">
                <q-avatar color="white" text-color="primary" size="50px">
                  <b>{{ child.statistics.main.to_learn }}</b>
                </q-avatar>
                <div class="line-h-1 text-white text-caption q-mt-sm"><b>Учим</b></div>
              </div>
            </div>
            <div class="col-6">
              <q-card flat class="bg-transparent text-center" style="padding-top: 50px;">
                <q-card-section class="q-py-none  q-mt-sm">
                  <q-avatar size="120px" class="q-push cursor-pointer" @click="triggerFileInput">
                    <img :src="child.avatar" style="object-fit: cover">
                    <q-inner-loading :showing="uploading" class="rounded-full">
                      <q-spinner-dots color="primary" size="20px" />
                    </q-inner-loading>
                    <q-badge floating rounded color="white" text-color="primary" class="q-pa-xs shadow-2" style="top: auto; bottom: 0; right: 0;">
                      <q-icon name="add_a_photo" size="16px" />
                    </q-badge>
                  </q-avatar>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onFileSelected"
                  >
                </q-card-section>

                <q-card-section class="q-pt-sm text-white">
                  <div class="text-h5 text-weight-bold">{{ child.name }}</div>
                  <div class="text-subtitle2 text-weight-bold">{{ child.age.display }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3 q-pt-md">
              <div class="q-pa-sm">
                <q-avatar color="white" text-color="primary" size="50px">
                  <b>{{ child.statistics.main.total_mastered }}</b>
                </q-avatar>
                <div class="line-h-1 text-white text-caption q-mt-sm"><b>Умеем</b></div>
              </div>
            </div>
          </div>
          <div class="semisphere" style="margin-top: -60px;"></div>
      </div>

      <div>
          <div class="q-pa-md q-gutter-y-lg">

            <div class="row q-mt-md">
              <div class="col">
                <div class="column items-center q-pa-sm bg-white rounded-borders">
                  <div class="row no-wrap items-center">
                    <div class="text-h5 text-weight-bolder text-primary">
                      +{{ child.statistics.comparison.skills.current }}
                    </div>
                    <q-icon
                      :name="child.statistics.comparison.skills.trend === 'up' ? 'trending_up' : 'trending_down'"
                      :color="child.statistics.comparison.skills.trend === 'up' ? 'positive' : 'negative'"
                      size="24px"
                      class="q-ml-xs"
                    />
                  </div>
                  <div class="text-caption text-weight-bold text-grey-7">Навыки ({{ child.statistics.comparison.months.current }})</div>
                  <div class="text-bold text-blue-grey-3" style="font-size: 10px">
                    было +{{ child.statistics.comparison.skills.last }} ({{ child.statistics.comparison.months.last }})
                  </div>
                </div>
              </div>
              <q-separator inset  vertical/>
              <div class="col">
                <div class="column items-center q-pa-sm bg-white rounded-borders">
                  <div class="row no-wrap items-center">
                    <div class="text-h5 text-weight-bolder text-secondary">
                      +{{ child.statistics.comparison.stages.current }}
                    </div>
                    <q-icon
                      :name="child.statistics.comparison.stages.trend === 'up' ? 'trending_up' : 'trending_down'"
                      :color="child.statistics.comparison.stages.trend === 'up' ? 'positive' : 'negative'"
                      size="24px"
                      class="q-ml-xs"
                    />
                  </div>
                  <div class="text-caption text-weight-bold text-grey-7">Этапы ({{ child.statistics.comparison.months.current }})</div>
                  <div class="text-bold text-blue-grey-3" style="font-size: 10px">
                    было +{{ child.statistics.comparison.stages.last }} ({{ child.statistics.comparison.months.last }})
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. График (уже вынесен ранее) -->
            <q-card flat bordered class="rounded-16 shadow-1">
              <q-card-section class="q-pb-none">
                <div class="text-subtitle1 text-weight-bold">Динамика развития</div>
              </q-card-section>
              <q-card-section class="q-pa-none">
                <WeeklyProgressChart
                  :skills-data="child.statistics.weekly.skills"
                  :stages-data="child.statistics.weekly.stages"
                  height="300"
                />
              </q-card-section>
            </q-card>

            <!-- 3. Анализ категорий -->
            <DomainAnalysis
              :top="child.statistics.domains.top"
              :weak="child.statistics.domains.weak"
            />

          </div>
      </div>

        <!-- Топ 5 навыков в работе -->
        <div class="q-px-md">
          <div class="row justify-between items-center q-mb-sm">
            <div class="text-subtitle1 text-weight-bold text-grey-9">Мы учим</div>
            <q-btn flat no-caps color="primary" label="Показать все" to="/skills" icon-right="chevron_right" dense/>
          </div>
          <SkillSlider :skills="child.skills.active"/>
        </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios' // Возвращаем любимый Axios
import SkillSlider from 'components/SkillSlider.vue'
import { useQuasar } from 'quasar'
import BubbleBackground from 'src/components/BubbleBackground.vue';
import WeeklyProgressChart from '../components/WeeklyProgressChart.vue'
import DomainAnalysis from '../components/DomainAnalysis.vue'

const $q = useQuasar()

const childId = 1
const child = ref(null)
const loading = ref(true)

const loadDashboard = async () => {
  loading.value = true
  try {
    const response = await api.post('/Child/getItem', { child_id: childId })
    child.value = response.data
  } catch (error) {
    console.error('Ошибка API:', error)
  } finally {
    loading.value = false
  }
}

const fileInput = ref(null)
const uploading = ref(false)

// Вызов диалога выбора файла
const triggerFileInput = () => {
  fileInput.value.click()
}

// Обработка выбранного файла
const onFileSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    $q.notify({ color: 'negative', message: 'Файл слишком большой' })
    return
  }
  const formData = new FormData()
  formData.append('child_id', childId)
  formData.append('avatar', file) // Поле, которое будет ждать сервер
  uploading.value = true
  try {
    // Отправляем на child->updateItem
    const response = await api.post('/Child/updateImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data.status == 'success') {
      child.value.avatar = response.data.avatar
      $q.notify({ color: 'positive', message: 'Фото обновлено', icon: 'done' })
    }
  } catch (error) {
    console.error('Ошибка загрузки:', error)
    $q.notify({ color: 'negative', message: 'Не удалось загрузить фото' })
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.border-white {
  border: 2px solid white;
}
</style>
