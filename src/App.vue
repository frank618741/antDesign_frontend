<template>
  <RouterView v-if="isRouterAlive"></RouterView>

</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import { provide, ref, nextTick } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const isRouterAlive = ref(true);
    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => {
        isRouterAlive.value = true;
      });
    }
    provide("reload", reload);

    return {
      isRouterAlive,
      reload
    }
  }
})
</script>

<style>
html,body,#app{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  
  max-width: 1280px;
  font-weight: normal;
}

</style>











