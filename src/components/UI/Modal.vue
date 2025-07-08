<script setup lang="ts">
/*Props*/
const props = defineProps<{
  class?: string;
  toggleActive(active: boolean): void;
}>();

/*Methods*/
const closeModal = () => {
  props.toggleActive(false);
};
</script>

<template>
  <div class="modal__wrap">
    <div class="modal__backdrop" @click="closeModal"></div>
    <div class="modal__box" :class="props.class">
      <button
        type="button"
        aria-label="Close modal"
        class="modal__close"
        @click="closeModal"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 13L13 1"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ></path>
          <path
            d="M1 0.999999L13 13"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ></path>
        </svg>
      </button>
      <slot />
    </div>
  </div>
</template>
