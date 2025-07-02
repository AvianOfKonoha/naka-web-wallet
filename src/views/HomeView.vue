<script setup lang="ts">
import Deployer from '@/components/Deployer/Deployer.vue';
import TxHash from '@/components/TransactionHash/TxHash.vue';
import Factory from '@/components/Factory/Factory.vue';
import Metamask from '@/components/Home/Metamask.vue';
import Abi from '@/components/Abi/Abi.vue';
</script>

<template>
  <main>
    <div class="main__content">
      <!--   Connect to Metamask   -->
      <Metamask />

      <!--   Generate SCA through deployer's data   -->
      <Deployer />

      <!--    Generate SCA through transaction hash  -->
      <TxHash />

      <!--   Generate SCA from Factory contract   -->
      <Factory />
    </div>
  </main>
</template>
