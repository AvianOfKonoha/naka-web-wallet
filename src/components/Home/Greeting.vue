<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>Interact with Vault contract via Web3.js and MetaMask</h3>
  </div>
</template>
