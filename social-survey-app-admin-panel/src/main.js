import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import 'element-plus/theme-chalk/el-reset.css';
import 'element-plus/es/components/message-box/style/css';
import 'element-plus/es/components/message/style/css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
