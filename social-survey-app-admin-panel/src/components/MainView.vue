<template>
  <div>
    <el-container class="layout-container-main">
      <el-aside width="256px">
        <el-scrollbar>
          <el-menu
            :default-openeds="['surveys', 'surveys-categories', 'users']"
            style="min-height: 100vh"
            :router="true"
          >
            <router-link to="/">
              <div class="logo">Social Survey App</div>
            </router-link>
            <el-sub-menu index="surveys">
              <template #title>
                <el-icon><collection /></el-icon>Surveys
              </template>
              <el-menu-item index="list-surveys">List Surveys</el-menu-item>
              <el-menu-item index="create-survey">Create a Survey</el-menu-item>
              <el-sub-menu index="surveys-categories">
                <template #title>Categories</template>
                <el-menu-item index="list-categories">
                  List Categories
                </el-menu-item>
                <el-menu-item index="create-category">
                  Create a Category
                </el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="users">
              <template #title>
                <el-icon><avatar /></el-icon>Users
              </template>

              <el-menu-item index="list-users">List Users</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="logout" class="bottom-item" @click="logout">
              Logout
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <RouterView />
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'MainView',
};
</script>
<script setup>
import { RouterView, RouterLink } from 'vue-router';

import { Collection, Avatar } from '@element-plus/icons-vue';

import { useAccountStore } from '@/stores/account';

const accountStore = useAccountStore(); // account store

function logout() {
  accountStore.resetLocalStorage();
  location.reload();
}
</script>

<style>
.layout-container-main {
  height: 100vh;
}
.logo {
  text-align: center;
  padding: 16px 0;
  font-weight: 700;
  font-size: 16px;
  color: #4d4d4d;
}
.bottom-item {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
