<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';

/*Global state*/
const contractsStore = useContractsStore();
</script>

<template>
  <div class="row">
    <h2>Predict Contract Address from Private Key</h2>

    <div class="pk__wrap">
      <label>Private Key:</label>
      <input
        id="privateKey"
        type="text"
        placeholder="0x..."
        size="70"
        v-model="contractsStore.inputs.privateKey"
      />
    </div>

    <div class="nonce__wrap">
      <label>Nonce (deployment count):</label>
      <input
        id="nonce"
        type="number"
        value="0"
        v-model="contractsStore.inputs.nonce"
      />
    </div>

    <div class="calculate__wrap">
      <button id="calculate" @click="contractsStore.getContractFromDeployer">
        Get Contract Address
      </button>
      <p id="output" v-if="contractsStore.deployer.contractAddress">
        {{ contractsStore.deployer.contractAddress }}
      </p>
    </div>
  </div>
</template>
