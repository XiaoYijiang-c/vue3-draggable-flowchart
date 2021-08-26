import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import * as echarts from 'echarts';
import 'element-plus/lib/theme-chalk/index.css';
import jsPlumb from 'jsplumb';
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
const app = createApp(App)

app.use(ElementPlus)
app.config.globalProperties.echarts = echarts;
app.use(jsPlumb)
app.use(Vue3DraggableResizable)
app.mount('#app');