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
          <strong v-if="isActiveInSeconds">
            {{ label }}
          </strong>
          <span v-else>{{ label }}</span>
          <div v-if="isActiveInSeconds" style="width: 100%; position: relative; display: flex">
            <div
              v-for="pinIndex in 60"
              :key="pinIndex"
              class="g-timeaxis-hour-pin"
              :style="{
                background: colors.text,
                position: 'absolute',
                top: 0,
                left: `${(pinIndex - 1) * (100 / 60)}%`
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
              v-for="secIndexSecond in filteredSeconds"
              :key="secIndexSecond"
              class="g-timeaxis-second-pin"
              :style="{
                left: `${(secIndexSecond - 1) * (100 / 3600)}%`
              }"
            >
              <span
                :style="{
                  left: `${(secIndexSecond - 1) * (100 / 3600)}%`
                }"
              >
                {{ (secIndexSecond - 1) % 60 === 0 ? "" : (secIndexSecond - 1) % 60 }}
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
import { computed } from "vue"
defineProps<{
  isActiveInSeconds?: boolean
}>()
const { precision, colors } = provideConfig()
const { timeaxisUnits } = useTimeaxisUnits()
const filteredSeconds = computed(() => {
  const totalSeconds = 3600
  return Array.from({ length: totalSeconds }, (_, secIndex) => secIndex + 1).filter(
    (secIndexSecond) => (secIndexSecond - 1) % 15 === 0
  )
})
</script>

<style>
.g-timeaxis-second-pin {
  background-color: #888;
  justify-content: space-between;
  height: 5px;
  width: 1px;
  position: absolute;
  font-size: 7px;
}
.g-timeaxis-second-pin span {
  position: absolute;
  top: -10px;
  text-align: center;
  color: "#fffff";
  font-size: 7px;
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
