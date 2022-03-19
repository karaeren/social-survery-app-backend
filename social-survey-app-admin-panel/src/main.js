import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus';
import { Loading, Search } from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/el-reset.css';

import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(ElementPlus);
// eslint-disable-next-line vue/multi-word-component-names
app.component('search', Search).component('loading', Loading);

app.use(VueAxios, axios);

app.mount('#app');
