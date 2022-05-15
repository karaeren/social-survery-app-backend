<template>
  <MainView />
</template>

<script setup>
import MainView from './components/MainView.vue';
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

.main {
  padding: 32px;
}
.centered-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 64px);
}
.scrollbar-box {
  color: rgb(96, 98, 102);
  background-color: rgb(255, 255, 255);
  padding: 32px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
</style>
