<template>
  <div class="skill-slider-container q-mt-md">

    <!-- Swiper Контейнер -->
    <swiper
      :slides-per-view="'auto'"
      :space-between="12"
      class="skill-swiper q-px-md"
    >
      <swiper-slide
        v-for="skill in skills"
        :key="skill.id"
        style="width: 150px;"
      >
        <q-card
          class="skill-card bg-white shadow-1 text-center q-pa-sm cursor-pointer"
          v-ripple
        >
          <q-card-section class="q-pa-none flex flex-center">
            <!-- Радиальный прогресс вокруг аватара -->
            <q-circular-progress
              show-value
              :value="skill.progress.percent"
              size="86px"
              :thickness="0.12"
              :color="`${skill.category.color}-5`"
              track-color="grey-2"
              class="q-my-sm"
            >
              <q-avatar size="68px" :color="`${skill.category.color}-1`" :text-color="`${skill.category.color}-7`" :icon="skill.category.icon">
                <q-badge
                  floating rounded
                  class="level-badge"
                  :color="['green-4', 'orange-4', 'red-4', 'purple-4'][skill.level - 1]"
                  :label="['I', 'II', 'III', 'IV'][skill.level - 1]"
                />
              </q-avatar>
            </q-circular-progress>
          </q-card-section>

          <q-card-section class="q-pa-xs">
            <div class="skill-title text-weight-bold text-grey-9 ellipsis-2-lines">
              {{ skill.title }}
            </div>
            <div class="text-caption text-grey-6 ellipsis-2-lines">
              {{ skill.category.title }}
            </div>
          </q-card-section>
        </q-card>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const props = defineProps({
  skills: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: 'Навыки'
  },
  link: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: 'Показать все'
  }
})
</script>

<style scoped>
.skill-swiper {
  overflow: visible !important; /* Чтобы тени не обрезались */
}

.skill-card {
  border-radius: 20px;
  transition: transform 0.2s ease;
}

.skill-card:active {
  transform: scale(0.95);
}

.level-badge {
  top: unset !important;
  bottom: -2px !important;
  right: -2px !important;
  font-family: 'Times New Roman', serif;
  padding: 2px 6px;
  font-size: 10px;
}


.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
