<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';

/*Global state*/
const contractsStore = useContractsStore();
</script>

<template>
  <div class="row">
    <h2>Get Contract Address from Transaction hash</h2>

    <div class="hash__wrap">
      <div class="hash__input--wrap">
        <label for="hashInput">Transaction hash</label>
        <input
          id="hashInput"
          name="hash"
          type="text"
          class="hash__input"
          placeholder="Tx Hash"
          size="70"
          v-model="contractsStore.inputs.transactionHash"
        />
      </div>
      <button id="hashCta" @click="contractsStore.getContractAddressFromTxHash">
        Get Contract Address
        <span
          class="loader"
          v-if="contractsStore.loading.transactionHash"
        ></span>
      </button>
      <div
        class="hash__output"
        v-if="contractsStore.transactionHash.contractAddress"
      >
        Contract Address: {{ contractsStore.transactionHash.contractAddress }}
      </div>
    </div>
  </div>
</template>
