<template>
  <div class="fireflies-wrapper">
    <div
      v-for="i in 16"
      :key="i"
      class="firefly"
      :style="generateFireflyStyle(i)"
    ></div>
  </div>
</template>

<script setup>
const generateFireflyStyle = (index) => {
  // 1. Распределяем 16 элементов по сетке 4x4
  const row = Math.floor((index - 1) / 4); // 0, 1, 2, 3
  const col = (index - 1) % 4;             // 0, 1, 2, 3

  // 2. Базовая точка в процентах (0, 25, 50, 75)
  const baseLeft = col * 25;
  const baseTop = row * 25;

  // 3. Добавляем случайное смещение внутри своей зоны (-10% до +15%)
  // Это позволяет им заходить за края и не стоять ровными рядами
  const randomOffset = () => Math.random() * 25 - 10;

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const colors = [
    '#ffe1c0', '#ffffff', '#ffcdd2'
  ];
  return {
    left: `${baseLeft + randomOffset()}%`,
    top: `${baseTop + randomOffset()}%`,
    animationDuration: `${random(8, 14)}s`,
    scale: `${Math.random(8,12)}`,
    filter: `blur(${random(0, 2)}px)`,
    background: colors[random(0, colors.length-1)]
  };
};
</script>

<style lang="scss" scoped>
.fireflies-wrapper {
  position: absolute; // Или fixed, если на весь экран
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; // Чтобы вышедшие за край пузыри не создавали прокрутку
  pointer-events: none;
  z-index: 0;
}

.firefly {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.3);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  opacity: 0;
  box-shadow: 0 0 15px 2px rgba(255, 255, 255, 0.1);
  animation: soft-chaos infinite ease-in-out;
}

@keyframes soft-chaos {
  0% {
    opacity: 0;
    transform: translate(0, 0);
  }
  20% {
    opacity: 0.2;
  }
  50% {
    /* Движение по кривой: восьмерка или овал */
    opacity: 0.1;
    transform: translate(40px, -40px);
  }
  80% {
    opacity: 0.3;
    transform: translate(-20px, -70px);
  }
  100% {
    opacity: 0;
    transform: translate(10px, -110px);
  }
}
</style>
