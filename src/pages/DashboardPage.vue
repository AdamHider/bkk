<template>
  <q-page class="bg-white">

    <div v-if="child">
      <div class="bg-main-primary relative-position overflow-hidden">
          <BubbleBackground/>
        <div class="row items-center text-center justify-center q-px-md">
            <div class="col-3 q-pt-md">
              <div class="q-pa-sm">
                <q-avatar color="white" text-color="primary" size="50px">
                  <b>{{ child.statistics.main.to_learn ?? 0 }}</b>
                </q-avatar>
                <div class="line-h-1 text-white text-caption q-mt-sm"><b>Учим</b></div>
              </div>
            </div>
            <div class="col-6">
              <q-card flat class="bg-transparent text-center" style="padding-top: 50px;">
                <q-card-section class="q-py-none  q-mt-sm">
                  <q-avatar size="120px" class="q-push cursor-pointer" @click="triggerFileInput">
                    <img :src="child.avatar" style="object-fit: cover">
                    <q-inner-loading :showing="uploading" class="rounded-full">
                      <q-spinner-dots color="primary" size="20px" />
                    </q-inner-loading>
                    <q-badge floating rounded color="white" text-color="primary" class="q-pa-xs shadow-2" style="top: auto; bottom: 0; right: 0;">
                      <q-icon name="add_a_photo" size="16px" />
                    </q-badge>
                  </q-avatar>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onFileSelected"
                  >
                </q-card-section>

                <q-card-section class="q-pt-sm text-white">
                  <div class="text-h5 text-weight-bold">{{ child.name }}</div>
                  <div class="text-subtitle2 text-weight-bold">{{ child.age.display }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3 q-pt-md">
              <div class="q-pa-sm">
                <q-avatar color="white" text-color="primary" size="50px">
                  <b>{{ child.statistics.main.total_mastered ?? 0 }}</b>
                </q-avatar>
                <div class="line-h-1 text-white text-caption q-mt-sm"><b>Умеем</b></div>
              </div>
            </div>
          </div>
          <div class="semisphere" style="margin-top: -60px;"></div>
      </div>

      <div>
          <div class="q-pa-md q-gutter-y-sm">

            <div class="row q-mt-md">
              <div class="col">
                <div class="column items-center q-pa-sm bg-white rounded-borders">
                  <div class="row no-wrap items-center">
                    <div class="text-h5 text-weight-bolder text-primary">
                      +{{ child.statistics.comparison.skills.current }}
                    </div>
                    <q-icon
                      :name="child.statistics.comparison.skills.trend === 'up' ? 'trending_up' : 'trending_down'"
                      :color="child.statistics.comparison.skills.trend === 'up' ? 'positive' : 'negative'"
                      size="24px"
                      class="q-ml-xs"
                    />
                  </div>
                  <div class="text-caption text-weight-bold ">Навыки ({{ child.statistics.comparison.months.current }})</div>
                  <div class="text-bold text-blue-grey-3" style="font-size: 10px">
                    было +{{ child.statistics.comparison.skills.last }} ({{ child.statistics.comparison.months.last }})
                  </div>
                </div>
              </div>
              <q-separator inset  vertical/>
              <div class="col">
                <div class="column items-center q-pa-sm bg-white rounded-borders">
                  <div class="row no-wrap items-center">
                    <div class="text-h5 text-weight-bolder text-secondary">
                      +{{ child.statistics.comparison.stages.current }}
                    </div>
                    <q-icon
                      :name="child.statistics.comparison.stages.trend === 'up' ? 'trending_up' : 'trending_down'"
                      :color="child.statistics.comparison.stages.trend === 'up' ? 'positive' : 'negative'"
                      size="24px"
                      class="q-ml-xs"
                    />
                  </div>
                  <div class="text-caption text-weight-bold ">Этапы ({{ child.statistics.comparison.months.current }})</div>
                  <div class="text-bold text-blue-grey-3" style="font-size: 10px">
                    было +{{ child.statistics.comparison.stages.last }} ({{ child.statistics.comparison.months.last }})
                  </div>
                </div>
              </div>
            </div>

            <q-card flat  class="rounded-16 q-mb-md rounded-borders">
              <q-card-section class="q-pb-none q-px-sm flex justify-between items-center q-pt-sm text-center">
                <div><q-icon name="sym_o_query_stats" color="grey-7" class="q-mr-xs" size="20px"/><b>Динамика</b></div>
                <div>
                  <q-btn-toggle
                    v-model="statsPeriod"
                    color="grey-2"
                    text-color="primary"
                    toggle-color="primary"
                    toggle-text-color="white"
                     unelevated
                    size="sm"
                    :options="[
                      {label: 'Недели', value: 'week'},
                      {label: 'Месяцы', value: 'month'}
                    ]"
                  />

                </div>
              </q-card-section>
              <q-card-section class="q-pa-none">
                <WeeklyProgressChart
                  :skills-data="child.statistics.weekly.skills"
                  :stages-data="child.statistics.weekly.stages"
                  height="130"
                />
              </q-card-section>
            </q-card>

            <div>
              <PreferenceList :stimulus="child.preferences.stimulus" :triggers="child.preferences.triggers" :child-id="child.id" @update="handleLoad"/>
            </div>
            <DomainAnalysis v-if="child.statistics.domains.top.length > 0 "
              :top="child.statistics.domains.top"
              :weak="child.statistics.domains.weak"
            />

          </div>
      </div>

        <!-- Топ 5 навыков в работе -->
        <div class="q-px-md" v-if="child.skills.active.length > 0">
          <div class="row justify-between items-center q-mb-sm">
            <div class="text-subtitle1 text-weight-bold text-grey-9">Мы учим</div>
            <q-btn flat no-caps color="primary" label="Показать все" to="/skills" icon-right="chevron_right" dense/>
          </div>
          <SkillSlider :skills="child.skills.active"/>
        </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onActivated } from 'vue'
import SkillSlider from 'components/SkillSlider.vue'
import BubbleBackground from 'src/components/BubbleBackground.vue';
import WeeklyProgressChart from '../components/WeeklyProgressChart.vue'
import DomainAnalysis from '../components/DomainAnalysis.vue'
import PreferenceList from '../components/PreferenceList.vue'
import { useChild } from 'src/composables/useChild'

const childId = 1
const statsPeriod = ref('week')
const fileInput = ref(null)

const loading = ref(true)

const { child, uploading, loadChild, updateAvatar } = useChild()

const handleLoad = async () => {
  loading.value = true
  try {
    await loadChild(childId, statsPeriod.value)
  } finally {
    loading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}
const onFileSelected = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await updateAvatar(childId, file)
  }
  event.target.value = ''
}

watch(statsPeriod, handleLoad)

onActivated(handleLoad)
</script>
