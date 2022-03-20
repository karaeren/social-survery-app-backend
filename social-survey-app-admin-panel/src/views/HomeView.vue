<template>
  <main>Home page <a href="#" @click="logout">Logout</a></main>
</template>

<script setup>
import { useAccountStore } from '@/stores/account';

const accountStore = useAccountStore(); // account store

function logout() {
  accountStore.resetLocalStorage();
  location.reload();
}
</script>
