<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white text-primary">
        <Logo/>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey">
        <q-route-tab to="/" icon="dashboard" label="Главная" />
        <q-route-tab to="/skills" icon="sym_o_exercise" label="Учим" />
        <q-route-tab to="/archive" icon="sym_o_sentiment_very_satisfied" label="Умеем" />
        <q-route-tab to="/profile" icon="person" label="Профиль" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>

import Logo from '../components/Logo.vue'

</script>
