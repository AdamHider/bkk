<template>
  <q-card class="skill-help-card no-shadow">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-weight-bold">🆘 Что-то идет не так?</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section class="q-pa-md">
      <p class="text-caption text-grey-7 q-mb-md">
        Если ребенок буксует, попробуйте изменить подход по этой методике:
      </p>

      <q-list borderless class="help-steps">

        <q-expansion-item
          group="help"
          header-class="text-grey-9 text-weight-bold"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar color="primary-1" text-color="primary" icon="accessibility_new" size="md" />
            </q-item-section>
            <q-item-section>1. Позиция (Сцена)</q-item-section>
          </template>
          <q-card>
            <q-card-section class="text-body2">
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
          header-class="text-grey-9 text-weight-bold"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar color="primary-1" text-color="primary" icon="join_inner" size="md" />
            </q-item-section>
            <q-item-section>2. Присоединение (Вход)</q-item-section>
          </template>
          <q-card>
            <q-card-section class="text-body2">
              <ul class="q-pl-md q-ma-none">
                <li><b>Следование:</b> Начните делать то же, что и ребенок (стучит — и вы стучите).</li>
                <li><b>Микро-изменение:</b> Когда он заметил вас, внесите маленькое новшество в игру.</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="help"
          header-class="text-grey-9 text-weight-bold"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar color="primary-1" text-color="primary" icon="hourglass_empty" size="md" />
            </q-item-section>
            <q-item-section>3. Пауза (4 секунды)</q-item-section>
          </template>
          <q-card>
            <q-card-section class="text-body2">
              <p class="q-mb-none ">
                <b>Просто посчитайте про себя: 1... 2... 3... 4.</b><br>
                Часто мы помогаем слишком быстро, не давая мозгу ребенка шанс сработать самостоятельно.
              </p>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="help"
          header-class="text-grey-9 text-weight-bold"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar color="primary-1" text-color="primary" icon="stairs" size="md" />
            </q-item-section>
            <q-item-section>4. Подсказка (Иерархия)</q-item-section>
          </template>
          <q-card>
            <q-card-section>
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
          header-class="text-grey-9 text-weight-bold"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar color="primary-1" text-color="primary" icon="celebration" size="md" />
            </q-item-section>
            <q-item-section>5. Поощрение (Мотивация)</q-item-section>
          </template>
          <q-card>
            <q-card-section class="text-body2">
              <ul class="q-pl-md q-ma-none">
                <li><b>Правило 1 секунды:</b> Хвалите или давайте приз сразу в момент успеха.</li>
                <li><b>Вариативность:</b> Чередуйте щекотку, еду, игрушку и бурные эмоции.</li>
                <li><b>Смысл:</b> Само действие должно вести к призу (открыл банку — съел ягоду).</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <div class="q-mt-lg q-pa-md ">
        <div class="text-subtitle2 q-mb-sm row items-center">
          <q-icon name="fact_check" class="q-mr-sm" />
          Чек-лист "5П"
        </div>
        <div class="column q-gutter-xs">
          <div class="row no-wrap"><q-icon name="done" class="q-mr-xs" /> <b>Позиция:</b> Я на уровне глаз?</div>
          <div class="row no-wrap"><q-icon name="done" class="q-mr-xs" /> <b>Присоединение:</b> Я в его игре?</div>
          <div class="row no-wrap"><q-icon name="done" class="q-mr-xs" /> <b>Пауза:</b> Жду 4 секунды?</div>
          <div class="row no-wrap"><q-icon name="done" class="q-mr-xs" /> <b>Подсказка:</b> Помогаю в меру?</div>
          <div class="row no-wrap"><q-icon name="done" class="q-mr-xs" /> <b>Поощрение:</b> Ему весело?</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.help-steps :deep(.q-expansion-item__container) {
  border-bottom: 1px solid #f0f0f0;
}
</style>
