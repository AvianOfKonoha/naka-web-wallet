<script setup lang="ts">
import Metamask from '@/components/Home/Metamask.vue';
import {useContractsStore} from '@/stores/contracts.ts';
import Withdraw from '@/components/Withdraw/Withdraw.vue';

/*Global state*/
const contractStore = useContractsStore();
</script>

<template>
  <!-- Initial box -->
  <Metamask
    v-if="!contractStore.signature.value || !contractStore.connectedAccount"
  />

  <!-- Withdraw and transaction history -->
  <Withdraw
    v-if="contractStore.signature.value && contractStore.connectedAccount"
  />
</template>
