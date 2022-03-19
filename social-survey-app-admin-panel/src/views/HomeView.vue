<template>
  <main>Home page <a href="#" @click="logout">Logout</a></main>
</template>

<script>
import { useAccountStore } from '@/stores/account';
import { mapStores } from 'pinia';

export default {
  computed: {
    ...mapStores(useAccountStore),
  },
  methods: {
    logout() {
      this.accountStore.resetLocalStorage();
      location.reload();
    },
  },
};
</script>
