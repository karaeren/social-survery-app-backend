<script>
import { ref } from 'vue';
import { useCounterStore } from '@/stores/counter';

export default {
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup() {
    const localCount = ref(0);
    const counter = useCounterStore();

    counter.counter++;
    return {
      localCount,
      counter,
    };
  },
  mounted() {
    console.log(1);
  },
};
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ localCount }}/{{ counter.counter }}: {{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://vuejs.org/">Vue 3</a>.
      <a @click="localCount++" href="#">click me</a>
      or
      <!-- <a @click="counter.counter++" href="#">click me</a> -->
      <el-button type="success">I am ElButton</el-button>
    </h3>
  </div>
</template>
