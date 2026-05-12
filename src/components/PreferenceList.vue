<template>
  <div class="q-mb-sm">
    <div class="q-mb-md">
      <div class="row items-center justify-between q-mb-sm">
        <div class=" text-weight-bold ">
          <q-icon name="favorite" color="green-7" size="20px" class="q-mr-xs" />
          {{ child.name }} любит
          <q-badge color="green-7" text-color="white" class="q-ml-xs" rounded><b>{{ stimulus.length }}</b></q-badge>
        </div>
        <q-btn icon="add" round unelevated size="sm" color="green-7" @click="openForm('stimulus')" />
      </div>

      <div class="masonry-scroll-wrapper">
        <div class="dual-row-container">
          <div v-for="(row, rowIndex) in sortedStimulus" :key="rowIndex" class="chip-row">
            <q-chip
              v-for="item in row" :key="item.id"
              clickable square
              :icon="getIcon(item.category)"
              color="green-7"
              text-color="white"
              class="rounded-xs q-ma-none"
              :style="{ opacity: 0.4 + (item.intensity / 5) * 0.6 }"
              @click="openForm('stimulus', item)"
            >
              <b>{{ item.title }}</b>
            </q-chip>
          </div>
        </div>
      </div>
    </div>

    <div class="q-mb-md">
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-weight-bold">
          <q-icon name="thunderstorm" color="red-7" size="20px" class="q-mr-xs" />
          {{ child.name }} не любит
          <q-badge color="red-7" text-color="white" class="q-ml-xs" rounded><b>{{ triggers.length }}</b></q-badge>
        </div>
        <q-btn unelevated round  icon="add" size="sm" color="red-7" @click="openForm('trigger')" />
      </div>

      <div class="masonry-scroll-wrapper">
        <div class="dual-row-container">
          <div v-for="(row, rowIndex) in sortedTriggers" :key="rowIndex" class="chip-row">
            <q-chip
              v-for="item in row" :key="item.id"
              clickable square 
              :icon="getIcon(item.category)"
              color="red-7"
              text-color="white"
              class="rounded-xs"
              :style="{ opacity: 0.4 + (item.intensity / 5) * 0.6 }"
              @click="openForm('trigger', item)"
            >
              <b>{{ item.title }}</b>
            </q-chip>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showDialog" position="bottom" transition-show="slide-up">
      <q-card style="width: 100%; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ form.id ? 'Изменить' : 'Добавить' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input v-model="form.title" label="Название" outlined dense />
          <q-select
            v-model="form.category"
            :options="categoryOptions"
            label="Категория"
            outlined dense emit-value map-options
          />
          <div>
            <div class="text-caption text-grey-7">Сила влияния: {{ form.intensity }}</div>
            <q-slider
              v-model="form.intensity"
              :min="1" :max="5" :step="1"
              label markers
              :color="form.impact_type === 'stimulus' ? 'green' : 'red'"
            />
          </div>

          <q-input v-model="form.description" type="textarea" label="Заметки" outlined dense autogrow />
        </q-card-section>

        <q-card-actions align="between" class="q-pa-md">
          <div>
            <q-btn
              v-if="form.id"
              round
              unelevated
              icon="delete"
              color="red"
              @click="confirmDelete(form.id)"
            />
          </div>

          <div class="row q-gutter-sm">
            <q-btn flat label="Отмена" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              :label="form.id ? 'Обновить' : 'Создать'"
              :icon="form.id ? 'autorenew' : 'add'"
              text-color="white"
              class="bg-gradient-primary q-push rounded-sm"
              @click="savePreference"
              :loading="loading"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { api } from 'src/boot/fetch'
import { useQuasar } from 'quasar'
import { useChild } from 'src/composables/useChild'

const { child } = useChild()

const props = defineProps({
  childId: { type: [Number, String], required: true },
  stimulus: { type: Array, default: () => [] },
  triggers: { type: Array, default: () => [] }
})

const emit = defineEmits(['update'])
const $q = useQuasar()
const showDialog = ref(false)
const loading = ref(false)

const categoryOptions = [
  { label: 'Еда', value: 'food' },
  { label: 'Игрушка', value: 'toy' },
  { label: 'Сенсорика', value: 'sensory' },
  { label: 'Активность', value: 'activity' },
  { label: 'Другое', value: 'other' }
]

const sortAndZigzag = (items) => {
  if (!items?.length) return [[], []]
  const sorted = [...items].sort((a, b) => b.intensity - a.intensity)
  
  // Возвращаем массив из двух массивов (рядов)
  return [
    sorted.filter((_, idx) => idx % 2 === 0), // Ряд 1
    sorted.filter((_, idx) => idx % 2 !== 0)  // Ряд 2
  ]
}

const sortedStimulus = computed(() => sortAndZigzag(props.stimulus))
const sortedTriggers = computed(() => sortAndZigzag(props.triggers))

const initialForm = {
  id: null,
  child_id: props.childId,
  title: '',
  category: 'other',
  impact_type: 'stimulus',
  intensity: 3,
  description: ''
}

const form = reactive({ ...initialForm })

const openForm = (type, item = null) => {
  if (item) {
    Object.assign(form, { ...item, intensity: Number(item.intensity) })
  } else {
    Object.assign(form, { ...initialForm, impact_type: type })
  }
  showDialog.value = true
}

const savePreference = async () => {
  loading.value = true
  try {
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (form[key] !== null) formData.append(key, form[key])
    })
    const response = await api.post('/Child/savePreference', formData)
    if (response.status === 'success') {
      $q.notify({ color: 'positive', icon: 'done', message: 'Сохранено', timeout: 800 })
      showDialog.value = false
      emit('update')
    }
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Ошибка сохранения' })
  } finally {
    loading.value = false
  }
}

const confirmDelete = (id) => {
  $q.dialog({
    title: 'Удаление',
    message: 'Вы уверены, что хотите удалить эту запись?',
    cancel: true,
    persistent: true,
    ok: { flat: true, color: 'red', label: 'Удалить' }
  }).onOk(async () => {
    try {
      const response = await api.post(`/Child/deletePreference`, { id })
      if (response.status === 'success' || response) {
        $q.notify({ color: 'grey-8', message: 'Запись удалена', timeout: 800 })
        showDialog.value = false
        emit('update')
      }
    } catch (e) {
      $q.notify({ color: 'negative', message: 'Ошибка при удалении' })
    }
  })
}

const getIcon = (cat) => {
  const icons = { food: 'restaurant', toy: 'smart_toy', activity: 'directions_run', sensory: 'visibility' }
  return icons[cat] || 'category'
}
</script>
<style scoped>
.masonry-scroll-wrapper {
  margin-left: -16px; 
  margin-right: -16px;
  padding: 0 16px;
  overflow-x: auto;
  width: calc(100% + 32px);
  padding-bottom: 4px;
  scrollbar-width: none;
}
.masonry-scroll-wrapper::-webkit-scrollbar { display: none; }

.dual-row-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: max-content;
  min-width: 100%;
}

.chip-row {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: nowrap;
}

.rounded-xs {
  border-radius: 4px;
  margin: 0 !important;
  height: 32px;
}
</style>
