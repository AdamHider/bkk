<template>
  <q-page class="bg-white q-pa-md" style="padding-top: 50px;">
    <div class="row items-center justify-between no-wrap q-mb-md q-mt-sm ">
      <div>
        <div class="text-h6 text-weight-bold">Активные навыки
          <q-chip round color="primary" text-color="white" size="sm">{{ skills.in_progress.length }}</q-chip>
        </div>
        <div class="text-caption text-grey-7">Навыки, которые мы изучаем. Чтобы добавить навык, нажмите на "+"</div>
      </div>
      <q-btn
        round
        class="q-mx-sm q-push bg-gradient-primary"
        text-color="white"
        icon="add"
        @click="openUnmasteredList"
      />
    </div>

    <q-inner-loading :showing="isLoading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <q-list v-if="skills.in_progress.length"  >
      <q-item
        v-for="skill in skills.in_progress"
        :key="skill.id"
        clickable
        v-ripple
        @click="openDetails(skill)"
        :class="`bg-white q-push q-mb-md q-py-md rounded-borders`"
      >
        <q-item-section avatar>
          <q-avatar :color="`${skill.category.color}-2`" :text-color="`${skill.category.color}-7`"  :icon="skill.category.icon">
            <q-badge floating rounded style="top: unset; bottom: -7px; font-family: Times New Roman;"
              :color="['green-4', 'orange-4', 'red-4', 'purple-4'][skill.level - 1]"
              text-color="white"
              :label="['I', 'II', 'III', 'IV'][skill.level - 1]"/>
          </q-avatar>

        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-bold">{{ skill.title }}</q-item-label>
          <q-item-label caption>{{ skill.category.title }} </q-item-label>
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
            track-color="grey-3"
            class="text-primary text-weight-bold"
          >
            {{ skill.progress.label }}
          </q-circular-progress>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else-if="!isLoading" class="text-center q-pa-xl text-grey-5">
      <q-icon name="auto_awesome" size="64px" class="q-mb-md" />
      <div class="text-h6">Пока нет активных задач</div>
      <p>Нажмите «Новый навык», чтобы выбрать цель</p>
    </div>

    <UnmasteredSkillsDialog
      v-model="unmasteredDialogVisible"
      :skills="skills.not_started"
      @select-skill="(skill, status, updated_at) => handleStatusChange(status, skill.id, updated_at)"
      @update-status="handleStatusChange"
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
import { ref, onActivated } from 'vue'
import { useQuasar } from 'quasar'
import { useSkills } from 'src/composables/useSkills'

// Импорт компонентов
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

const refreshActive = async () => {
  isLoading.value = true
  try {
    await loadSkills(childId, 'in_progress')
  } finally {
    isLoading.value = false
  }
}

const openUnmasteredList = async () => {
  try {
    await loadSkills(childId, 'not_started')
    unmasteredDialogVisible.value = true
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Ошибка загрузки списка' })
  }
}

const openDetails = (skill) => {
  selectedSkill.value = skill
  detailsDialogVisible.value = true
}
const handleStatusChange = async (newStatus, explicitSkillId = null, updated_at = null) => {
  const targetSkillId = explicitSkillId || selectedSkill.value?.id
  if (!targetSkillId) {
    console.error("Skill ID not found")
    return
  }
  const skillTitle = selectedSkill.value?.title || "Навык"
  try {
    await updateStatus(childId, targetSkillId, newStatus, updated_at)
    if (unmasteredDialogVisible.value) {
      await loadSkills(childId, 'not_started')
    }
    await loadSkills(childId, 'in_progress')
    await loadSkills(childId, 'mastered')
    if (newStatus === 'mastered') {
      $q.dialog({
        component: SuccessDialog,
        componentProps: {
          type: 'skill',
          title: skillTitle
        }
      })
      detailsDialogVisible.value = false
    } else {
      $q.notify({
        color: 'positive',
        icon: 'work',
        message: 'Добавлено в работу'
      })
    }

  } catch (e) {
    $q.notify({
      color: 'negative',
      message: 'Не удалось обновить статус',
      icon: 'error'
    })
  }
}

const handleCheck = async (stage) => {
  try {
    await updateStage(childId, stage.id, true)

    await loadSkills(childId, 'in_progress')

    if (selectedSkill.value) {
      selectedSkill.value = skills.value.in_progress.find(s => s.id === selectedSkill.value.id)
    }

    const skillTitle = selectedSkill.value?.title || "этом навыке"

    $q.dialog({
      component: SuccessDialog,
      componentProps: {
        type: 'stage',
        title: skillTitle
      }
    })

  } catch (e) {
    console.error(e)
    $q.notify({
      color: 'negative',
      message: 'Ошибка сохранения прогресса',
      icon: 'error_outline'
    })
  }
}


const getFirstUnfinishedIndex = (skill) => {
  return skill.stages.findIndex(s => !s.is_completed)
}

const isAllStagesCompleted = (skill) => {
  return skill.stages.length > 0 && skill.stages.every(s => s.is_completed)
}

onActivated(refreshActive)
</script>

