<template>
  <div class="row q-col-gutter-md">
    <!-- Сильные стороны -->
    <div class="col-12 col-md-6">
      <q-list bordered padding class="bg-white rounded-borders">
        <q-item-label header class="text-weight-bold text-green-6 ">Даётся легко</q-item-label>
        <q-item v-for="domain in top" :key="domain.key">
          <q-item-section avatar>
            <q-avatar :color="`${domain.color}-1`" :text-color="domain.color" :icon="domain.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ domain.title }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>Завершено: {{ domain.mastered_count }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Зоны роста -->
    <div class="col-12 col-md-6">
      <q-list bordered padding class="bg-white rounded-borders">
        <q-item-label header class="text-weight-bold text-amber-8">Даётся сложно</q-item-label>
        <q-item v-for="domain in weak" :key="domain.key">
          <q-item-section avatar>
            <q-avatar :color="`${domain.color}-1`" :text-color="domain.color" :icon="domain.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ domain.title }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>Завершено: {{ domain.mastered_count }}</q-item-label>
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
</style>