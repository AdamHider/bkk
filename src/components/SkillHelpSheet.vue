<template>
  <q-card class="skill-help-card no-shadow">
    <q-card-section class="flex no-wrap items-start justify-between q-pb-none">
      <div>
        <div class="text-h6 text-weight-bold">Что-то идет не так?</div>
        <p class="text-caption text-grey-7 q-mb-md">
          Если ребенок буксует, попробуйте изменить подход по этой методике:
        </p>
      </div>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list borderless class="help-steps">

        <q-expansion-item
          group="help"
          header-class="q-px-sm"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-weight-bold">1. Я на уровне глаз?</q-item-label>
              <q-item-label caption>Позиция</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="q-pt-sm">
              <ul class="q-pl-md q-ma-none">
                <li><b>Лицом к лицу:</b> Спуститесь на уровень глаз ребенка (на пол, на корточки).</li>
                <li><b>Коридор внимания:</b> Своим телом или мебелью уберите лишнее пространство по бокам.</li>
                <li><b>Конкуренты:</b> Спрячьте всё, что ярче или интереснее учебного предмета.</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="help"
          header-class="q-px-sm"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-weight-bold">2. Я в игре?</q-item-label>
              <q-item-label caption>Присоединение</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="q-pt-sm">
              <ul class="q-pl-md q-ma-none">
                <li><b>Следование:</b> Начните делать то же, что и ребенок (стучит — и вы стучите).</li>
                <li><b>Микро-изменение:</b> Когда он заметил вас, внесите маленькое новшество в игру.</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="help"
          header-class="q-px-sm"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-weight-bold">3. Жду 4 секунды?</q-item-label>
              <q-item-label caption>Пауза</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="q-pt-sm">
              <p class="q-mb-none ">
                <b>Просто посчитайте про себя: 1... 2... 3... 4.</b><br>
                Часто мы помогаем слишком быстро, не давая мозгу ребенка шанс сработать самостоятельно.
              </p>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="help"
          header-class="text-weight-bold q-px-sm"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-weight-bold">4. Помогаю в меру?</q-item-label>
              <q-item-label caption>Подсказка</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="q-pt-sm">
              <div class="text-caption q-mb-sm">Спускайтесь по шкале вниз, если не выходит:</div>
              <div class="column q-gutter-xs">
                <div class="row items-center"><q-icon name="touch_app" size="xs" class="q-mr-xs" /> Жест (указать пальцем)</div>
                <div class="row items-center"><q-icon name="visibility" size="xs" class="q-mr-xs" /> Моделирование (показать пример)</div>
                <div class="row items-center text-weight-bold text-orange-9"><q-icon name="front_hand" size="xs" class="q-mr-xs" /> Рука в руке (сделать вместе)</div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="help"
          header-class="q-px-sm"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-weight-bold">5. Ребенку нравится?</q-item-label>
              <q-item-label caption>Поощрение</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="q-pt-sm">
              <ul class="q-pl-md q-ma-none">
                <li><b>Правило 1 секунды:</b> Хвалите или давайте приз сразу в момент успеха.</li>
                <li><b>Вариативность:</b> Чередуйте щекотку, еду, игрушку и бурные эмоции.</li>
                <li><b>Смысл:</b> Само действие должно вести к призу (открыл банку — съел ягоду).</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.help-steps :deep(.q-expansion-item__container) {
  border-bottom: 1px solid #f0f0f0;
}
</style>
