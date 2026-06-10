<template>
  <q-page class="bg-white q-pa-md" style="padding-top: 50px;">
    <div class="row items-center justify-between no-wrap q-mb-md q-mt-sm">
      <div class="col">
        <div class="text-h6 text-weight-bold">
          Умеем
          <q-chip round color="primary" text-color="white" size="sm">
            {{ skills.mastered.length }}
          </q-chip>
        </div>
        <div class="text-caption text-grey-7">Хронология освоения навыков</div>
      </div>
      <q-btn
        round
        class="q-push bg-gradient-primary shadow-2"
        text-color="white"
        icon="add"
        @click="openUnmasteredList"
      />
    </div>

    <div v-if="skills.mastered.length" class="q-px-sm">
      <q-timeline color="primary">
        <q-timeline-entry
          v-for="(group, dateKey) in timelineSkills"
          :key="dateKey"
          :title="group.monthName"
          :subtitle="group.year"
          icon="calendar_today"
        >
          <q-list class="q-gutter-y-sm" style="margin-left: -15px;">
            <q-item
              v-for="skill in group.items"
              :key="skill.id"
              clickable
              v-ripple
              @click="openDetails(skill)"
              class="bg-white q-push q-mb-md q-py-md rounded-borders shadow-sm"
            >
              <q-item-section avatar>
                <q-avatar size="40px" :color="`${skill.category.color}-1`" :text-color="`${skill.category.color}-7`" :icon="skill.category.icon">
                   <q-badge floating rounded style="bottom: -5px; top: unset;"
                    :color="['green-4', 'orange-4', 'red-4', 'purple-4'][skill.level - 1]"
                    :label="['I', 'II', 'III', 'IV'][skill.level - 1]"/>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-grey-9 text-weight-bold text-overline">
                   {{ formatDate(skill.updated_at) }}
                </q-item-label>
                <q-item-label class="text-weight-bold text-dark">{{ skill.title }}</q-item-label>
                <q-item-label caption>
                   {{ skill.category.title }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-timeline-entry>

      </q-timeline>
    </div>

    <div v-else-if="!isLoading" class="text-center q-pa-xl text-grey-5">
      <q-icon name="auto_awesome" size="64px" class="q-mb-md" />
      <div class="text-h6">Таймлайн пока пуст</div>
      <p>Освоенные навыки появятся здесь в виде ленты событий</p>
    </div>

    <UnmasteredSkillsDialog
      v-model="unmasteredDialogVisible"
      :skills="skills.not_started"
      @select-skill="handleStatusChange"
    />

    <SkillDialog
      v-model="detailsDialogVisible"
      :skill="selectedSkill"
      @update-status="handleStatusChange"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onActivated } from 'vue'
import { useQuasar, date } from 'quasar'
import { useSkills } from 'src/composables/useSkills'

import SkillDialog from 'src/components/SkillDialog.vue'
import UnmasteredSkillsDialog from 'src/components/UnmasteredSkillsDialog.vue'

const $q = useQuasar()
const { skills, loadSkills, updateStatus } = useSkills()

const childId = 1
const isLoading = ref(false)
const detailsDialogVisible = ref(false)
const unmasteredDialogVisible = ref(false)
const selectedSkill = ref(null)
const russianLocale = {
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
}

const timelineSkills = computed(() => {
  const groups = {}

  if (!skills.value.mastered) return groups

  const sorted = [...skills.value.mastered].sort((a, b) =>
    new Date(b.updated_at) - new Date(a.updated_at)
  )

  sorted.forEach(skill => {
    const d = new Date(skill.updated_at)
    const year = d.getFullYear()
    const month = d.getMonth()
    const key = `${year}-${month}`

    if (!groups[key]) {
      groups[key] = {
        monthName: date.formatDate(d, 'MMMM', russianLocale),
        year: year.toString(),
        items: []
      }
    }
    groups[key].items.push(skill)
  })

  return groups
})

const formatDate = (d) => {
  return date.formatDate(d, 'D MMMM', russianLocale)
}
const refreshMastered = async () => {
  isLoading.value = true
  try { await loadSkills(childId, 'mastered') }
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

const handleStatusChange = async (skill, status, dateValue) => {
  try {
    await updateStatus(childId, skill.id, status, dateValue)
    await loadSkills(childId, 'mastered')
    unmasteredDialogVisible.value = false
    detailsDialogVisible.value = false
  } catch (e) {
    $q.notify({ color: 'negative', message: 'Ошибка обновления' })
  }
}

onActivated(refreshMastered)
</script>

<style scoped>
.border-light {
  border: 1px solid #f0f0f0;
}
</style>
