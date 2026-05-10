<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin success-card text-center overflow-hidden">
        <q-card-section class="q-pa-lg">
        <div class="icon-container q-mb-md">
            <q-img :src="randomThumb" size="80px" />
        </div>
        
        <div class="text-h5 text-weight-bold q-mb-sm text-grey-9">Ура!</div>
        
        <div class="text-grey-8">
            <template v-if="type === 'skill'">
            Навык <span class="text-weight-bold text-primary">"{{ title }}"</span> полностью освоен!
            </template>
            <template v-else>
            Мы продвинулись в обучении навыку <span class="text-weight-bold text-primary">"{{ title }}"</span>.
            </template>
        </div>

        <div class="praise-section q-mt-lg q-pa-md">
            <div class="text-h6 text-primary text-weight-bold">"{{ randomPraise }}"</div>
        </div>
        </q-card-section>

        <div class="timeout-progress"></div>
    </q-card>
    </q-dialog>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const props = defineProps({
    type: {
    type: String,
    required: true,
    validator: (value) => ['skill', 'stage'].includes(value)
    },
    title: {
    type: String,
    required: true
    }
})

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const thumbs = [
    "/images/dino1.jpg",
    "/images/dino2.jpg",
    "/images/dino3.jpg",
    "/images/dino4.jpg"
]


const praises = [
    "Вы большие молодцы!",
    "Умнички!",
    "Просто невероятно!",
    "Отличная работа!",
    "Только вперед!",
    "Гордимся вами!",
    "Маленькими шагами к большим успехам!",
    "Так держать!",
    "Вы — супер-команда!"
]

const randomPraise = computed(() => {
    const index = Math.floor(Math.random() * praises.length)
    return praises[index]
})

const randomThumb = computed(() => {
    const index = Math.floor(Math.random() * thumbs.length)
    return thumbs[index]
})

onMounted(() => {
    setTimeout(() => {
        onDialogOK() 
    }, 2800)
})
</script>

<style lang="scss" scoped>
.success-card {
    border-radius: 24px;
    max-width: 380px;
    width: 90%;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.praise-section {
    background: rgba(var(--q-primary), 0.08);
    border-radius: 16px;
    border: 1px dashed rgba(var(--q-primary), 0.3);
}

.icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

// Полоска прогресса внизу
.timeout-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 6px;
    background: var(--q-primary);
    width: 100%;
    animation: shrink-progress 2.8s linear forwards;
    transform-origin: left;
}

@keyframes shrink-progress {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
}

.animate-pulse {
    animation: pulse-soft 2s infinite;
}

@keyframes pulse-soft {
    0%, 100% { 
        transform: scale(1);
    }
    50% { 
        transform: scale(1.1);
    }
}
</style>