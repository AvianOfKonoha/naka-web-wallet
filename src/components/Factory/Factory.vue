<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';

/*Global state*/
const contractsStore = useContractsStore();
</script>

<template>
  <div class="row">
    <h2>Get Contract Address from the Factory Contract</h2>

    <div class="factory__wrap">
      <div class="factory__input--wrap">
        <label for="apiKey">API key</label>
        <input
          name="apiKey"
          id="apiKey"
          type="text"
          class="input__api-key"
          placeholder="Polygon api key..."
          size="70"
          v-model="contractsStore.inputs.apiKey"
        />
      </div>
      <div class="factory__input--wrap">
        <label for="factoryInput">Factory Contract</label>
        <input
          id="factoryInput"
          name="factory"
          type="text"
          class="factory__input"
          placeholder="Factory Contract address..."
          size="70"
          v-model="contractsStore.inputs.factory"
        />
      </div>
      <button id="factoryCta" @click="contractsStore.getContractFromFactory">
        Get Contract Address
        <span class="loader" v-if="contractsStore.loading.factory"></span>
      </button>
      <div
        class="factory__output"
        v-if="contractsStore.factory.contractAddress"
      >
        Contract Address: {{ contractsStore.factory.contractAddress }}
      </div>
    </div>
  </div>
</template>
