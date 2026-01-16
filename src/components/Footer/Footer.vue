<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';
import {watch} from 'vue';

/*Global state*/
const contractsStore = useContractsStore();

/*Watchers*/
watch(
  () => contractsStore.rpc,
  () => {
    if (contractsStore.loading.history) {
      return;
    }

    contractsStore.resetWithdrawalsList();
    contractsStore.getWithdrawalHistory();
  }
);
</script>

<template>
  <footer
    v-if="
      contractsStore.vaultContract &&
      !contractsStore.loading.connect &&
      contractsStore.activeChain
    "
  >
    <div class="naka__rpc withdraw__screen--history">
      <label class="rpc__label" for="rpc">RPC</label>
      <select
        v-model="contractsStore.rpc"
        name="rpc"
        id="rpc"
        class="history__selector--select"
        :disabled="contractsStore.loading.history"
      >
        <option v-for="rpc in contractsStore.activeChain.rpcs" :value="rpc">
          {{ rpc.name }}
        </option>
      </select>
    </div>
  </footer>
</template>
