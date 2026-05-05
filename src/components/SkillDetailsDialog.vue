<template>
    <q-dialog v-model="isOpen" transition-show="slide-up" transition-hide="slide-down" maximized="">
      <q-card v-if="skill" style="width: 100%; max-width: 550px; border-radius: 16px;">
        <!-- Шапка с Категорией и Уровнем -->
        <q-card-section class="bg-primary text-white q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-blue-2">{{ skill.domain }} <q-chip outline size="sm" color="white" :label="`Уровень ${skill.level}`" /></div>
              <div class="text-h6 line-height-1 q-mt-sm">{{ skill.title }}</div>
            </div>
            <q-btn dense flat icon="close" v-close-popup class="absolute-top-right q-ma-xs" />
          </div>
          <div class="text-blue-2  q-mb-sm">{{ skill.description }}</div>
        </q-card-section>
  
        <q-card-section class="q-pa-none">
            <div class="q-px-md q-pt-sm text-subtitle1"><b>Этапы:</b></div>
          <!-- Степпер этапов -->
          <q-stepper
            v-model="step"
            vertical
            color="primary"
            animated
            flat
            header-nav
            class="bg-transparent q-py-none"
          >
            <q-step
              v-for="(stage, index) in skill.stages"
              dense
              :key="stage.id"
              :name="index"
              :title="`Этап ${index + 1}`"
              :caption="stage.description"
              :icon="stage.is_completed ? 'check_circle' : 'panorama_fish_eye'"
              :done="stage.is_completed"
              :active-icon="stage.is_completed ? 'check_circle' : 'fitness_center'"
            >
                <div class="bg-blue-1 q-pa-md rounded-borders text-blue-9 text-caption">
                    <div class=""><b>Как выучить?</b></div>
                    <div class="">{{ stage.instruction }}</div>
                </div>
                <q-btn
                    class="q-mt-sm"
                    v-if="!stage.is_completed && status === 'in_progress'"
                    @click="$emit('check-stage', stage)"
                    color="positive"
                    label="Умеем"
                    icon="done"
                    unelevated
                />
            </q-step>
          </q-stepper>
        </q-card-section>
  
        <!-- Финальное действие -->
        <q-card-actions align="center" class="q-pb-lg q-pt-none">
          <q-btn 
            v-if="status === 'not_started'" 
            label="Начать обучение" 
            color="primary" 
            rounded 
            icon="fitness_center"
            unelevated 
            class="full-width q-mx-md"
            @click="$emit('update-status', 'in_progress')" 
          />
          
          <q-btn 
            v-if="status === 'in_progress' && isAllDone" 
            label="Завершить навык" 
            color="positive" 
            rounded 
            unelevated 
            icon="stars" 
            class="full-width q-mx-md shadow-2"
            @click="$emit('update-status', 'mastered')" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  
  const props = defineProps(['modelValue', 'skill', 'status', 'isAllDone', 'currentIndex'])
  const emit = defineEmits(['update:modelValue', 'update-status', 'check-stage'])
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })
  
  // Текущий открытый шаг в степпере
  const step = ref(0)
  
  // Следим за открытием диалога, чтобы выставить степпер на первый незавершенный этап
  watch(() => props.modelValue, (newVal) => {
    if (newVal && props.currentIndex !== -1) {
      step.value = props.currentIndex
    }
  })
  
  // Если currentIndex меняется (например, после нажатия "Выучили"), 
  // перекидываем пользователя на следующий шаг автоматически
  watch(() => props.currentIndex, (newIdx) => {
    if (newIdx !== -1) step.value = newIdx
  })
  </script>
  
  <style scoped>
  .line-height-1 {
    line-height: 1.2;
  }
  .rounded-borders {
    border-radius: 8px;
  }
  </style>