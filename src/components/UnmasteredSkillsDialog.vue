<template>
  <q-dialog v-model="isOpen" transition-show="slide-up" transition-hide="slide-down" maximized>
    <q-card >
      <q-card-section class="row items-center q-pb-sm">
        <div class="text-h6 text-weight-bold">
          Доступные навыки
          <q-chip round color="primary" text-color="white" size="sm">{{ filteredSkills.length }}</q-chip>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="column q-pa-none" style="height: calc(100% - 57px)">
        <q-input
          v-model="search"
          dense
          outlined
          rounded
          placeholder="Поиск навыка..."
          class="q-mx-md"
          style="flex: 0"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-scroll-area style="flex: 1" class="q-pt-md">
          <q-list class="q-pa-md">

            <div v-for="(skillsInGroup, categoryTitle) in groupedSkills" :key="categoryTitle">

              <div class="q-mt-md q-mb-sm q-px-sm row items-center">
                <div class="text-overline text-grey-9 text-weight-bold line-h-1" style="letter-spacing: 1px;">
                  {{ categoryTitle }}
                </div>
                <q-separator class="col q-ml-md" color="grey-3" />
              </div>

              <q-expansion-item
                v-for="skill in skillsInGroup"
                :key="skill.id"
                group="skills"
                header-class="q-py-md"
                class="bg-white rounded-borders q-push q-mb-md shadow-1"
              >
                <template v-slot:header>
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
                </template>

                <q-card class="rounded-md">
                  <q-card-section class="text-caption text-grey-8 q-pt-none q-pb-sm">
                    {{ skill.description }}
                  </q-card-section>
                  <q-separator/>
                  <q-card-actions class="flex justify-around q-px-md q-pb-md q-pt-md rounded-md">
                    <q-btn
                      label="Умеем"
                      color="white"
                      text-color="primary"
                      class="q-push rounded-sm"
                      icon="done_all"
                      @click="handleAction(skill, 'mastered')"
                    />
                    <q-btn
                      label="Учить"
                      text-color="white"
                      class="bg-gradient-primary q-push rounded-sm q-ml-lg"
                      icon="sym_o_exercise"
                      @click="handleAction(skill, 'in_progress')"
                    />
                  </q-card-actions>
                </q-card>
              </q-expansion-item>
            </div>

            <q-item v-if="!filteredSkills.length" class="text-center q-pa-lg text-grey-6">
              <q-item-section>Ничего не найдено</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showDateDialog" centered transition-show="scale" transition-hide="scale">
  <q-card style="min-width: 300px" class="rounded-borders">
    <q-card-section class="bg-primary text-white q-py-sm">
      <div class="text-subtitle1">Когда научились?</div>
    </q-card-section>

    <q-card-section class="q-pa-none flex justify-center">
      <q-date
        v-model="selectedDate"
        minimal
        flat
        class="full-width"
      />
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <q-btn flat label="Отмена" color="grey" v-close-popup />
      <q-btn
        label="Подтвердить"
        color="primary"
        class="q-px-md rounded-sm q-push"
        @click="confirmMastered"
      />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { date } from 'quasar'

const props = defineProps(['modelValue', 'skills'])
const emit = defineEmits(['update:modelValue', 'select-skill', 'update-status'])
const showDateDialog = ref(false)
const selectedDate = ref(date.formatDate(Date.now(), 'YYYY/MM/DD'))
const tempSkill = ref(null)
const search = ref('')

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const filteredSkills = computed(() => {
  if (!props.skills) return []
  if (!search.value) return props.skills
  const s = search.value.toLowerCase()
  return props.skills.filter(item =>
    item.title.toLowerCase().includes(s) ||
    item.domain.toLowerCase().includes(s)
  )
})

const groupedSkills = computed(() => {
  const groups = {}
  filteredSkills.value.forEach(skill => {
    const domain = skill.category.title
    if (!groups[domain]) {
      groups[domain] = []
    }
    groups[domain].push(skill)
  })
  return groups
})

const handleAction = (skill, status) => {
  if (status === 'mastered') {
    tempSkill.value = skill
    showDateDialog.value = true
  } else {
    emit('select-skill', skill, status, date.formatDate(Date.now(), 'YYYY-MM-DD'))
  }
}

const confirmMastered = () => {
  if (tempSkill.value) {
    const formattedDate = selectedDate.value.replace(/\//g, '-')
    emit('select-skill', tempSkill.value, 'mastered', formattedDate)
    showDateDialog.value = false
    tempSkill.value = null
  }
}
onBeforeRouteLeave((to, from) => {
  if (isOpen.value) {
    isOpen.value = false
    return false
  }
  return true
})
</script>
