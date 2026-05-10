<template>
    <q-dialog v-model="isOpen" transition-show="slide-up" transition-hide="slide-down" maximized="">
      <div class="column">
      <q-card v-if="skill" style="width: 100%; padding-bottom: 25px;" :class="`bg-${skill.category.color}-4  overflow-hidden rounded-none`">
        <q-card-section class="q-pb-sm">
          <q-item :class="`q-px-sm bg-${skill.category.color}-8 text-white rounded-borders `">
            <q-item-section avatar>
              <q-avatar :color="`${skill.category.color}-6`" :text-color="`${skill.category.color}-1`" :icon="skill.category.icon">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label><b>{{ skill.category.title }}</b></q-item-label>
              <q-item-label caption class="text-white">Уровень {{ skill.level }} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn dense flat icon="close" v-close-popup text-color="white" class="" />
            </q-item-section>
          </q-item>
          <q-card class="q-ma-sm rounded-borders shadow-sm" style="position: relative; z-index: 1;">
            <q-card-section>
              <div :class="`text-subtitle1 line-h-1 text-${skill.category.color}`"><b>{{ skill.title }}</b></div>
              <div class="q-my-sm text-caption">{{ skill.description }}</div>
              <div class="row justify-between items-end q-mt-md">
                <div class="text-caption text-weight-bold">Прогресс освоения</div>
                <div class="text-caption text-weight-bold">{{ skill.progress.label }}</div>
              </div>
              <div class="row no-wrap items-center q-mt-md">
                <template v-for="(stage, index) in skill.stages" :key="stage.id">
                  <div
                    v-if="index > 0"
                    class="step-connector"
                    :class="{ 'done': index <= activeStepIndex }"
                    :style="`--main-color: ${skill.category.colorhex}`"
                  ></div>

                  <div
                    class="step-bubble column items-center justify-center cursor-pointer relative-position "
                    :style="`--main-color: ${skill.category.colorhex}`"
                    :class="{
                      'active': currentStepIndex === index,
                      'completed': stage.is_completed,
                      'locked': index > activeStepIndex
                    }"
                    @click="currentStepIndex = index" v-ripple>
                    <q-icon v-if="stage.is_completed" name="check" size="18px" />
                    <q-icon v-else-if="index > activeStepIndex" name="lock" size="16px" />
                    <span v-else class="text-weight-bold">{{ index + 1 }}</span>
                  </div>
                </template>
              </div>
            </q-card-section>
          </q-card>
      </q-card-section>
    </q-card>
    <q-card class="rounded-b-none rounded-t-lg" style="flex: 1; margin-top: -75px;  padding-top: 35px;">
      <q-card-section class="col q-pa-none">
        <q-tab-panels v-model="currentStepIndex" animated swipeable class="bg-transparent full-height">
          <q-tab-panel v-for="(stage, index) in skill.stages" :name="index" :key="stage.id" class="q-pa-md">
            <q-card flat class="stage-content-card ">

              <q-item class="q-py-none">
                <q-item-section avatar class="text-center">
                  <div>
                    <div :class="`text-h4 text-${skill.category.color}`" style="line-height: 1;"><b>{{ index+1 }}</b></div>
                    <div class="text-caption"><b>Этап</b></div>
                  </div>
                </q-item-section>
                <q-item-section  class="text-grey-9">
                  {{ stage.description }}
                </q-item-section>
              </q-item>
              <q-separator class="q-my-md"/>
              <div :class="`text-weight-bold text-subtitle1 q-mb-xs text-${skill.category.color} row items-center`">
                <q-icon name="lightbulb" color="warning" class="q-mr-xs" />
                Как научиться:
              </div>
              <div class="text-body2 text-grey-9">{{ stage.instruction }}</div>

                <q-separator class="q-my-md" />
              <!-- КНОПКА ДЕЙСТВИЯ -->
              <div>
                <q-btn
                  v-if="!stage.is_completed && index === activeStepIndex"
                  label="Получилось!"
                  text-color="white"
                  class="full-width bg-gradient-primary q-push rounded-sm"
                  @click="$emit('check-stage', stage)"
                />
                <q-btn
                  v-else-if="index > activeStepIndex"
                  label="Сначала предыдущий этап"
                  color="grey-4"
                  text-color="grey-7"
                  unelevated
                  class="full-width rounded-sm"
                  disable
                />
                <q-btn v-else 
                  disable
                  flat
                  class="full-width text-weight-bold"
                  text-color="green-7"

                  >
                   <q-icon name="done_all" /> Этот этап успешно пройден!
                </q-btn>
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
    </div>
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
  border-radius: 50%;
  background: white;
  color: var(--main-color);
  border: 2px solid var(--main-color);
  transition: all 0.3s ease;
  z-index: 2;
  flex: 1;
  aspect-ratio: 1 / 1;
}

.step-bubble.completed {
  color:white;
  background: var(--main-color);
}

.step-bubble.active {
  background: white !important;
  color: var(--main-color);
  transform: scale(1.25);
}
.step-bubble.active.completed {
  background: var(--main-color) !important;
  color:white !important;
}

.step-bubble.locked {
  background: #e5e5e5;
  color: #868686;
  border-color: #e5e5e5
}

.step-bubble.active.locked {
  background: rgba(0, 0, 0, 0.1);
}

.step-connector {
  height: 3px;
  flex: 0.75;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.step-connector.done {
  background: var(--main-color);
  height: 5px;
}
</style>
