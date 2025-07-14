<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';

/*Global state*/
const contractsStore = useContractsStore();

/*Methods*/
const preventNegative = (event: any) => {
  /** Get inserted value from the input */
  const value = parseFloat(event.target.value);

  /** If the inserted value is not a number replace it with zero and update the global state */
  if (isNaN(value)) {
    event.target.value = 0;
    contractsStore.updateFormField(0, 'connected', 'amount');
  }

  /** If the inserted value is equal or bigger than zero stop propagation */
  if (value >= 0) {
    return;
  }

  /** If the inserted value is less than zero replace it with zero and update the global state */
  event.target.value = 0;
  contractsStore.updateFormField(0, 'connected', 'amount');
};

const resetValue = () => {
  contractsStore.updateFormField(0, 'connected', 'amount');
};
</script>

<template>
  <form
    class="connected__form"
    @submit.prevent="contractsStore.submitConnectedForm"
  >
    <div
      class="connected__form--step-amount"
      v-if="contractsStore.wallets.connected.step === 1"
    >
      <div class="modal__title">Define amount</div>
      <div class="connected__form--amount">
        <div class="amount__wrap">
          <input
            type="number"
            :required="contractsStore.form.connected.amount.required"
            min="0"
            @input="preventNegative"
            placeholder="0.00000"
            step="0.00001"
            v-model="contractsStore.form.connected.amount.value"
          />
          <span class="amount__currency">USD₮</span>
          <button type="reset" aria-label="Reset amount" @click="resetValue">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_5958_7667)">
                <path
                  d="M7 0C10.866 1.28851e-07 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 1.28855e-07 10.866 0 7C0 3.13401 3.13401 0 7 0ZM9.93457 4.06543C9.76372 3.89458 9.48628 3.89458 9.31543 4.06543L7 6.38086L4.68457 4.06543C4.51372 3.89458 4.23628 3.89458 4.06543 4.06543C3.89458 4.23628 3.89458 4.51372 4.06543 4.68457L6.38086 7L4.06543 9.31543C3.89458 9.48628 3.89458 9.76372 4.06543 9.93457C4.23628 10.1054 4.51372 10.1054 4.68457 9.93457L7 7.61914L9.31543 9.93457C9.48628 10.1054 9.76372 10.1054 9.93457 9.93457C10.1054 9.76372 10.1054 9.48628 9.93457 9.31543L7.61914 7L9.93457 4.68457C10.1054 4.51372 10.1054 4.23628 9.93457 4.06543Z"
                  fill="#939393"
                />
              </g>
              <defs>
                <clipPath id="clip0_5958_7667">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        <button type="button" aria-label="Set max amount" class="amount__max">
          MAX
        </button>
      </div>
      <div class="connected__form--submit">
        <button
          class="submit__button"
          type="submit"
          aria-label="Submit form"
          :class="{active: contractsStore.form.connected.amount.value}"
        >
          Confirm
        </button>
      </div>
    </div>
    <div
      class="connected__form--step-process"
      v-if="contractsStore.wallets.connected.step === 2"
    >
      <div class="modal__title">Withdraw processing</div>
      <div class="process__description">
        During this period, your selected
        <b>funds will be reserved for 1h</b> this is done to provide an extra
        layer of security. After the Token Reservation Period ends you can
        complete the withdraw of reserved funds by pressing on the complete
        withdraw button.
      </div>
      <div class="process__statement">
        <div class="statement__label">Amount:</div>
        <div class="statement__value">
          {{ contractsStore.form.connected.amount.value.toFixed(2) }} USD₮
        </div>
      </div>
      <div class="process__button">
        <button type="submit" aria-label="Close the modal">I understand</button>
      </div>
    </div>
  </form>
</template>
