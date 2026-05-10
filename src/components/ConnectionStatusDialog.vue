<template>
    <transition
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <div v-if="!isOnline" class="offline-badge">
        <div class="flex items-center justify-center q-gutter-x-sm">
          <q-icon name="wifi_off" size="14px" />
          <span>Оффлайн режим</span>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, onActivated, onDeactivated } from 'vue'
  import axios from 'axios'
  
  const isOnline = ref(true)
  let intervalId = null
  
  const checkConnection = async () => {
    if (!navigator.onLine) {
      isOnline.value = false
      return
    }
    try {
      await axios.head('http://bikeka-app.local', { 
        timeout: 3000,
        params: { t: Date.now() } 
      })
      isOnline.value = true
    } catch (error) {
      // Если сервер не ответил или таймаут — мы в оффлайне
      isOnline.value = false
    }
  }
  
  onActivated(() => {
    // Первичная проверка
    checkConnection()
  
    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', () => { isOnline.value = false })
  
    intervalId = setInterval(checkConnection, 10000)
  })
  
  onDeactivated(() => {
    window.removeEventListener('online', checkConnection)
    window.removeEventListener('offline', checkConnection)
    if (intervalId) clearInterval(intervalId)
  })
  </script>
  
  <style scoped>
  .offline-badge {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    background: #e04c5d;
    color: white;
    text-align: center;
    padding: 4px 0;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    pointer-events: none;
  }
  </style>