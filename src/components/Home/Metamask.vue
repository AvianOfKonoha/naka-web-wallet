<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';

/*Global state*/
const contractsStore = useContractsStore();
</script>

<template>
  <div class="row">
    <button id="connect" @click="contractsStore.connectMetamask">
      Connect to MetaMask
    </button>
    <p id="account" v-if="contractsStore.metamaskAccount">
      Connected: {{ contractsStore.metamaskAccount }}
    </p>
  </div>
</template>
