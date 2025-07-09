<script setup lang="ts">
import {RouterView} from 'vue-router';
import {useContractsStore} from '@/stores/contracts.ts';
import Header from '@/components/Header/Header.vue';
import {onMounted} from 'vue';

/*Global state*/
const contractsStore = useContractsStore();

/*Callbacks*/
contractsStore.initializeWeb3();
</script>

<template>
  <Header />
  <main class="naka">
    <div class="naka__wrap">
      <RouterView />
    </div>
  </main>
</template>
