<template>
    <div class="flex q-gutter-xs items-center" >
        <img src="/dino_logo.png" height="35px" />
        <div :class="`logo ${(isDarkLogo) ? 'dark' : ''} q-mt-sm`">Bikeka</div>
    </div>
  </template>
  <script setup>
  
  import { useRoute } from 'vue-router'
  import { watch, ref } from 'vue'
  
  const route = useRoute()
  
  const isDarkLogo = ref(route.meta.isDarkLogo)
  watch(route, () => {
    isDarkLogo.value = route.meta.isDarkLogo
  })
  </script>
  <style lang="scss">
    .logo{ 
        font-family: Baloo2;
        font-size: 30px;
        color: white;
        filter: drop-shadow(0 0 0.25rem #db4258); 
        &.dark{
            color: black !important;
            filter: none !important; 
        }
    }
  </style>
  