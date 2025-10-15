<script setup lang="ts">
import {RPC_LIST} from "@/utils/constants.ts";
import {useContractsStore} from "@/stores/contracts.ts";
import {watch} from "vue";

/*Global state*/
const contractsStore = useContractsStore()

/*Watchers*/
watch(() => contractsStore.rpc, () => {
  console.log('initial state changed')
  contractsStore.resetWithdrawalsList();
  contractsStore.getWithdrawalHistory();
})
</script>

<template>
  <footer v-if="contractsStore.vaultContract && !contractsStore.loading.connect">
    <div class="naka__rpc withdraw__screen--history">
      <label class="rpc__label" for="rpc">RPC</label>
      <select v-model="contractsStore.rpc" name="rpc" id="rpc" class="history__selector--select">
        <option v-for="rpc in RPC_LIST" :value="rpc">{{rpc.name}}</option>
      </select>
    </div>
  </footer>
</template>
