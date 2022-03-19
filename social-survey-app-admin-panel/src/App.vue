<template>
  <div>
    <div v-if="showLoader" class="page-loader">
      <el-icon class="is-loading">
        <loading />
      </el-icon>
    </div>

    <RouterView />
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import { ElMessageBox } from 'element-plus';

import { useAccountStore } from '@/stores/account';
import { mapStores } from 'pinia';
import accountMixin from '@/mixins/account';

export default {
  components: {
    RouterView,
  },
  mixins: [accountMixin],
  computed: {
    ...mapStores(useAccountStore),
  },
  data() {
    return { showLoader: true };
  },
  async mounted() {
    this.accountStore.getFromLocalStorage();

    if (this.accountStore.refresh.token && this.accountStore.user.id) {
      let refreshedTokens;
      try {
        refreshedTokens = await this.refreshTokens(
          this.accountStore.refresh.token
        );
      } catch (e) {
        console.error(e);
        ElMessageBox.alert('Please login again.', 'Session expired', {
          confirmButtonText: 'OK',
        });

        this.accountStore.resetLocalStorage();
        this.showLoader = false;
        return this.$router.push('login');
      }
      let userData;
      try {
        userData = await this.getUser(
          refreshedTokens.access.token,
          this.accountStore.user.id
        );
      } catch (e) {
        console.error(e);
        ElMessageBox.alert('Please login again.', 'Unknwon error', {
          confirmButtonText: 'OK',
        });

        this.accountStore.resetLocalStorage();
        this.showLoader = false;
        return this.$router.push('login');
      }

      if (userData && userData.role === 'admin') {
        this.accountStore.setTokens(refreshedTokens);
        this.accountStore.setUser(userData);
        this.showLoader = false;
      } else {
        ElMessageBox.alert('User does not have required privileges!', 'Error', {
          confirmButtonText: 'OK',
        });

        this.accountStore.resetLocalStorage();
        this.showLoader = false;
        return this.$router.push('login');
      }
    } else {
      this.$router.push('login');
      this.showLoader = false;
    }
  },
};
</script>

<style>
body {
  margin: 0;
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
