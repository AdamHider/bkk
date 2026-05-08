<template>
  <div class="row q-col-gutter-md">
    <!-- Сильные стороны -->
    <div class="col-12 col-md-6">
      <q-list bordered padding class="bg-white rounded-16 shadow-1">
        <q-item-label header class="text-weight-bold text-uppercase text-caption letter-1">Сильные стороны</q-item-label>
        <q-item v-for="domain in top" :key="domain.key">
          <q-item-section avatar>
            <q-avatar :color="`${domain.color}-1`" :text-color="domain.color" :icon="domain.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ domain.title }}</q-item-label>
            <q-item-label caption>Завершено: {{ domain.mastered_count }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="auto_awesome" color="orange" size="xs" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Зоны роста -->
    <div class="col-12 col-md-6">
      <q-list bordered padding class="bg-white rounded-16 shadow-1">
        <q-item-label header class="text-weight-bold text-uppercase text-caption letter-1 text-grey-7">Зоны роста</q-item-label>
        <q-item v-for="domain in weak" :key="domain.key">
          <q-item-section avatar>
            <q-avatar color="grey-2" :text-color="domain.color" :icon="domain.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ domain.title }}</q-item-label>
            <q-item-label caption>Освоено: {{ domain.mastered_count }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="priority_high" color="warning" size="xs" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
defineProps({
  top: Array,
  weak: Array
})
</script>

<style scoped>
.rounded-16 { border-radius: 16px; }
.letter-1 { letter-spacing: 1px; }
</style>