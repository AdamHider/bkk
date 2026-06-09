<template>
    <q-page class="bg-white q-pa-md" style="padding-top: 50px;">
        <div class="row items-center justify-between no-wrap q-mb-md q-mt-sm">
            <div class="col">
                <div class="text-h6 text-weight-bold">
                    Календарь занятий
                </div>
                <div class="text-caption text-grey-7">Расписание всех занятий по дням</div>
            </div>
        </div>
        <div class="col-12 col-sm-8 col-md-6">

            <q-card flat bordered class="rounded-md">
                <q-date v-model="selectedDate" mask="YYYY-MM-DD" minimal full-width :locale="ruLocale" :events="getEvents" :event-color="getEventColor" />
            </q-card>

            <q-dialog v-model="isDialogOpen" @hide="resetSelectedDate">
                <q-card style="min-width: 320px; max-width: 450px; width: 100%" class="rounded-md">

                    <q-card-section class="row items-center justify-between bg-grey-1 q-py-sm">
                        <div>
                            <div class="text-subtitle1 text-weight-bold text-primary row items-center">
                                <q-icon name="event" class="q-mr-xs" />
                                {{ formatSelectedDate(selectedDate) }}
                            </div>
                            <div v-if="dayProgress.count > 0" class="text-caption text-grey-7 q-mt-xs">
                                Продуктивность:
                                <q-badge :color="dayProgress.color" text-color="white" class="text-weight-bold">
                                    {{ dayProgress.percent }}%
                                </q-badge>
                            </div>
                        </div>
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-card-section class="q-pa-md scroll" style="max-height: 60vh">

                        <q-timeline v-if="selectedTrainings.length" color="blue-grey-6" dense class="q-pl-sm">
                            <q-timeline-entry v-for="t in selectedTrainings" :key="t.id"
                                :subtitle="formatTime(t.created_at)"
                                :icon="t.status === 'active' ? 'hourglass_top' : 'check'"
                                :color="t.status === 'active' ? 'orange-8' : 'blue-grey-6'">
                                <div class="text-weight-bold text-body2 text-grey-9">
                                    {{ t.skill_title || 'Навык не указан' }}
                                </div>
                                <div class="text-caption text-grey-7">
                                    Этап {{ t.stage_index }}: {{ t.stage_description || 'Без названия' }}
                                </div>
                                <div class="q-mt-xs">
                                    <q-chip dense square color="grey-2" text-color="grey-9" size="sm" class="q-ma-none">
                                        <q-icon name="schedule" size="12px" class="q-mr-xs" />
                                        {{ t.status === 'active' ? 'Идет сейчас' : `${t.duration_minutes} мин` }}
                                    </q-chip>
                                </div>
                            </q-timeline-entry>
                        </q-timeline>

                        <div v-else class="text-center q-py-xl text-grey-6">
                            <q-icon name="history_toggle_off" size="48px" class="q-mb-sm text-grey-4" />
                            <div class="text-body2 text-weight-medium">В этот день занятий не было</div>
                            <div class="text-caption text-grey-5 q-mt-xs">Отдохнуть тоже бывает полезно!</div>
                        </div>

                    </q-card-section>

                </q-card>
            </q-dialog>

        </div>
    </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from 'src/boot/fetch'

const selectedDate = ref(null)
const allTrainings = ref([])
const totalActiveSkills = ref(5)
const isDialogOpen = ref(false)

const ruLocale = {
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    firstDayOfWeek: 1
}

watch(selectedDate, (newDate) => {
    if (newDate) {
        isDialogOpen.value = true
    }
})

const selectedTrainings = computed(() => {
    if (!selectedDate.value) return []
    return allTrainings.value.filter(t => t.created_at?.substring(0, 10) === selectedDate.value)
})

const dayProgress = computed(() => {
    if (!selectedDate.value) return { count: 0, percent: 0, color: 'grey' }
    return getDayProgress(selectedDate.value)
})

const getEvents = (date) => {
    const formattedDate = date.replace(/\//g, '-')
    return allTrainings.value.some(t => t.created_at?.substring(0, 10) === formattedDate)
}

const getEventColor = (date) => {
    const formattedDate = date.replace(/\//g, '-')
    return getDayProgress(formattedDate).color
}

const getDayProgress = (dateString) => {
    const dayTrainings = allTrainings.value.filter(t => t.created_at?.substring(0, 10) === dateString)
    if (!dayTrainings.length) return { count: 0, percent: 0, color: 'grey' }

    const uniqueSkillsInDay = new Set(dayTrainings.map(t => t.skill_id)).size
    const percent = Math.round((uniqueSkillsInDay / (totalActiveSkills.value || 1)) * 100)

    let color = 'red-7'
    if (percent > 30 && percent <= 60) color = 'amber-7'
    if (percent > 60) color = 'green-7'

    return { count: uniqueSkillsInDay, percent, color }
}

const resetSelectedDate = () => {
    selectedDate.value = null
}

const loadAllTrainings = async () => {
    try {
        const response = await api.post('/SkillTraining/getList', { child_id: 1 })
        allTrainings.value = Array.isArray(response) ? response : (response.data || [])
    } catch (error) {
        console.error(error)
    }
}

const formatSelectedDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatTime = (dateTimeStr) => dateTimeStr?.split(' ')[1]?.substring(0, 5) || ''

onMounted(() => loadAllTrainings())
</script>

<style scoped>
:deep(.q-date) {
    min-width: unset !important;
    max-width: 100% !important;
    width: 100% !important;
}
</style>