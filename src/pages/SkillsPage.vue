<template>
  <q-page class="bg-grey-1 q-pa-md">
    <div class="row items-center justify-between no-wrap q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold">Активные</div>
        <div class="text-caption text-grey-7">Навыки, которые мы изучаем. Чтобы добавить навык, нажмите на "+"</div>
      </div>
      <q-btn 
        unelevated 
        round 
        outline
        class="q-mx-sm"
        color="primary" 
        icon="add" 
        @click="openUnmasteredList" 
      />
    </div>

    <q-inner-loading :showing="isLoading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <q-list v-if="skills.in_progress.length" bordered separator class="bg-white rounded-borders shadow-1">
      <q-item 
        v-for="skill in skills.in_progress" 
        :key="skill.id" 
        clickable 
        v-ripple 
        @click="openDetails(skill)"
      >
        <q-item-section>
          <q-item-label class="text-weight-bold">{{ skill.title }}</q-item-label>
          <q-item-label caption class="text-primary text-uppercase text-caption">
            {{ skill.domain }} • Уровень {{ skill.level }}
          </q-item-label>
        </q-item-section>
        
        <q-item-section side>
          <div class="row items-center">
            <q-badge 
              :label="getProgressLabel(skill)" 
              color="blue-1" 
              text-color="primary" 
              class="q-mr-sm"
            />
            <q-icon name="chevron_right" color="grey-4" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Заглушка, если пусто -->
    <div v-else-if="!isLoading" class="text-center q-pa-xl text-grey-5">
      <q-icon name="auto_awesome" size="64px" class="q-mb-md" />
      <div class="text-h6">Пока нет активных задач</div>
      <p>Нажмите «Новый навык», чтобы выбрать цель</p>
    </div>

    <!-- 1. Диалог списка всех неизученных навыков -->
    <UnmasteredSkillsDialog
      v-model="unmasteredDialogVisible"
      :skills="skills.not_started"
      @select-skill="openDetails"
      @update-status="handleStatusChange"
    />

    <!-- 2. Универсальный диалог деталей навыка (карточка) -->
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
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useSkills } from 'src/composables/useSkills'

// Импорт компонентов
import SkillDetailsDialog from 'src/components/SkillDetailsDialog.vue'
import UnmasteredSkillsDialog from 'src/components/UnmasteredSkillsDialog.vue'

const $q = useQuasar()
const { skills, loadSkills, updateStatus, updateStage } = useSkills()

// Состояние UI
const childId = 1
const isLoading = ref(false)
const detailsDialogVisible = ref(false)
const unmasteredDialogVisible = ref(false)
const selectedSkill = ref(null)

/**
 * Инициализация данных
 */
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

const handleStatusChange = async (newStatus) => {
  try {
    await updateStatus(childId, selectedSkill.value.id, newStatus)
    
    // Закрываем окна
    detailsDialogVisible.value = false
    if (newStatus === 'in_progress') unmasteredDialogVisible.value = false
    
    // Полное обновление данных с сервера
    await refreshActive()
    
    $q.notify({ 
      color: 'positive', 
      icon: 'done', 
      message: newStatus === 'mastered' ? 'Навык освоен!' : 'Добавлено в работу' 
    })
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Не удалось обновить статус' })
  }
}

const handleCheck = async (stage) => {
  try {
    await updateStage(childId, stage.id, true)
    
    // Тихое обновление данных
    await loadSkills(childId, 'in_progress')
    
    // Обновляем ссылку на выбранный навык, чтобы диалог перерисовал чекбоксы
    if (selectedSkill.value) {
      selectedSkill.value = skills.value.in_progress.find(s => s.id === selectedSkill.value.id)
    }
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Ошибка сохранения прогресса' })
  }
}

/**
 * Вспомогательные функции для UI
 */
const getProgressLabel = (skill) => {
  const done = skill.stages.filter(s => s.is_completed).length
  return `${done}/${skill.stages.length}`
}

const getFirstUnfinishedIndex = (skill) => {
  return skill.stages.findIndex(s => !s.is_completed)
}

const isAllStagesCompleted = (skill) => {
  return skill.stages.length > 0 && skill.stages.every(s => s.is_completed)
}

onMounted(refreshActive)
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
  overflow: hidden;
}
</style>