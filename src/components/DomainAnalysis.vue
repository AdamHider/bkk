<template>
  <q-card class="rounded-borders shadow-sm">
    <q-tabs
      v-model="tab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="easy" style="text-transform: inherit;"><b>Даётся легко</b></q-tab>
      <q-tab name="hard" style="text-transform: inherit;"><b>Даётся сложно</b></q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="easy" class="q-px-none q-py-sm">
          <q-list separator>
            <q-item v-for="domain in top" :key="domain.key">
              <q-item-section avatar>
                <q-avatar :color="`${domain.color}-1`" :text-color="domain.color" :icon="domain.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ domain.title }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>Навыков: {{ domain.mastered_count }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
      </q-tab-panel>

      <q-tab-panel name="hard" class="q-px-none q-py-sm">
        <q-list>
          <q-item v-for="domain in weak" :key="domain.key">
            <q-item-section avatar>
              <q-avatar :color="`${domain.color}-1`" :text-color="domain.color" :icon="domain.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ domain.title }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>Навыков: {{ domain.mastered_count }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  top: Array,
  weak: Array
})
const tab = ref('easy')
</script>

<style scoped>
</style>