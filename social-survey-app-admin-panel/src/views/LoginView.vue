<template>
  <div class="common-layout">
    <el-container>
      <el-header>Social Survey App</el-header>
      <el-main class="login-main">
        <el-card class="box-card">
          <el-form class="demo-form-inline" label-width="80px">
            <el-form-item label="E-mail">
              <el-input v-model="email" />
            </el-form-item>
            <el-form-item label="Password">
              <el-input v-model="password" type="password" show-password />
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <el-button type="primary" @click="onSubmit">Login</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAccountStore } from '@/stores/account';
import { useAuthApi } from '@/composables/api/auth';

import { ElMessageBox } from 'element-plus';

const accountStore = useAccountStore(); // account store
const { login } = useAuthApi(); // account api composable

// Data
const email = ref('');
const password = ref('');

const router = useRouter();

async function onSubmit() {
  let data;
  try {
    data = await login(email.value, password.value);
  } catch (e) {
    let errorText = 'Unknown error...';
    if (e.response.data && e.response.data.message)
      errorText = e.response.data.message;
    ElMessageBox.alert(errorText, 'Error', {
      confirmButtonText: 'OK',
    });

    return;
  }

  if (data && data.user && data.user.role === 'admin') {
    accountStore.setTokens(data.tokens);
    accountStore.setUser(data.user);
    router.push('/');
  } else {
    ElMessageBox.alert('User does not have required privileges!', 'Error', {
      confirmButtonText: 'OK',
    });
  }
}
</script>

<style>
.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-header {
  text-align: center;
  margin-top: 32px;
  font-weight: 700;
  font-size: 24px;
  color: #4d4d4d;
}
</style>
