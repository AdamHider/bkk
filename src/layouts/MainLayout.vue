<template>
  <q-layout view="lhh Lpr lFf">
    <ConnectionStatusDialog />
    <q-toolbar class="main-header ">
      <LogoSimple/>
    </q-toolbar>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </q-page-container>
    <q-footer v-if="bottomBarEnabled" bordered class="bg-white text-primary">
      <q-tabs no-caps active-color="primary" indicator-color="primary" class="text-grey">
        <q-route-tab to="/" icon="dashboard"/>
        <q-route-tab to="/skills" icon="sym_o_exercise"/>
        <q-route-tab to="/games" icon="sym_o_sports_esports"/>
        <q-route-tab to="/archive" icon="sym_o_sentiment_very_satisfied"/>
        <q-route-tab to="/calendar" icon="calendar_month"/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LogoSimple from '../components/LogoSimple.vue'
import ConnectionStatusDialog from '../components/ConnectionStatusDialog.vue'
import { useChild } from 'src/composables/useChild'
import { useSkills } from 'src/composables/useSkills'

const bottomBarEnabled = ref(true)
const route = useRoute()

const { loadChild } = useChild()
const { loadSkills } = useSkills()
const childId = 1
onMounted(() => {
  loadChild(childId, 'week')
  loadSkills(childId, 'in_progress')
})

watch(route, () => {
  bottomBarEnabled.value = !route.meta.noBottomBar
})
</script>
<style scoped>
.main-header{
  position: absolute;
  z-index: 1;
}
</style>
