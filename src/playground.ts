import { createApp } from "vue"
import VueVirtualScroller from "vue-virtual-scroller"
import Playground from "./GanttPlayground.vue"
import ganttastic from "./vue-ganttastic.js"
createApp(Playground).use(ganttastic).use(VueVirtualScroller).mount("#app")
