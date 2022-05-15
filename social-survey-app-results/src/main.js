import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import VueApexCharts from 'vue3-apexcharts';

import 'element-plus/theme-chalk/el-reset.css';
import 'element-plus/es/components/message-box/style/css';
import 'element-plus/es/components/message/style/css';

const app = createApp(App);

app.use(router);

app.use(VueApexCharts);

app.mount('#app');
