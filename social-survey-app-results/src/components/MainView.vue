<template>
  <div>
    <el-container class="main-container">
      <RouterView />
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'MainView',
};
</script>
<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
.main-container {
  justify-content: center;
}
</style>
