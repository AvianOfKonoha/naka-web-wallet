<script setup lang="ts">
import {RouterView} from 'vue-router';
import {useContractsStore} from '@/stores/contracts.ts';
import Header from '@/components/Header/Header.vue';
import {onMounted} from 'vue';
import Footer from '@/components/Footer/Footer.vue';

/*Global state*/
const contractsStore = useContractsStore();

/*Callbacks*/
onMounted(() => {
  contractsStore.initializeWeb3();
});
</script>

<template>
  <Header />
  <main class="naka">
    <div class="naka__wrap">
      <RouterView />
    </div>
  </main>
  <Footer />
</template>
