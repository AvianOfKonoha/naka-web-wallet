<script setup lang="ts">
const props = defineProps<{
  cancelForm(): void;
  loading: boolean;
}>();
</script>

<template>
  <div class="withdraw__fail">
    <div class="withdraw__fail--title modal__title">Withdraw un-successful</div>
    <div class="withdraw__fail--description">
      Oops! It seems there was an issue processing your withdrawal request.
      Please double-check your details and try again. If the problem persists,
      feel free to reach out to our support team for assistance.
    </div>
    <div class="withdraw__fail--buttons">
      <button
        type="button"
        class="button__cancel"
        aria-label="Close the modal"
        @click="props.cancelForm"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="button__submit"
        aria-label="Retry to submit the form"
        :class="{loading: props.loading}"
      >
        <span class="text">Re-Try</span>
        <span class="loader" v-if="props.loading">
          <span></span><span></span>
        </span>
      </button>
    </div>
  </div>
</template>
