<template>
  <q-page class="bg-white q-pa-md" style="padding-top: 50px;">

    <div class="row items-center justify-between no-wrap q-mb-md q-mt-sm">
      <div class="col">
        <div class="text-h6 text-weight-bold">Календарь задач</div>
        <div class="text-caption text-grey-7">Распределение и контроль дел по датам</div>
      </div>
      <div class="col-auto">
        <q-btn
          round
          class="q-push bg-gradient-primary"
          text-color="white"
          icon="add"
          @click="openCreateDialog(selectedDate)"
        />
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">

        <q-card flat class="rounded-md shadow-1 q-mb-lg shadow-sm">
          <q-date
            v-model="selectedDate"
            mask="YYYY-MM-DD"
            minimal
            :locale="ruLocale"
            :events="getEvents"
            :event-color="getEventColor"
          />
        </q-card>

        <div class="q-mb-md">
          <div class="text-subtitle1 text-weight-bold text-grey-8 row items-center q-mb-sm">
            <q-icon name="history" class="q-mr-xs" color="grey-7" />
            Задачи за последние 7 дней
          </div>

          <q-card flat>
            <div v-if="recentTasks.length === 0" class="text-center q-py-xl text-grey-6">
              <q-icon name="assignment_late" size="40px" class="text-grey-4 q-mb-sm" />
              <div class="text-body2">За последние 7 дней задач не создавалось</div>
            </div>

            <q-list v-else>
              <q-item v-for="task in recentTasks" :key="task.id" class="bg-white q-push q-mb-md q-py-md rounded-borders shadow-sm">

                <q-item-section side top>
                  <q-checkbox
                    :model-value="task.status === 'completed'"
                    @update:model-value="toggleTaskStatus(task)"
                    color="green"
                  />
                </q-item-section>

                <q-item-section class="cursor-pointer" @click="openEditDialog(task)">
                  <q-item-label
                    :class="{ 'text-strikethrough text-grey-5': task.status === 'completed' }"
                    class="text-weight-bold"
                  >
                    {{ task.description }}
                  </q-item-label>

                  <q-item-label class="q-mt-sm">
                    <q-chip
                      :color="task.status === 'completed' ? 'grey-2' : 'red-1'"
                      :text-color="task.status === 'completed' ? 'grey-6' : 'primary'"
                      style="font-size: 11px;"
                      class="q-ma-none"
                    >
                      <q-icon name="alarm" size="12px" class="q-mr-xs" />
                      <b>{{ formatItemDate(task.deadline) }}</b>
                    </q-chip>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat round dense
                    color="grey-4" text-color="grey-7"
                    icon="delete"
                    @click="confirmDelete(task.id)"
                  />
                </q-item-section>

              </q-item>
            </q-list>
          </q-card>
        </div>

        <q-dialog v-model="isListDialogOpen" @hide="resetSelectedDate">
          <q-card style="min-width: 320px; max-width: 450px; width: 100%" class="rounded-md">

            <q-card-section class="row items-start justify-between bg-grey-1">
              <div>
                <div class="text-subtitle1 text-weight-bold text-primary row items-center no-wrap">
                  <q-icon name="playlist_add_check" class="q-mr-xs" />
                  {{ formatSelectedDate(selectedDate) }}
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  Задач на день: {{ selectedTasks.length }}
                </div>
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pa-md scroll" style="max-height: 50vh">
              <q-list v-if="selectedTasks.length" separator class="q-gutter-y-xs">
                <q-item v-for="task in selectedTasks" :key="task.id" class="bg-white q-push q-mb-md q-py-md rounded-borders shadow-sm">

                  <q-item-section side top>
                    <q-checkbox
                      :model-value="task.status === 'completed'"
                      @update:model-value="toggleTaskStatus(task)"
                      color="green"
                    />
                  </q-item-section>

                  <q-item-section class="cursor-pointer" @click="openEditDialog(task)">
                    <q-item-label :class="{ 'text-strikethrough text-grey-5': task.status === 'completed' }" class="text-weight-bold text-body2 text-grey-9">
                      {{ task.description }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      flat round dense
                      color="grey-4" text-color="grey-7"
                      icon="delete"
                      @click="confirmDelete(task.id)"
                    />
                  </q-item-section>

                </q-item>
              </q-list>

              <div v-else class="text-center q-py-xl text-grey-6">
                <q-icon name="assignment_turned_in" size="48px" class="q-mb-sm text-grey-4" />
                <div class="text-body2 text-weight-medium">Задач на этот день нет</div>
                <q-btn
                  flat color="primary"
                  label="Создать задачу"
                  no-caps
                  class="q-mt-sm"
                  @click="openCreateDialog(selectedDate)"
                />
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-sm bg-grey-1" v-if="selectedTasks.length">
              <q-btn
                flat label="Добавить еще"
                icon="add" color="primary"
                no-caps
                @click="openCreateDialog(selectedDate)"
              />
            </q-card-actions>

          </q-card>
        </q-dialog>

        <q-dialog v-model="isFormDialogOpen" persistent>
          <q-card style="min-width: 320px; max-width: 420px; width: 100%" class="rounded-md">

            <q-card-section class="row items-center justify-between bg-grey-1 q-py-sm">
              <div class="text-subtitle1 text-weight-bold text-primary row items-center">
                <q-icon :name="form.id ? 'edit' : 'playlist_add'" class="q-mr-xs" />
                {{ form.id ? 'Редактировать задачу' : 'Новая задача' }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <!-- ТАБЫ (Доступны только при создании новой задачи) -->
            <div v-if="!form.id" class="bg-grey-1 q-px-sm">
              <q-tabs
                v-model="activeTab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="manual" label="Заметка" icon="edit_note" no-caps />
                <q-tab name="skill" label="Навык" icon="star_border" no-caps />
              </q-tabs>
              <q-separator />
            </div>

            <q-card-section class="q-pa-md q-gutter-y-md">
              <div v-if="activeTab === 'manual' || form.id">
                <q-input
                  v-model="form.description"
                  label="Описание / Заметка *"
                  outlined dense type="textarea" rows="2"
                  :rules="[val => !!val && !!val.trim() || 'Описание обязательно']"
                />
              </div>
              <div v-else class="q-gutter-y-sm">
                <q-select
                  v-model="selectedSkill"
                  :options="skills.in_progress"
                  label="Выберите навык ребенка *"
                  outlined dense
                  option-value="id"
                  option-label="title"
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Выберите навык из списка']"
                  @update:model-value="handleSkillSelect"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.title }}</q-item-label>
                        <q-item-label caption class="text-primary">{{ scope.opt.description }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <q-input
                outlined
                dense
                v-model="form.deadline"
                label="Дата выполнения"
                hint="Оставьте пустым, если нет конкретного срока"
                clearable
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      @before-show="updateProxyDate"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="proxyDate" mask="YYYY-MM-DD" minimal :locale="ruLocale">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Отмена" color="primary" flat v-close-popup />
                          <q-btn label="OK" color="primary" flat @click="saveProxyDate" v-close-popup />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

            </q-card-section>

            <q-card-actions align="right" class="q-pa-md bg-grey-1">
              <q-btn flat label="Отмена" color="grey-7" v-close-popup no-caps />
              <q-btn
                :label="form.id ? 'Сохранить' : 'Создать'"
                color="primary"
                @click="saveTask"
                :disable="!form.description || !form.description.trim()"
                no-caps
                class="q-px-md"
              />
            </q-card-actions>

          </q-card>
        </q-dialog>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from 'src/boot/fetch'
import { useQuasar } from 'quasar'
import { useSkills } from 'src/composables/useSkills'

const $q = useQuasar()
const { skills } = useSkills()

const selectedDate = ref(null)
const allTasks = ref([])
const isListDialogOpen = ref(false)
const isFormDialogOpen = ref(false)

// В структуре формы теперь опционально присутствует id
const form = ref({ id: null, description: '', deadline: null })

const activeTab = ref('manual')
const proxyDate = ref('')
const selectedSkill = ref(null)

const ruLocale = {
  days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  firstDayOfWeek: 1
}

watch(selectedDate, (newDate) => {
  if (newDate) {
    isListDialogOpen.value = true
  }
})

const selectedTasks = computed(() => {
  if (!selectedDate.value) return []
  return allTasks.value.filter(task => task.deadline?.substring(0, 10) === selectedDate.value)
})

const recentTasks = computed(() => {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0).getTime()
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime()

  return allTasks.value
    .filter(task => {
      if (!task.created_at) return false
      const createdAtMs = new Date(task.created_at.replace(/-/g, '/')).getTime()
      return createdAtMs >= sevenDaysAgo && createdAtMs <= endOfToday
    })
    .sort((a, b) => new Date(b.created_at.replace(/-/g, '/')) - new Date(a.created_at.replace(/-/g, '/')))
})

const getEvents = (date) => {
  const formattedDate = date.replace(/\//g, '-')
  return allTasks.value.some(task => task.deadline?.substring(0, 10) === formattedDate)
}

const getEventColor = (date) => {
  const formattedDate = date.replace(/\//g, '-')
  const dayTasks = allTasks.value.filter(task => task.deadline?.substring(0, 10) === formattedDate)
  const hasPending = dayTasks.some(t => t.status === 'pending')
  return hasPending ? 'blue-7' : 'green-6'
}

const loadTasks = async () => {
  try {
    const response = await api.post('/Task/getList', { child_id: 1 })
    allTasks.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('Ошибка загрузки задач:', error)
  }
}

// Открытие на создание (без id)
const openCreateDialog = (targetDate) => {
  form.value = {
    id: null,
    description: '',
    deadline: targetDate || null // Теперь дедлайн по умолчанию может быть null
  }
  isFormDialogOpen.value = true
}

// Открытие на редактирование (передаем данные существующей таски)
const openEditDialog = (task) => {
  form.value = {
    id: task.id,
    description: task.description,
    deadline: task.deadline ? task.deadline.substring(0, 10) : null
  }
  isFormDialogOpen.value = true
}

// Объединенный метод Сохранения (Создание / Изменение)
const saveTask = async () => {
  if (!form.value.description || !form.value.description.trim()) return

  const isEdit = !!form.value.id
  const url = isEdit ? '/Task/updateItem' : '/Task/createItem'

  const payload = {
    child_id: 1,
    description: form.value.description,
    deadline: form.value.deadline ? `${form.value.deadline} 12:00:00` : null
  }

  if (isEdit) payload.id = form.value.id

  try {
    const response = await api.post(url, payload)

    isFormDialogOpen.value = false
    isListDialogOpen.value = false
    loadTasks()

    $q.notify({
      type: 'positive',
      message: isEdit ? 'Задача обновлена' : 'Задача создана',
      timeout: 1000
    })
  } catch (error) {
    console.error('Ошибка сохранения задачи:', error)
  }
}
const updateProxyDate = () => {
  proxyDate.value = form.value.deadline || selectedDate.value || new Date().toISOString().split('T')[0]
}
const saveProxyDate = () => {
  form.value.deadline = proxyDate.value
  console.log(proxyDate.value)
}
const handleSkillSelect = (skillId) => {
  const skill = skills.value.in_progress.find(s => s.id === skillId)
  console.log(skill)
  if (skill) {
    form.value.description = `Отработать навык: ${skill.title} (${skill.description})`
  }
}
const toggleTaskStatus = async (task) => {
  const oldStatus = task.status
  task.status = oldStatus === 'pending' ? 'completed' : 'pending'

  try {
    await api.post('/Task/updateItem', { id: task.id, status: task.status })
    loadTasks()
  } catch (error) {
    task.status = oldStatus
    console.error('Ошибка обновления статуса:', error)
  }
}

const confirmDelete = (taskId) => {
  $q.dialog({
    title: 'Удаление',
    message: 'Вы уверены, что хотите удалить эту задачу?',
    cancel: { flat: true, label: 'Отмена', color: 'grey-7' },
    ok: { flat: true, label: 'Удалить', color: 'red' },
    persistent: true
  }).onOk(async () => {
    try {
      await api.post('/Task/deleteItem', { id: taskId })
      allTasks.value = allTasks.value.filter(t => t.id !== taskId)
      loadTasks()
      $q.notify({ type: 'positive', message: 'Задача удалена', timeout: 1000 })
    } catch (error) {
      console.error('Ошибка удаления задачи:', error)
    }
  })
}

const resetSelectedDate = () => {
  selectedDate.value = null
  loadTasks()
}

const formatSelectedDate = (dateStr) => {
  if (!dateStr) return ''
  const safeDateStr = dateStr.replace(/-/g, '/')
  return new Date(safeDateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatItemDate = (dateStr) => {
  if (!dateStr) return 'Без срока'
  const safeDateStr = dateStr.split(' ')[0].replace(/-/g, '/')
  return new Date(safeDateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

onMounted(() => loadTasks())
</script>

<style scoped>
:deep(.q-date) {
  min-width: unset !important;
  max-width: 100% !important;
  width: 100% !important;
}
.text-strikethrough {
  text-decoration: line-through;
}
.rounded-md {
  border-radius: 12px;
}
</style>
