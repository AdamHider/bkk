<!-- src/components/skills/UnmasteredSkillsDialog.vue -->
<template>
    <q-dialog v-model="isOpen" transition-show="slide-up" transition-hide="slide-down" maximized>
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-grey-9">Доступные навыки</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
  
        <q-card-section class="q-pa-md">
          <q-input 
            v-model="search" 
            dense 
            outlined 
            placeholder="Поиск навыка..." 
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
  
          <q-scroll-area style="height: 400px;">
            <q-list separator>
              <q-expansion-item 
                v-for="skill in filteredSkills" 
                :key="skill.id" 
                clickable 
              >
              <template v-slot:header>
                    <q-item-section>
                        <q-item-label class="text-weight-medium">{{ skill.title }}</q-item-label>
                        <q-item-label caption>{{ skill.domain }} • <q-chip outline size="sm" color="grey-7" :label="`Уровень ${skill.level}`" /></q-item-label>
                    </q-item-section>
    
                </template>
                <q-card>
                    <q-card-section class="q-pt-none">
                        {{ skill.description }}
                    </q-card-section>
                    <q-card-actions>
                        <q-btn 
                            label="Начать обучение" 
                            color="primary" 
                            rounded 
                            icon="fitness_center"
                            unelevated 
                            class="full-width q-mx-md"
                            @click="$emit('update-status', 'in_progress')" 
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
  
  const props = defineProps(['modelValue', 'skills'])
  const emit = defineEmits(['update:modelValue', 'select-skill'])
  
  const search = ref('')
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })
  
  const filteredSkills = computed(() => {
    if (!search.value) return props.skills
    const s = search.value.toLowerCase()
    return props.skills.filter(item => 
      item.title.toLowerCase().includes(s) || 
      item.domain.toLowerCase().includes(s)
    )
  })
  </script>