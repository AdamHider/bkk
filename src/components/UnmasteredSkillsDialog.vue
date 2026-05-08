<template>
  <q-dialog v-model="isOpen" transition-show="slide-up" transition-hide="slide-down" maximized>
    <q-card >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-grey-9">
          Доступные навыки
          <q-chip round color="primary" text-color="white" size="sm">{{ filteredSkills.length }}</q-chip>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="column q-px-none" style="height: calc(100% - 50px)">
        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Поиск навыка..."
          class="q-mx-md"
          style="flex: 0"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-scroll-area style="flex: 1">
          <q-list  class="q-pa-md">
            <q-expansion-item
              v-for="skill in filteredSkills"
              :key="skill.id"
              group="skills"
              header-class="q-py-md"
              class="bg-white rounded-borders q-push q-mb-md"
            >
              <template v-slot:header>

                <q-item-section avatar>
                  <q-avatar :color="`${skill.category.color}-1`" :text-color="`${skill.category.color}-7`"  :icon="skill.category.icon">
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
              </template>

              <q-card>
                <q-card-section class="text-caption text-grey-8 q-pt-none q-pb-sm">
                  {{ skill.description }}
                </q-card-section>

                <q-card-actions class="flex justify-center q-px-md q-pb-md">
                  <q-btn
                    unelevated
                    label="Учить"
                    color="primary"
                    icon="sym_o_exercise"
                    @click="handleAction(skill, 'in_progress')"
                  />
                  <q-btn
                    unelevated
                    label="Умеем"
                    color="red-1"
                    text-color="primary"
                    icon="done_all"
                    @click="handleAction(skill, 'mastered')"
                  />
                </q-card-actions>
              </q-card>
            </q-expansion-item>

            <q-item v-if="!filteredSkills.length" class="text-center q-pa-lg text-grey-6">
              <q-item-section>Ничего не найдено</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const props = defineProps(['modelValue', 'skills'])
const emit = defineEmits(['update:modelValue', 'select-skill', 'update-status'])

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

const handleAction = (skill, status) => {
  emit('select-skill', skill, status)
}
onBeforeRouteLeave((to, from) => {
  if (isOpen.value) {
    isOpen.value = false
    return false
  }
  return true
})
</script>
