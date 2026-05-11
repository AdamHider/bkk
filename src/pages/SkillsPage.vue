<template>
  <q-page class="bg-white q-pa-md" style="padding-top: 50px;">
    <div class="row items-center justify-between no-wrap q-mb-md q-mt-sm">
      <div class="col">
        <div class="text-h6 text-weight-bold">
          Учимся
          <q-chip round color="primary" text-color="white" size="sm">
            {{ skills.in_progress.length }}
          </q-chip>
        </div>
        <div class="text-caption text-grey-7">Навыки, которые мы сейчас развиваем</div>
      </div>
      <q-btn
        round
        class="q-push bg-gradient-primary"
        text-color="white"
        icon="add"
        @click="openUnmasteredList"
      />
    </div>

    <q-list v-if="skills.in_progress.length">
      <div v-for="(group, title) in groupedActiveSkills" :key="title">
        <div class="q-mt-lg q-mb-sm q-px-sm">
          <div class="row items-center justify-between">
            <div class="text-overline text-grey-9 text-weight-bold line-h-1" style="letter-spacing: 1px;">
              {{ title }}
              <q-badge :color="group.statusColor" class="q-ml-sm" rounded>
                {{ group.items.length }}
              </q-badge>
            </div>
            <q-separator class="col q-ml-md" color="grey-3" />
          </div>

        </div>

        <q-item
          v-for="skill in group.items"
          :key="skill.id"
          clickable
          v-ripple
          @click="openDetails(skill)"
          class="bg-white q-push q-mb-md q-py-md rounded-borders shadow-sm"
          :style="skill.stuck_info.is_stuck ? 'border-left: 4px solid #f2c037' : ''"
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
            <q-item-label class="text-weight-bold">{{ skill.title }}
              <q-icon v-if="skill.stuck_info.is_stuck" name="timer" color="warning" class="q-ml-xs">
                <q-tooltip>Навык долго без изменений</q-tooltip>
              </q-icon>
            </q-item-label>
            <q-item-label v-if="skill.stuck_info.is_stuck" caption class="text-orange-9 text-weight-medium">
              {{ skill.stuck_info.message }}
            </q-item-label>
            <q-item-label v-else caption>Уровень {{ skill.level }}</q-item-label>
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
      </div>
    </q-list>

    <div v-else-if="!isLoading" class="text-center q-pa-xl text-grey-5">
      <q-icon name="rocket_launch" size="64px" class="q-mb-md" />
      <div class="text-h6 text-grey-7">Нет активных целей</div>
      <p>Выберите навыки из библиотеки, чтобы начать обучение</p>
    </div>

    <UnmasteredSkillsDialog
      v-model="unmasteredDialogVisible"
      :skills="skills.not_started"
      @select-skill="handleStatusChange"
    />

    <SkillDetailsDialog
      v-model="detailsDialogVisible"
      :skill="selectedSkill"
      :status="selectedSkill?.current_status"
      :is-all-done="selectedSkill ? isAllStagesCompleted(selectedSkill) : false"
      :current-index="selectedSkill ? getFirstUnfinishedIndex(selectedSkill) : -1"
      @check-stage="handleCheck"
      @update-status="handleStatusChange"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onActivated } from 'vue'
import { useQuasar } from 'quasar'
import { useSkills } from 'src/composables/useSkills'

import SkillDetailsDialog from 'src/components/SkillDetailsDialog.vue'
import UnmasteredSkillsDialog from 'src/components/UnmasteredSkillsDialog.vue'
import SuccessDialog from 'components/SuccessDialog.vue'

const $q = useQuasar()
const { skills, loadSkills, updateStatus, updateStage } = useSkills()

const childId = 1
const isLoading = ref(false)
const detailsDialogVisible = ref(false)
const unmasteredDialogVisible = ref(false)
const selectedSkill = ref(null)

// Группировка с логикой анализа количества
const groupedActiveSkills = computed(() => {
  const groups = {}
  skills.value.in_progress.forEach(skill => {
    const title = skill.category.title
    if (!groups[title]) {
      groups[title] = { items: [], statusColor: 'primary' }
    }
    groups[title].items.push(skill)
  })

  // Определяем цвет индикатора группы
  for (const key in groups) {
    const count = groups[key].items.length
    if (count < 2) groups[key].statusColor = 'orange-6'
    else if (count > 3) groups[key].statusColor = 'red-6'
    else groups[key].statusColor = 'green-6'
  }
  return groups
})

const refreshActive = async () => {
  isLoading.value = true
  try { await loadSkills(childId, 'in_progress') }
  finally { isLoading.value = false }
}

const openUnmasteredList = async () => {
  try {
    await loadSkills(childId, 'not_started')
    unmasteredDialogVisible.value = true
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Ошибка загрузки' })
  }
}

const openDetails = (skill) => {
  selectedSkill.value = skill
  detailsDialogVisible.value = true
}

const handleStatusChange = async (skillOrStatus, explicitStatus, date) => {
  const skillId = skillOrStatus.id || selectedSkill.value?.id
  const status = explicitStatus || skillOrStatus

  try {
    await updateStatus(childId, skillId, status, date)
    await loadSkills(childId, 'in_progress')
    await loadSkills(childId, 'mastered')

    if (status === 'mastered') {
      $q.dialog({
        component: SuccessDialog,
        componentProps: { type: 'skill', title: selectedSkill.value?.title || 'Навык' }
      })
      detailsDialogVisible.value = false
    }
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Ошибка обновления' })
  }
}

const handleCheck = async (stage) => {
  try {
    await updateStage(childId, stage.id, true)
    await loadSkills(childId, 'in_progress')

    // Обновляем ссылку в диалоге, чтобы прогресс-бар сразу изменился
    if (selectedSkill.value) {
      selectedSkill.value = skills.value.in_progress.find(s => s.id === selectedSkill.value.id)
    }

    $q.dialog({
      component: SuccessDialog,
      componentProps: { type: 'stage', title: selectedSkill.value?.title }
    })
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Ошибка прогресса' })
  }
}

const getFirstUnfinishedIndex = (skill) => skill.stages.findIndex(s => !s.is_completed)
const isAllStagesCompleted = (skill) => skill.stages.length > 0 && skill.stages.every(s => s.is_completed)

onActivated(refreshActive)
</script>
