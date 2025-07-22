<script setup lang="ts">
import type {IExternalForm} from '@/types/contracts.ts';
import {
  copyToClipboard,
  formatWithAtLeastTwoDecimals
} from '@/utils/helpers.ts';

/*Props*/
const props = defineProps<{
  form: IExternalForm;
  resetAddress(): void;
  onAddressChange(): void;
  errorActive: boolean;
  loading: boolean;
}>();

/*Methods*/
const copyAddress = () => {
  if (!props.form.address.value) {
    return;
  }
  copyToClipboard(props.form.address.value);
};
</script>

<template>
  <div class="connected__form--step-process external__form--step-address">
    <div class="modal__title">Define address</div>
    <div class="process__description external__form--description">
      <div class="process__description--text">
        You are about to withdraw USD₮ funds from your balance to an external
        wallet. Make sure the selected wallet supports the selected currency and
        blockchain network.
      </div>
      <div class="external__form--info">
        <div class="info__icon">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_5979_7824)">
              <path
                d="M6 9.75C6.41421 9.75 6.75 9.41421 6.75 9C6.75 8.58579 6.41421 8.25 6 8.25C5.58579 8.25 5.25 8.58579 5.25 9C5.25 9.41421 5.58579 9.75 6 9.75Z"
                fill="#303030"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 2.25C6.20711 2.25 6.375 2.41789 6.375 2.625V6.75C6.375 6.95711 6.20711 7.125 6 7.125C5.79289 7.125 5.625 6.95711 5.625 6.75V2.625C5.625 2.41789 5.79289 2.25 6 2.25Z"
                fill="#303030"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.5 0.75C1.08579 0.75 0.75 1.08579 0.75 1.5V10.5C0.75 10.9142 1.08579 11.25 1.5 11.25H10.5C10.9142 11.25 11.25 10.9142 11.25 10.5V1.5C11.25 1.08579 10.9142 0.75 10.5 0.75H1.5ZM0 1.5C0 0.671573 0.671573 0 1.5 0H10.5C11.3284 0 12 0.671573 12 1.5V10.5C12 11.3284 11.3284 12 10.5 12H1.5C0.671573 12 0 11.3284 0 10.5V1.5Z"
                fill="#303030"
              />
            </g>
            <defs>
              <clipPath id="clip0_5979_7824">
                <rect width="12" height="12" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div class="info__detail">
          <div class="info__details--title">Only USD₮ from Polygon</div>
          <div class="info__details--text">
            Deposit USD₮ from the Polygon network only.
          </div>
        </div>
      </div>
    </div>
    <div class="external__form--address">
      <div class="address__input">
        <input
          type="text"
          v-model="props.form.address.value"
          :required="props.form.address.required"
          placeholder="Paste or enter the Withdrawal Address"
          @input="props.onAddressChange"
          :class="{error: props.errorActive}"
        />
        <small class="error" v-if="props.errorActive"
          >Invalid withdrawal address
        </small>
        <button
          type="reset"
          class="reset"
          aria-label="Clear address"
          @click="props.resetAddress"
          v-if="props.form.address.value"
        >
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
      <button
        type="button"
        aria-label="Copy address to clipboard"
        @click="copyAddress"
        class="address__copy"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.0415 1.66675C1.0415 1.32157 1.32133 1.04175 1.6665 1.04175H13.8887C14.2339 1.04175 14.5137 1.32157 14.5137 1.66675V13.889C14.5137 14.2342 14.2339 14.514 13.8887 14.514H1.6665C1.32133 14.514 1.0415 14.2342 1.0415 13.889V1.66675ZM2.2915 2.29175V13.264H13.2637V2.29175H2.2915Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.7452 6.11119C14.7452 5.76602 15.025 5.48619 15.3702 5.48619H16.111C16.4561 5.48619 16.736 5.76602 16.736 6.11119C16.736 6.45637 16.4561 6.73619 16.111 6.73619H15.3702C15.025 6.73619 14.7452 6.45637 14.7452 6.11119ZM16.9674 6.11119C16.9674 5.76602 17.2473 5.48619 17.5924 5.48619H18.3332C18.6784 5.48619 18.9582 5.76602 18.9582 6.11119V7.12971C18.9582 7.47489 18.6784 7.75471 18.3332 7.75471C17.988 7.75471 17.7082 7.47489 17.7082 7.12971V6.73619H17.5924C17.2473 6.73619 16.9674 6.45637 16.9674 6.11119ZM18.3332 8.54175C18.6784 8.54175 18.9582 8.82157 18.9582 9.16675V11.2038C18.9582 11.549 18.6784 11.8288 18.3332 11.8288C17.988 11.8288 17.7082 11.549 17.7082 11.2038V9.16675C17.7082 8.82157 17.988 8.54175 18.3332 8.54175ZM18.3332 12.6158C18.6784 12.6158 18.9582 12.8956 18.9582 13.2408V15.2779C18.9582 15.623 18.6784 15.9029 18.3332 15.9029C17.988 15.9029 17.7082 15.623 17.7082 15.2779V13.2408C17.7082 12.8956 17.988 12.6158 18.3332 12.6158ZM6.11095 14.7455C6.45613 14.7455 6.73595 15.0253 6.73595 15.3705V16.1112C6.73595 16.4564 6.45613 16.7362 6.11095 16.7362C5.76577 16.7362 5.48595 16.4564 5.48595 16.1112V15.3705C5.48595 15.0253 5.76577 14.7455 6.11095 14.7455ZM18.3332 16.6899C18.6784 16.6899 18.9582 16.9697 18.9582 17.3149V18.3334C18.9582 18.6786 18.6784 18.9584 18.3332 18.9584H17.3147C16.9695 18.9584 16.6897 18.6786 16.6897 18.3334C16.6897 17.9882 16.9695 17.7084 17.3147 17.7084H17.7082V17.3149C17.7082 16.9697 17.988 16.6899 18.3332 16.6899ZM6.11095 16.9677C6.45613 16.9677 6.73595 17.2475 6.73595 17.5927V17.7084H7.12947C7.47465 17.7084 7.75447 17.9882 7.75447 18.3334C7.75447 18.6786 7.47465 18.9584 7.12947 18.9584H6.11095C5.76577 18.9584 5.48595 18.6786 5.48595 18.3334V17.5927C5.48595 17.2475 5.76577 16.9677 6.11095 16.9677ZM8.5415 18.3334C8.5415 17.9882 8.82133 17.7084 9.1665 17.7084H11.2035C11.5487 17.7084 11.8285 17.9882 11.8285 18.3334C11.8285 18.6786 11.5487 18.9584 11.2035 18.9584H9.1665C8.82133 18.9584 8.5415 18.6786 8.5415 18.3334ZM12.6156 18.3334C12.6156 17.9882 12.8954 17.7084 13.2406 17.7084H15.2776C15.6228 17.7084 15.9026 17.9882 15.9026 18.3334C15.9026 18.6786 15.6228 18.9584 15.2776 18.9584H13.2406C12.8954 18.9584 12.6156 18.6786 12.6156 18.3334Z"
          />
        </svg>
      </button>
    </div>
    <div class="process__statement">
      <div class="statement__label">Amount:</div>
      <div class="statement__value">
        {{
          formatWithAtLeastTwoDecimals(props.form.amount.value as number)
        }}
        USD₮
      </div>
    </div>
    <div class="connected__form--submit">
      <button
        class="submit__button"
        type="submit"
        aria-label="Submit form"
        :class="{active: props.form.address.value, loading: props.loading}"
      >
        Confirm
        <span class="loader" v-if="props.loading">
          <span></span><span></span>
        </span>
      </button>
    </div>
  </div>
</template>
