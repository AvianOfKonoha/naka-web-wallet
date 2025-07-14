<script setup lang="ts">
import type {IWithdrawal} from '@/types/contracts.ts';
import {bottomToast, localizeDateTime} from '@/utils/helpers.ts';
import Modal from '@/components/UI/Modal.vue';
import {ref} from 'vue';

/*Props*/
const props = defineProps<{
  withdrawal: IWithdrawal;
}>();

/*Local state*/
const completeModal = ref(false);

/*Methods*/
const toggleModal = (active: boolean) => {
  completeModal.value = active;
};

const closeModal = () => {
  toggleModal(false);
};

const completeWithdrawal = () => {
  bottomToast(
    'Withdraw to: b4329..7FAB has been successfully completed.',
    'toast__wide toast__withdrawal'
  );
  closeModal();
};
</script>

<template>
  <Modal
    :closeModal="closeModal"
    v-if="completeModal"
    wrapClass="modal__withdraw--wrap-complete"
    class="modal__withdrawal--complete"
  >
    <div class="modal__title">Complete Withdrawal</div>
    <div class="complete__description">
      Please note that a small gas fee is required to complete your withdrawal.
      This fee ensures the secure and timely processing of your transaction. You
      can complete the withdrawal process after confirming the payment of the
      gas fee. Thank you for your understanding.
    </div>
    <div class="complete__button">
      <button
        type="button"
        aria-label="Complete withdrawal"
        @click="completeWithdrawal"
      >
        Complete withdrawal
      </button>
    </div>
  </Modal>

  <div
    class="withdrawal__row"
    :class="`withdrawal__row--${props.withdrawal.status}`"
  >
    <div class="withdrawal__row--statement">
      <div class="withdrawal__icon">
        <div class="withdrawal__icon--status"></div>
        <svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_5964_5147)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.8204 8.43721C16.9137 8.63314 16.8859 8.86525 16.7491 9.03366L9.43656 18.0337C9.32974 18.1651 9.16938 18.2415 8.99999 18.2415C8.83061 18.2415 8.67024 18.1651 8.56343 18.0337L1.25093 9.03366C1.11409 8.86525 1.08633 8.63314 1.17959 8.43721C1.27285 8.24127 1.4705 8.11645 1.68749 8.11645L5.62499 8.11645L5.62499 3.61645C5.62499 1.75217 7.13571 0.241455 8.99999 0.241455C10.8643 0.241455 12.375 1.75217 12.375 3.61645L12.375 8.11645L16.3125 8.11646C16.5295 8.11646 16.7271 8.24127 16.8204 8.43721Z"
              fill="#0C0C0C"
            />
          </g>
          <defs>
            <clipPath id="clip0_5964_5147">
              <rect
                width="18"
                height="18"
                fill="white"
                transform="translate(0 0.241455)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div class="withdrawal__details">
        <span class="withdrawal__details--address">
          Withdraw: {{ props.withdrawal.address }}
        </span>
        <div class="withdrawal__details--date">
          {{ localizeDateTime(props.withdrawal.date) }}
        </div>
      </div>
      <div class="withdrawal__amount">
        -{{ props.withdrawal.amount.toFixed(2) }} USD₮
      </div>
    </div>
    <div
      class="withdrawal__row--button"
      v-if="props.withdrawal.status === 'ready'"
    >
      <button
        type="button"
        aria-label="Complete withdraw"
        @click="toggleModal(true)"
      >
        Complete withdraw
      </button>
    </div>
  </div>
</template>
