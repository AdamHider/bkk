<template>
  <q-page class="bg-white q-pa-md" style="padding-top: 50px;">

    <div class="row items-center justify-between no-wrap q-mb-md q-mt-sm">
      <div class="col">
        <div class="text-h6 text-weight-bold">Игры</div>
        <div class="text-caption text-grey-7">Список развивающих игр</div>
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
        <div class="q-mb-md">
          <q-card flat>
            <div v-if="games.length === 0" class="text-center q-py-xl text-grey-6">
              <q-icon name="assignment_late" size="40px" class="text-grey-4 q-mb-sm" />
              <div class="text-body2">Игр пока нет</div>
            </div>

            <q-list v-else>
              <q-item v-for="game in games" :key="game.id" class="bg-white q-push q-mb-md q-py-md rounded-borders shadow-sm" clickable @click="openGameDialog(game)">


                <q-item-section class="cursor-pointer">
                  <q-item-label class="text-weight-bold">
                    {{ game.title }}
                  </q-item-label>
                  <q-item-label class="text-caption ellipsis-2-lines">
                    {{ game.description }}
                  </q-item-label>
                  <div class="q-mt-xs">
                    <q-chip
                      v-for="item in game.prefs" :key="item.id"
                      :icon="getIcon(item.category)"
                      size="sm"
                      color="green-7"
                      text-color="white"
                      class="rounded-xs q-ma-none"
                      :style="{ opacity: 0.4 + (item.intensity / 5) * 0.6 }"
                    >
                      <b>{{ item.title }}</b>
                    </q-chip>
                  </div>

                </q-item-section>

                <q-item-section side>
                </q-item-section>

              </q-item>
            </q-list>
          </q-card>
        </div>

        <q-dialog v-model="gameDialog" persistent maximized>
          <q-card style="min-width: 320px; max-width: 420px; width: 100%" class="rounded-md">

            <q-card-section class="bg-primary q-py-sm" style="width: 100%; padding-bottom: 55px;">

              <q-item :class="`q-px-sm bg-white  rounded-borders `">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="sym_o_sports_esports">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-primary"><b>{{ activeGame.title }}</b></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div>
                  <q-btn flat icon="more_vert" aria-haspopup="menu">
                    <q-menu auto-close>
                      <q-list role="menu" style="min-width: 100px">
                        <q-item clickable @click="openEditDialog(activeGame)">
                          <q-item-section no-wrap>Изменить</q-item-section>
                        </q-item>
                        <q-item clickable @click="confirmDelete(activeGame.id)">
                          <q-item-section no-wrap text-color="negative">Удалить</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <q-btn icon="close" flat round dense v-close-popup @click="activeGame = {}" />
                </div>
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-card-section class="bg-white rounded-b-none rounded-t-lg q--avoid-card-border" style="flex: 1; margin-top: -25px;  padding-top: 35px;" >
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-weight-bold ">
                    <q-icon name="sym_o_sentiment_very_satisfied" color="primary" size="20px" class="q-mr-xs" />
                    Как играть?
                  </div>
                </div>
                <div>
                  {{ activeGame.description }}
                </div>
              </q-card-section>
            <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-weight-bold ">
                    <q-icon name="favorite" color="primary" size="20px" class="q-mr-xs" />
                    Используемые стимулы
                  </div>
                </div>
                <div>
                  <q-chip
                    v-for="item in activeGame.prefs" :key="item.id"
                    clickable square
                    :icon="getIcon(item.category)"
                    color="green-7"
                    text-color="white"
                    class="rounded-xs q-ma-none"
                    :style="{ opacity: 0.4 + (item.intensity / 5) * 0.6 }"
                  >
                    <b>{{ item.title }}</b>
                  </q-chip>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div class=" text-weight-bold ">
                    <q-icon name="sym_o_exercise" color="primary" size="20px" class="q-mr-xs" />
                    Целевые навыки
                  </div>
                </div>
                <q-list>
                  <q-item
                      v-for="skill in activeGame.skills"
                      :key="skill.id"
                      clickable
                      v-ripple
                      class="bg-white q-push q-mb-md q-py-md rounded-borders shadow-sm"
                    >
                      <q-item-section avatar>
                        <q-avatar :color="`${skill.category.color}-1`" :text-color="`${skill.category.color}-7`" :icon="skill.category.icon">
                          <q-badge floating rounded style="top: unset; bottom: -7px; font-family: Times New Roman;"
                            :color="['green-4', 'orange-4', 'red-4', 'purple-4'][skill.level - 1]"
                            text-color="white"
                            :label="['I', 'II', 'III', 'IV'][skill.level - 1]"/>
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-weight-bold">{{ skill.title }}</q-item-label>
                        <q-item-label caption>Уровень {{ skill.level }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-circular-progress
                          show-value
                          rounded
                          font-size="10px"
                          :value="skill.progress.percentage"
                          size="40px"
                          :thickness="0.2"
                          color="primary"
                          track-color="grey-2"
                          class="text-primary text-weight-bold"
                        >
                          {{ skill.progress.label }}
                        </q-circular-progress>
                      </q-item-section>
                    </q-item>
                  </q-list>
              </q-card-section>
          </q-card>
        </q-dialog>

        <q-dialog v-model="isFormDialogOpen" persistent>
          <q-card style="min-width: 320px; max-width: 420px; width: 100%" class="rounded-md">

            <q-card-section class="row items-center justify-between bg-grey-1 q-py-sm">
              <div class="text-subtitle1 text-weight-bold text-primary row items-center">
                {{ form.id ? 'Редактировать игру' : 'Новая игра' }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section class="q-pa-md q-gutter-y-md">
                <q-input
                  v-model="form.title"
                  label="Название"
                  outlined dense type="input" rows="1"
                  :rules="[val => !!val && !!val.trim() || 'Название обязательно']"
                />
                <q-input
                  v-model="form.description"
                  label="Описание"
                  outlined dense type="textarea" rows="2"
                  :rules="[val => !!val && !!val.trim() || 'Описание обязательно']"
                />
                <q-select
                  v-model="form.prefs"
                  :options="child.preferences.stimulus"
                  label="Выберите стимулы"
                  outlined dense
                  option-value="id"
                  option-label="title"
                  emit-value
                  map-options
                  multiple
                  :rules="[val => !!val || 'Выберите стимул из списка']"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.title }}</q-item-label>
                        <q-item-label caption class="text-primary">{{ scope.opt.description }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select><q-select
                  v-model="form.skills"
                  :options="skills.in_progress"
                  label="Выберите навыки"
                  outlined dense
                  option-value="id"
                  option-label="title"
                  emit-value
                  map-options
                  multiple
                  :rules="[val => !!val || 'Выберите навык из списка']"
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
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md bg-grey-1">
              <q-btn flat label="Отмена" color="grey-7" v-close-popup no-caps />
              <q-btn
                :label="form.id ? 'Сохранить' : 'Создать'"
                color="primary"
                @click="saveGame"
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
import { onBeforeRouteLeave } from 'vue-router'
import { api } from 'src/boot/fetch'
import { useQuasar } from 'quasar'
import { useSkills } from 'src/composables/useSkills'
import { useChild } from 'src/composables/useChild'

const $q = useQuasar()
const { skills } = useSkills()
const { child } = useChild()

const games = ref([])
const activeGame = ref({})
const gameDialog = ref(false)
const isFormDialogOpen = ref(false)

const form = ref({ id: null, title: '', description: '', prefs: [], skills: [] })

const loadGames = async () => {
  try {
    const response = await api.post('/Game/getList', { child_id: 1 })
    games.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('Ошибка загрузки игр:', error)
  }
}

// Открытие на создание (без id)
const openCreateDialog = (targetDate) => {
  form.value = {
    id: null,
    title: '',
    description: '',
    prefs: [],
    skills: []
  }
  isFormDialogOpen.value = true
}
const openGameDialog = (game) => {
  activeGame.value = game
  gameDialog.value = true
}
// Открытие на редактирование (передаем данные существующей таски)
const openEditDialog = (game) => {
  form.value = {
    id: game.id,
    title: game.title,
    description: game.description,
    prefs: game.prefs.map((pref) => { return pref.id }),
    skills: game.skills.map((skill) => { return skill.id })
  }
  isFormDialogOpen.value = true
}

// Объединенный метод Сохранения (Создание / Изменение)
const saveGame = async () => {
  if (!form.value.description || !form.value.description.trim()) return

  const isEdit = !!form.value.id
  const url = isEdit ? '/Game/updateItem' : '/Game/createItem'

  const payload = {
    child_id: 1,
    title: form.value.description,
    description: form.value.description,
    prefs: form.value.prefs,
    skills: form.value.skills
  }

  if (isEdit) payload.id = form.value.id

  try {
    const response = await api.post(url, payload)

    isFormDialogOpen.value = false
    gameDialog.value = false
    loadGames()

    $q.notify({
      type: 'positive',
      message: isEdit ? 'Игра обновлена' : 'Игра создана',
      timeout: 1000
    })
  } catch (error) {
    console.error('Ошибка сохранения игры:', error)
  }
}

const confirmDelete = (gameId) => {
  $q.dialog({
    title: 'Удаление',
    message: 'Вы уверены, что хотите удалить эту игру?',
    cancel: { flat: true, label: 'Отмена', color: 'grey-7' },
    ok: { flat: true, label: 'Удалить', color: 'red' },
    persistent: true
  }).onOk(async () => {
    try {
      await api.post('/Game/deleteItem', { id: gameId })
      games.value = games.value.filter(t => t.id !== gameId)
      loadGames()
      $q.notify({ type: 'positive', message: 'Игра удалена', timeout: 1000 })
      gameDialog.value = false
      activeGame.value = {}
    } catch (error) {
      console.error('Ошибка удаления игры:', error)
      gameDialog.value = false
      activeGame.value = {}
    }
  })
}


const getIcon = (cat) => {
  const icons = { food: 'restaurant', toy: 'smart_toy', activity: 'directions_run', sensory: 'visibility' }
  return icons[cat] || 'category'
}
onMounted(() => loadGames())

onBeforeRouteLeave((to, from) => {
  if (isFormDialogOpen.value) {
    isFormDialogOpen.value = false
    return false
  }
  if (gameDialog.value) {
    gameDialog.value = false
    return false
  }
  return true
})
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
</style>
