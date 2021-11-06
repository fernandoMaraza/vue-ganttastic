import dayjs from "dayjs"
import { GanttBarObject, GGanttChartPropsRefs } from "@/models/GanttBarObject"
import useTimePositionMapping from "./useTimePositionMapping"
import { Ref, ref } from "vue"

export default function useBarDrag (
  bar: Ref<GanttBarObject>,
  gGanttChartPropsRefs: GGanttChartPropsRefs,
  onDrag: (bar: GanttBarObject) => void = () => null
) {
  const { barStart, barEnd, pushOnOverlap } = gGanttChartPropsRefs

  const isDragging = ref(false)
  let cursorOffsetX = 0
  let dragCallBack : (e: MouseEvent) => void
  const { mapPositionToTime } = useTimePositionMapping(gGanttChartPropsRefs)

  const initDrag = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.ganttBarConfig.id)
    if (barElement) {
      cursorOffsetX = e.clientX - (barElement.getBoundingClientRect().left || 0)
      const mousedownType = (e.target as Element).className
      switch (mousedownType) {
        case "g-gantt-bar-handle-left":
          document.body.style.cursor = "w-resize"
          dragCallBack = dragByLeftHandle
          break
        case "g-gantt-bar-handle-right":
          document.body.style.cursor = "w-resize"
          dragCallBack = dragByRightHandle
          break
        default: dragCallBack = drag
      }
      isDragging.value = true
      window.addEventListener("mousemove", dragCallBack)
      window.addEventListener("mouseup", endDrag)
    }
  }

  const drag = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.ganttBarConfig.id)
    const barContainer = barElement?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
    if (barElement && barContainer) {
      const barWidth = barElement.getBoundingClientRect().width
      const xStart = (e.clientX - barContainer.left - cursorOffsetX)
      const xEnd = xStart + barWidth
      if (isOutOfRange(xStart, xEnd)) {
        return
      }
      bar.value[barStart.value] = mapPositionToTime(xStart)
      bar.value[barEnd.value] = mapPositionToTime(xEnd)
      onDrag(bar.value)
    }
  }

  const dragByLeftHandle = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.ganttBarConfig.id)
    const barContainer = barElement?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
    if (barElement && barContainer) {
      const xStart = e.clientX - barContainer.left
      const newBarStart = mapPositionToTime(xStart)
      if (dayjs(newBarStart).isSameOrAfter(bar.value[barEnd.value])) {
        return
      }
      bar.value[barStart.value] = newBarStart
      onDrag(bar.value)
    }
  }

  const dragByRightHandle = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.ganttBarConfig.id)
    const barContainer = barElement?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
    if (barElement && barContainer) {
      const xEnd = e.clientX - barContainer.left
      const newBarEnd = mapPositionToTime(xEnd)
      if (dayjs(newBarEnd).isSameOrBefore(bar.value[barStart.value])) {
        return
      }
      bar.value[barEnd.value] = newBarEnd
      onDrag(bar.value)
    }
  }

  const isOutOfRange = (xStart?: number, xEnd?: number) => {
    if (!pushOnOverlap) {
      return false
    }
    const dragLimitLeft = bar.value.ganttBarConfig.dragLimitLeft
    const dragLimitRight = bar.value.ganttBarConfig.dragLimitRight
    if (xStart && dragLimitLeft != null && xStart < dragLimitLeft) {
      return true
    }
    if (xEnd && dragLimitRight != null && xEnd > dragLimitRight) {
      return true
    }
    return false
  }

  const endDrag = (e: MouseEvent) => {
    isDragging.value = false
    document.body.style.cursor = "auto"
    window.removeEventListener("mousemove", dragCallBack)
    window.removeEventListener("mouseup", endDrag)
  }

  return {
    isDragging,
    initDrag
  }
}
