<script setup lang="ts">
import Metamask from '@/components/Home/Metamask.vue';
import {useContractsStore} from '@/stores/contracts.ts';
import Withdraw from '@/components/Withdraw/Withdraw.vue';

/*Global state*/
const contractsStore = useContractsStore();
</script>

<template>
  <!-- Initial box -->
  <Metamask
    v-if="!contractsStore.vaultContract || contractsStore.loading.connect"
  />

  <!-- Withdraw and transaction history -->
  <Withdraw
    v-if="contractsStore.vaultContract && !contractsStore.loading.connect"
  />
</template>
