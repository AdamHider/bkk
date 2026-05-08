<template>
    <q-dialog v-model="isOpen" transition-show="slide-up" transition-hide="slide-down" maximized="">
      <q-card v-if="skill" style="width: 100%; max-width: 550px; border-radius: 16px;" class="column full-height no-wrap">
        <!-- Шапка с Категорией и Уровнем -->
        <q-card-section :class="`bg-gradient-${skill.category.color} text-white q-pa-md overflow-hidden`">
          <q-item class="q-px-none">
            <q-item-section avatar>
              <q-avatar :color="`${skill.category.color}-4`" :text-color="`${skill.category.color}-1`" :icon="skill.category.icon">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label><b>{{ skill.category.title }}</b></q-item-label>
              <q-item-label caption class="text-white">Уровень {{ skill.level }} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn dense flat icon="close" v-close-popup text-color="white" class="absolute-top-right q-ma-xs" />
            </q-item-section>
          </q-item>
          <div class="text-h6 line-height-1 q-mt-sm"><b>{{ skill.title }}</b></div>
          <div class="q-my-sm">{{ skill.description }}</div>
          <div class="q-mt-md">
            <div class="row justify-between items-end q-mb-xs">
              <div class="text-caption text-weight-bold">Прогресс освоения</div>
              <div class="text-caption text-weight-bold">{{ skill.progress.label }}</div>
            </div>
            <q-linear-progress
              :value="skill.progress.percentage/100"
              :color="`${skill.category.color}-2`"
              track-color="white-3"
              class="rounded-borders"
              size="12px"
              stripe
              rounded
            />
          </div>
          <div class="row no-wrap items-center q-pt-lg">
            <template v-for="(stage, index) in skill.stages" :key="stage.id">
              <div
                v-if="index > 0"
                class="step-connector"
                :class="{ 'done': index <= activeStepIndex }"
              ></div>

              <div
                class="step-bubble column items-center justify-center cursor-pointer relative-position"
                :class="{
                  'active': currentStepIndex === index,
                  'completed': stage.is_completed,
                  'locked': index > activeStepIndex
                }" @click="currentStepIndex = index" v-ripple>
                <q-icon v-if="stage.is_completed" name="check" size="18px" />
                <q-icon v-else-if="index > activeStepIndex" name="lock" size="16px" />
                <span v-else class="text-weight-bold">{{ index + 1 }}</span>
              </div>
            </template>
          </div>
          <div class="semisphere"></div>
      </q-card-section>

      <q-card-section class="col q-pa-none">
        <q-tab-panels v-model="currentStepIndex" animated swipeable class="bg-transparent full-height">
          <q-tab-panel v-for="(stage, index) in skill.stages" :name="index" :key="stage.id" class="q-pa-md">
            <q-card flat class="stage-content-card ">

              <div :class="`text-weight-bold q-mb-xs  row items-center text-subtitle1 ${(stage.is_completed) ? 'text-positive': 'text-grey-9'}`" >
                <q-icon v-if="stage.is_completed" color="positive" name="check_circle" class="q-mr-sm" />
                Этап {{ index+1 }}
              </div>
              <div class="text-grey-8 q-mb-lg">
                {{ stage.description }}
              </div>

              <div :class="`bg-${skill.category.color}-1 q-pa-md rounded-borders q-mb-xl border-dashed`">
                <div class="text-weight-bold q-mb-xs text-grey-9 row items-center">
                  <q-icon name="lightbulb" color="warning" class="q-mr-xs" />
                  Как научиться:
                </div>
                <div class="text-body2 text-grey-9">{{ stage.instruction }}</div>
              </div>

              <!-- КНОПКА ДЕЙСТВИЯ -->
              <div>
                <q-btn
                  v-if="!stage.is_completed && index === activeStepIndex"
                  label="Я научился!"
                  color="primary"
                  rounded
                  unelevated
                  class="full-width"
                  @click="$emit('check-stage', stage)"
                />
                <q-btn
                  v-else-if="index > activeStepIndex"
                  label="Сначала пройди прошлый этап"
                  color="grey-4"
                  text-color="grey-7"
                  rounded
                  unelevated
                  class="full-width"
                  disable
                />
                <div v-else class="text-center text-positive text-weight-bold">
                   <q-icon name="done_all" /> Этот этап успешно пройден!
                </div>
              </div>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-lg q-pt-none">
          <q-btn
            v-if="status === 'not_started'"
            label="Начать обучение"
            color="primary"
            rounded
            icon="sym_o_exercise"
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
  import { onBeforeRouteLeave } from 'vue-router'

  const props = defineProps(['modelValue', 'skill', 'status', 'isAllDone', 'currentIndex'])
  const emit = defineEmits(['update:modelValue', 'update-status', 'check-stage'])

  const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // Индекс таба, который сейчас открыт на экране
  const currentStepIndex = ref(0)

  // Индекс первого незавершенного этапа (тот, который нужно учить сейчас)
  const activeStepIndex = computed(() => {
    const index = props.skill.stages.findIndex(s => !s.is_completed)
    return index === -1 ? props.skill.stages.length - 1 : index
  })

  // Следим за открытием диалога, чтобы выставить степпер на первый незавершенный этап
  watch(() => props.modelValue, (newVal) => {
    if (newVal && props.currentIndex !== -1) {
      currentStepIndex.value = props.currentIndex
    }
  })

  // Если currentIndex меняется (например, после нажатия "Выучили"),
  // перекидываем пользователя на следующий шаг автоматически
  watch(() => props.currentIndex, (newIdx) => {
    if (newIdx !== -1) currentStepIndex.value = newIdx
  })


  onBeforeRouteLeave((to, from) => {
    if (isOpen.value) {
      isOpen.value = false
      return false
    }
    return true
  })
  </script>

<style scoped>
.step-bubble {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255);
  transition: all 0.3s ease;
  z-index: 2;
}

.step-bubble.completed {
  color: var(--q-primary);
  background: white;
  border-color: #ffffff;
}

.step-bubble.active {
  background: white !important;
  color: var(--q-primary);
  transform: scale(1.15);
}
.step-bubble.active.completed {
}

.step-bubble.locked {
  background: rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.step-bubble.active.locked {
  background: rgba(0, 0, 0, 0.1);
  color: #868686;
  border-color: transparent;
}

.step-connector {
  height: 3px;
  width: 30px;
  min-width: 30px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.step-connector.done {
  background: rgba(255, 255, 255, 1);
  height: 5px;
}
</style>
