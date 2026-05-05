<template>
  <q-page class="bg-grey-1">
    <!-- Табы переключения статусов -->
    <q-tabs
      v-model="activeStatus"
      dense
      class="bg-white text-grey-7 shadow-2"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      @update:model-value="loadSkills"
    >
      <q-tab name="not_started" icon="list" label="План" />
      <q-tab name="in_progress" icon="pending" label="В процессе" />
      <q-tab name="mastered" icon="check_circle" label="Освоено" />
    </q-tabs>
    <div class="q-pa-md">
      <!-- Список навыков в виде простых Item -->
      <q-list bordered separator class="bg-white rounded-borders">
        <q-item
          v-for="skill in skills"
          :key="skill.id"
          clickable
          v-ripple
          @click="showDetails(skill)"
        >
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ skill.title }}</q-item-label>
            <q-item-label caption class="ellipsis-2-lines">
              {{ skill.description }}
            </q-item-label>
            <q-item-label caption class="text-primary text-caption text-uppercase q-mt-xs">
              {{ skill.domain }} • Уровень {{ skill.level }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chevron_right" color="grey-4" />
          </q-item-section>
        </q-item>

        <q-item v-if="skills.length === 0" class="text-center q-pa-xl text-grey-6">
          <q-item-section>Навыков не найдено</q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog v-model="skillDialog"  transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedSkill">
        <q-bar class="bg-primary text-white q-pa-md" style="height: 50px">
          <div class="text-subtitle1">{{ selectedSkill.title }}</div>
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="q-pa-md">
          <p class=" q-mb-lg">{{ selectedSkill.description }}</p>
          <div class="text-subtitle1"><b>Этапы освоения:</b></div>
          <q-list bordered separator class="rounded-borders">
            <q-item v-for="(stage, index) in selectedSkill.stages" :key="stage.id" class="q-py-md">
              <q-item-section avatar>
                <q-icon
                  :name="stage.is_completed ? 'check_circle' : 'panorama_fish_eye'"
                  :color="stage.is_completed ? 'positive' : 'grey-4'"
                  size="28px"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label :class="{ 'text-strike text-grey-6': stage.is_completed }">
                  {{ stage.description }}
                </q-item-label>
                <q-item-label caption v-if="!stage.is_completed" class="q-mt-xs">
                  <span class="text-weight-bold">Инструкция:</span> {{ stage.instruction }}
                </q-item-label>
              </q-item-section>

              <!-- Кнопка только у актуального этапа -->
              <q-item-section side v-if="isCurrentStage(selectedSkill, index)">
                <q-btn
                  push
                  color="positive"
                  round
                  icon="done"
                  @click="checkStage(stage, selectedSkill)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <div class="q-mt-md">
            <div v-if="activeStatus === 'not_started'" class="text-center q-pa-lg">
              <div class="text-h6 q-mb-md">Готовы начать?</div>
              <q-btn
                unelevated
                rounded
                color="primary"
                label="Начать навык"
                icon="play_arrow"
                @click="updateSkillStatus(selectedSkill, 'in_progress')"
              />
            </div>

            <!-- 2. Если навык В ПРОЦЕССЕ (Этапы) -->
            <div v-else-if="activeStatus === 'in_progress'">
              <div class="text-subtitle2 q-mb-sm text-primary">Текущие задачи:</div>


              <!-- Кнопка ЗАВЕРШИТЬ -->
              <div v-if="allStagesDone(selectedSkill)" class="text-center q-mt-xl">
                <q-btn
                  unelevated
                  rounded
                  color="positive"
                  label="Навык освоен полностью"
                  icon="stars"
                  size="lg"
                  @click="updateSkillStatus(selectedSkill, 'mastered')"
                />
              </div>
            </div>

            <!-- 3. Если навык ОСВОЕН -->
            <div v-else class="text-center q-pa-lg">
              <div class="text-h5 text-amber-9 q-mt-sm">Навык освоен!</div>
              <p class="text-grey-7 q-mt-md">Этот навык уже в копилке достижений вашего ребенка.</p>
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Константы
const childId = 1
const tabLabels = {
  not_started: 'План',
  in_progress: 'В процессе',
  mastered: 'Освоено'
}
const skillDialog = ref(false)
const selectedSkill = ref(null)

const activeStatus = ref('in_progress')
const skills = ref([])
const loading = ref(false)

/**
 * Загрузка списка навыков с вложенными этапами
 */
const loadSkills = async () => {
  loading.value = true
  try {
    const response = await api.post('/Skill/getList', {
      child_id: childId,
      status: activeStatus.value
    })

    // Превращаем 0/1 из БД в нормальные Boolean для чекбоксов
    skills.value = response.data.map(skill => ({
      ...skill,
      stages: skill.stages.map(stage => ({
        ...stage,
        is_completed: Boolean(Number(stage.is_completed))
      }))
    }))
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'negative',
      message: 'Ошибка при получении списка навыков',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const showDetails = (skill) => {
  selectedSkill.value = skill
  skillDialog.value = true
}


// Логика: кнопка "галочка" появляется только у первого невыполненного этапа
const isCurrentStage = (skill, index) => {
  if (activeStatus.value !== 'in_progress') return false
  const firstUnfinishedIndex = skill.stages.findIndex(s => !s.is_completed)
  return index === firstUnfinishedIndex
}

const allStagesDone = (skill) => {
  return skill.stages.length > 0 && skill.stages.every(s => s.is_completed)
}

// Запросы к бэкенду
const startSkill = async (skill) => {
  try {
    await api.post('/skill/updateStatus', {
      child_id: childId,
      skill_id: skill.id,
      status: 'in_progress'
    })
    loadSkills() // Перегружаем список, чтобы навык улетел в "В процессе"
  } catch (e) { console.error(e) }
}

const finishSkill = async (skill) => {
  try {
    await api.post('/skill/updateStatus', {
      child_id: childId,
      skill_id: skill.id,
      status: 'mastered'
    })
    loadSkills()
  } catch (e) { console.error(e) }
}

const toggleStage = async (stage, skill) => {
  try {
    await api.post('/skill/toggleStage', {
      child_id: childId,
      stage_id: stage.id,
      is_completed: true
    })
    // После успешного чека этапа обновляем данные локально или через loadSkills
    stage.is_completed = true
  } catch (e) { console.error(e) }
}

onMounted(() => {
  loadSkills()
})
</script>

<style scoped>
.stage-item {
  border-left: 3px solid transparent;
  transition: all 0.2s ease-in-out;
}
.stage-item:hover {
  background: rgba(25, 118, 210, 0.05);
  border-left: 3px solid #1976d2;
}
.text-strike {
  text-decoration: line-through;
}
.rounded-borders {
  border-radius: 12px;
  overflow: hidden;
}
</style>
