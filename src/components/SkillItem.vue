<template>

  <q-item class="bg-white shadow-10 q-mb-md q-py-md rounded-borders shadow-transition">
    <q-item-section avatar>
      <q-avatar :color="`${props.skill.category.color}-1`" :text-color="`${props.skill.category.color}-7`"  :icon="props.skill.category.icon">
        <q-badge floating rounded style="top: unset; bottom: -7px; font-family: Times New Roman;"
          :color="['green-4', 'orange-4', 'red-4', 'purple-4'][props.skill.level - 1]"
          text-color="white"
          :label="['I', 'II', 'III', 'IV'][props.skill.level - 1]"/>
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ props.skill.title }}</q-item-label>
      <q-item-label caption>{{ props.skill.category.title }} </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-circular-progress
        show-value
        rounded
        font-size="10px"
        :value="props.skill.progress.percentage"
        size="40px"
        :thickness="0.2"
        color="primary"
        track-color="grey-3"
        class="text-primary text-weight-bold"
      >
        {{ props.skill.progress.label }}
      </q-circular-progress>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps(['skill'])
</script>
