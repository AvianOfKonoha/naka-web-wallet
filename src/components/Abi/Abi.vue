<script setup lang="ts">
import VaultRegistry from '../../assets/abi/VaultRegistry.json';
import {ref} from 'vue';
import {useContractsStore} from '@/stores/contracts.ts';

/*Local state*/
const abi = ref('');

/*Global state*/
const contractsStore = useContractsStore();

/*Methods*/
const setAbi = async () => {
  abi.value = JSON.stringify(VaultRegistry);

  if (!contractsStore.web3) {
    return;
  }

  const contract = new contractsStore.web3.eth.Contract(VaultRegistry);
};
</script>

<template>
  <button @click="setAbi">Get ABI from Json</button>
  <div class="abi">{{ abi }}</div>
</template>
