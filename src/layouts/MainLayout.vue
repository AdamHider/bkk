<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white text-primary">
        <q-toolbar-title> <b>Bikeka</b> </q-toolbar-title>
        <q-avatar size="40px">
           <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey">
        <q-route-tab to="/" icon="dashboard" label="Главная" />
        <q-route-tab to="/skills" icon="extension" label="Навыки" />
        <q-route-tab to="/profile" icon="person" label="Профиль" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>