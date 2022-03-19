<script></script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>Social Survey App</el-header>
      <el-main class="login-main">
        <el-card class="box-card">
          <el-form class="demo-form-inline" label-width="80px">
            <el-form-item label="E-mail">
              <el-input v-model="user" />
            </el-form-item>
            <el-form-item label="Password">
              <el-input v-model="password" type="password" show-password />
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <el-button type="primary" @click="this.onSubmit">Login</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus';
import { useAccountStore } from '@/stores/account';
import { mapStores } from 'pinia';

export default {
  data() {
    return {
      user: '',
      password: '',
    };
  },
  computed: {
    ...mapStores(useAccountStore),
  },
  methods: {
    async onSubmit() {
      let data;
      try {
        const response = await this.axios.post(
          'https://socialsurveyapp.software/api/v1/auth/login',
          {
            email: this.user,
            password: this.password,
          }
        );
        data = response.data;
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
        this.accountStore.setTokens(data.tokens);
        this.accountStore.setUser(data.user);
        this.$router.push('/');
      } else {
        ElMessageBox.alert('User does not have required privileges!', 'Error', {
          confirmButtonText: 'OK',
        });
      }
    },
  },
};
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
