<script setup lang="ts">
/*Props*/
const props = defineProps<{
  class?: string;
  wrapClass?: string;
  backdropClass?: string;
  closeModal(): void;
}>();
</script>

<template>
  <div class="modal__wrap" :class="props.wrapClass">
    <div
      class="modal__backdrop"
      @click="props.closeModal"
      :class="props.backdropClass"
    ></div>
    <div class="modal__box" :class="props.class">
      <button
        type="button"
        aria-label="Close modal"
        class="modal__close"
        @click="props.closeModal"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99995 8.70256L1.13241 15.7632C1.04011 15.8555 0.924092 15.9028 0.784348 15.9049C0.644615 15.907 0.526459 15.8598 0.429882 15.7632C0.333293 15.6667 0.284998 15.5496 0.284998 15.412C0.284998 15.2744 0.333293 15.1573 0.429882 15.0607L7.2974 8.00001L0.333265 1.03586C0.240954 0.943556 0.193732 0.827534 0.191598 0.68779C0.189454 0.548057 0.236676 0.429901 0.333265 0.333323C0.429843 0.236734 0.546932 0.18844 0.684532 0.18844C0.822132 0.18844 0.93922 0.236734 1.0358 0.333323L7.99995 7.29746L15.1525 0.282453C15.2448 0.190142 15.3609 0.14292 15.5006 0.140786C15.6403 0.138642 15.7585 0.185864 15.8551 0.282453C15.9517 0.379031 16 0.49612 16 0.63372C16 0.77132 15.9517 0.888408 15.8551 0.984986L8.70249 8.00001L15.57 15.0607C15.6623 15.153 15.7095 15.269 15.7117 15.4088C15.7138 15.5485 15.6666 15.6667 15.57 15.7632C15.4734 15.8598 15.3563 15.9081 15.2187 15.9081C15.0811 15.9081 14.964 15.8598 14.8675 15.7632L7.99995 8.70256Z"
            fill="#616161"
          />
        </svg>
      </button>
      <slot />
    </div>
  </div>
</template>
