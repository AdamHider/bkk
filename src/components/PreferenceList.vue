<template>
  <div class="sensory-profile">
    <!-- СЕКЦИЯ СТИМУЛОВ -->
    <div class="q-mb-md">
      <div class="row items-center justify-between q-mb-sm">
        <div class=" text-weight-bold ">
          <q-icon name="favorite" color="green-7" size="20px" class="q-mr-xs" />
          {{ child.name }} любит
          <q-badge color="green-7" text-color="white" class="q-ml-xs" rounded><b>{{ stimulus.length }}</b></q-badge>
        </div>
        <q-btn flat round dense icon="add_circle" color="green-7" @click="openForm('stimulus')" />
      </div>

      <div class="row q-gutter-xs">
        <q-chip
          v-for="item in stimulus" :key="item.id"
          clickable square
          :icon="getIcon(item.category)"
          color="green-7"
          text-color="white"
          :icon-right="`sym_o_counter_${item.intensity}`"
          @click="openForm('stimulus', item)">
          {{ item.title }}
        </q-chip>
      </div>
    </div>

    <div class="q-mb-md">
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2 text-weight-bold">
          <q-icon name="thunderstorm" color="red-7" size="20px" class="q-mr-xs" />
          {{ child.name }} не любит
          <q-badge color="red-7" text-color="white" class="q-ml-xs" rounded><b>{{ triggers.length }}</b></q-badge>
        </div>
        <q-btn flat round dense icon="add_circle" color="red-7" @click="openForm('trigger')" />
      </div>

      <div class="row q-gutter-xs">
        <q-chip
          v-for="item in triggers" :key="item.id"
          clickable
          :icon="getIcon(item.category)"
          color="red-7"
          text-color="white"
          class="shadow-1"
          :icon-right="`sym_o_counter_${item.intensity}`"
          @click="openForm('trigger', item)"
        >
          {{ item.title }}
        </q-chip>
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
              flat
              icon="delete"
              color="red"
              label="Удалить"
              @click="confirmDelete(form.id)"
            />
          </div>

          <div class="row q-gutter-sm">
            <q-btn flat label="Отмена" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              :label="form.id ? 'Обновить' : 'Создать'"
              :color="form.impact_type === 'stimulus' ? 'green' : 'red'"
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
import { ref, reactive } from 'vue'
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
