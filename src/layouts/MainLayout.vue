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
    <q-footer bordered class="bg-white text-primary">
      <q-tabs no-caps active-color="primary" indicator-color="primary" class="text-grey">
        <q-route-tab to="/" icon="dashboard"/>
        <q-route-tab to="/skills" icon="sym_o_exercise"/>
        <q-route-tab to="/calendar" icon="calendar_month"/>
        <q-route-tab to="/archive" icon="sym_o_sentiment_very_satisfied"/>
        <q-route-tab to="/profile" icon="person"/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>

import LogoSimple from '../components/LogoSimple.vue'
import ConnectionStatusDialog from '../components/ConnectionStatusDialog.vue'

</script>
<style scoped>
.main-header{
  position: absolute;
  z-index: 1;
}
</style>
