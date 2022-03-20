<template>
  <div>
    <div v-if="showLoader" class="page-loader">
      <el-icon class="is-loading">
        <loading />
      </el-icon>
    </div>

    <RouterView v-if="!accountStore.loggedIn" />
    <MainView v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import MainView from './components/MainView.vue';

import { useAccountStore } from '@/stores/account';
import { useAuthApi } from '@/composables/api/auth';
import { useUserApi } from '@/composables/api/user';

import { ElMessageBox } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';

const accountStore = useAccountStore(); // account store
const { refreshTokens } = useAuthApi(); // auth api
const { getUser } = useUserApi(); // user api

// Data
const showLoader = ref(true);

const route = useRoute();
const router = useRouter();

watch(
  () => route.name,
  async (newRoute) => {
    if (newRoute === 'login' && accountStore.loggedIn) {
      router.push('/');
    }
  }
);

onMounted(async () => {
  accountStore.getFromLocalStorage();

  if (accountStore.refresh.token && accountStore.user.id) {
    let refreshedTokens;
    try {
      refreshedTokens = await refreshTokens(accountStore.refresh.token);
    } catch (e) {
      console.error(e);
      ElMessageBox.alert('Please login again.', 'Session expired', {
        confirmButtonText: 'OK',
      });

      accountStore.resetLocalStorage();
      showLoader.value = false;
      return router.push('login');
    }
    let userData;
    try {
      userData = await getUser(
        refreshedTokens.access.token,
        accountStore.user.id
      );
    } catch (e) {
      console.error(e);
      ElMessageBox.alert('Please login again.', 'Unknwon error', {
        confirmButtonText: 'OK',
      });

      accountStore.resetLocalStorage();
      showLoader.value = false;
      return router.push('login');
    }

    if (userData && userData.role === 'admin') {
      accountStore.setTokens(refreshedTokens);
      accountStore.setUser(userData);
      showLoader.value = false;
      accountStore.loggedIn = true;
      return router.push('/');
    } else {
      ElMessageBox.alert('User does not have required privileges!', 'Error', {
        confirmButtonText: 'OK',
      });

      accountStore.resetLocalStorage();
      showLoader.value = false;
      return router.push('login');
    }
  } else {
    router.push('login');
    showLoader.value = false;
  }
});
</script>

<style>
body {
  margin: 0;
  background-color: rgb(238, 241, 246);
}
.page-loader {
  z-index: 100000;
  background: white;
  font-size: 64px;
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
