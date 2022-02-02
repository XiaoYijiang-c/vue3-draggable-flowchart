import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import * as echarts from 'echarts';
import 'element-plus/lib/theme-chalk/index.css';
import Axios from './axios/index.js'
import VueDragResize from 'vue-drag-resize'
const app = createApp(App)
app.use(ElementPlus)
app.config.globalProperties.$axios = Axios
app.config.globalProperties.echarts = echarts;
app.component('vue-drag-resize', VueDragResize)
app.mount('#app');