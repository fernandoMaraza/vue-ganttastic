<template>
  <div class="g-timeaxis">
    <div class="g-timeunits-container">
      <div
        v-for="({ label, value, date, width }, index) in timeaxisUnits.upperUnits"
        :key="label"
        class="g-upper-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.primary : colors.secondary,
          color: colors.text,
          width
        }"
      >
        <slot name="upper-timeunit" :label="label" :value="value" :date="date">
          {{ label }}
        </slot>
      </div>
    </div>

    <div class="g-timeunits-container">
      <div
        v-for="({ label, value, date, width }, index) in timeaxisUnits.lowerUnits"
        :key="label"
        class="g-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.ternary : colors.quartenary,
          color: colors.text,
          flexDirection: precision === 'hour' ? 'column' : 'row',
          alignItems: precision === 'hour' ? '' : 'center',
          width
        }"
      >
        <slot name="timeunit" :label="label" :value="value" :date="date">
          {{ label }}
          <div v-show="isActiveInSeconds" style="width: 100%; position: relative; display: flex">
            <div
              v-for="pinIndex in 60"
              :key="pinIndex"
              class="g-timeaxis-hour-pin"
              :style="{
                background: colors.text,
                width: '1px',
                height: '10px',
                position: 'absolute',
                top: 0,
                left: `${(pinIndex - 1) * (100 / 60)}%`,

                marginLeft: 'auto',
                marginRight: 'auto'
              }"
            />
            <span
              v-for="pinIndex in 60"
              :key="`label-${pinIndex}`"
              :style="{
                position: 'absolute',
                top: '-20px',
                left: `${(pinIndex - 1) * (100 / 60)}%`,
                textAlign: 'center',
                color: colors.text,
                fontSize: '7px'
              }"
            >
              {{ pinIndex === 1 ? `` : (pinIndex - 1) * 1 }}
            </span>
            <div
              v-for="secIndexSecond in 3600"
              :key="secIndexSecond"
              class="g-timeaxis-second-pin"
              :style="{
                zIndex: 99,
                justifyContent: 'space-between',
                background: '#fffff',
                width: '1px',
                height: '5px',
                position: 'absolute',
                top: '10px',
                left: `${(secIndexSecond - 1) * (100 / 3600)}%`,
                marginLeft: 'auto',
                marginRight: 'auto'
              }"
            >
              <span
                :style="{
                  position: 'absolute',
                  top: '-10px',
                  left: `${(secIndexSecond - 1) * (100 / 3600)}%`,
                  textAlign: 'center',
                  color: '#fffff',
                  fontSize: '7px'
                }"
              >
                {{ (secIndexSecond - 1) % 60 !== 0 ? (secIndexSecond - 1) % 60 : "" }}
              </span>
            </div>
          </div>
        </slot>
        <div
          v-if="precision === 'hour'"
          class="g-timeaxis-hour-pin"
          :style="{ background: colors.text }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import provideConfig from "../provider/provideConfig.js"
import useTimeaxisUnits from "../composables/useTimeaxisUnits.js"
defineProps<{
  isActiveInSeconds?: boolean
}>()
const { precision, colors } = provideConfig()
const { timeaxisUnits } = useTimeaxisUnits()
</script>

<style>
.g-timeaxis-hour-pin {
  background-color: red;
  height: 2px;
}
.g-timeaxis-second-pin {
  background-color: blue; /* Color de las marcas de segundos */
  height: 5px; /* Altura ajustable */
}
.g-timeaxis {
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: white;
  z-index: 4;
  display: flex;
  flex-direction: column;
}

.g-timeunits-container {
  display: flex;
  width: 100%;
  height: 50%;
}

.g-timeunit {
  height: 100%;
  font-size: 65%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.g-upper-timeunit {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.g-timeaxis-hour-pin {
  width: 1px;
  height: 10px;
}
</style>
