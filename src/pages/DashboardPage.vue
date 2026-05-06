<template>
  <q-page class="bg-grey-1 q-pa-md">
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="child">
      <!-- Профиль ребенка -->
      <q-card flat class="bg-transparent text-center">
        <q-card-section class="q-py-none">
          <q-avatar size="120px" class="shadow-2 border-white cursor-pointer" @click="triggerFileInput">
            <img :src="child.avatar" style="object-fit: cover">
            <q-inner-loading :showing="uploading" class="rounded-full">
              <q-spinner-dots color="primary" size="20px" />
            </q-inner-loading>
            <q-badge floating rounded color="primary" class="q-pa-xs shadow-2" style="top: auto; bottom: 0; right: 0;">
              <q-icon name="photo_camera" size="14px" />
            </q-badge>
          </q-avatar>

          <!-- Скрытый инпут для выбора файла -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelected"
          >
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-h6 text-weight-bold">{{ child.name }}</div>
          <div class="text-subtitle2 text-grey-7">Возраст: {{ child.age.display }}</div>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md">
          <div class="col-12 q-mb-md">
            <q-card class="text-center">
              <q-card-section class="q-pb-none q-pt-sm">
                <div class="text-subtitle1 text-weight-bold text-grey-9">Освоение навыков</div>
              </q-card-section>
              <q-card-section class="row justify-around q-pt-sm">
                <div>
                  <div class="text-weight-bold text-h5">{{ child.statistics.total_mastered }}</div>
                  <div class="text-caption text-grey">Всего</div>
                </div>
                <div>
                  <div class="text-weight-bold text-h5">{{ child.statistics.mastered_monthly }}</div>
                  <div class="text-caption text-grey">За месяц</div>
                </div>
                <div>
                  <div class="text-weight-bold text-h5">{{ child.statistics.to_learn }}</div>
                  <div class="text-caption text-grey">Осталось</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Топ 5 навыков в работе -->
        <div class="col-12">
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
