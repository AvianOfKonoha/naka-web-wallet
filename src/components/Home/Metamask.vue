<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';

/*Global state*/
const contractsStore = useContractsStore();
</script>

<template>
  <div class="home">
    <div class="home__box">
      <h1 class="home__box--title">NAKA Web Wallet</h1>
      <p class="home__box--text">
        Please connect your wallet to gain access to it’s functionalities.
      </p>
      <div class="home__box--button">
        <button
          id="connect"
          class="button__default home__button--connect"
          :class="{
            connected:
              contractsStore.metamaskAccount && contractsStore.signature.value
          }"
          @click="contractsStore.connectMetamask"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            v-if="
              contractsStore.signature.value && contractsStore.metamaskAccount
            "
          >
            <g id="Group">
              <path
                id="Vector"
                d="M14.6667 0H4V2.66667H14.6667V0Z"
                fill="#C6FC50"
              />
              <path
                id="Vector_2"
                d="M15.3333 4.00016H2C1.63267 4.00016 1.33333 3.70083 1.33333 3.3335C1.33333 2.96616 1.63267 2.66683 2 2.66683H2.66667V1.3335H2C0.895333 1.3335 0 2.22883 0 3.3335V13.3335C0 14.8062 1.194 16.0002 2.66667 16.0002H15.3333C15.7013 16.0002 16 15.7015 16 15.3335V4.66683C16 4.29883 15.7013 4.00016 15.3333 4.00016ZM12 11.3335C11.2633 11.3335 10.6667 10.7368 10.6667 10.0002C10.6667 9.2635 11.2633 8.66683 12 8.66683C12.7367 8.66683 13.3333 9.2635 13.3333 10.0002C13.3333 10.7368 12.7367 11.3335 12 11.3335Z"
                fill="#C6FC50"
              />
            </g>
          </svg>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            v-if="
              !contractsStore.signature.value || !contractsStore.metamaskAccount
            "
          >
            <g clip-path="url(#clip0_5859_1203)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.125 12.375C14.3656 12.375 13.75 12.9906 13.75 13.75C13.75 14.5094 14.3656 15.125 15.125 15.125C15.8844 15.125 16.5 14.5094 16.5 13.75C16.5 12.9906 15.8844 12.375 15.125 12.375ZM12.375 13.75C12.375 12.2312 13.6062 11 15.125 11C16.6438 11 17.875 12.2312 17.875 13.75C17.875 15.2688 16.6438 16.5 15.125 16.5C13.6062 16.5 12.375 15.2688 12.375 13.75Z"
                fill="#F8F8F8"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.4375 1.375C2.89049 1.375 2.36589 1.5923 1.97909 1.97909C1.5923 2.36589 1.375 2.89049 1.375 3.4375C1.375 3.98451 1.5923 4.50911 1.97909 4.89591C2.36589 5.2827 2.89049 5.5 3.4375 5.5H21.3125C21.6922 5.5 22 5.8078 22 6.1875V21.3125C22 21.6922 21.6922 22 21.3125 22H3.4375C2.52582 22 1.65148 21.6378 1.00682 20.9932C0.362164 20.3485 0 19.4742 0 18.5625V3.4375C0 2.52582 0.362164 1.65148 1.00682 1.00682C1.65148 0.362164 2.52582 0 3.4375 0H15.8125C16.1922 0 16.5 0.307804 16.5 0.6875V3.4375C16.5 3.8172 16.1922 4.125 15.8125 4.125C15.4328 4.125 15.125 3.8172 15.125 3.4375V1.375H3.4375ZM1.375 6.18752V18.5625C1.375 19.1095 1.5923 19.6341 1.97909 20.0209C2.36589 20.4077 2.89049 20.625 3.4375 20.625H20.625V6.875H3.4375C2.68944 6.875 1.96652 6.63117 1.375 6.18752Z"
                fill="#F8F8F8"
              />
            </g>
            <defs>
              <clipPath id="clip0_5859_1203">
                <rect width="22" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span class="button__text">{{
            !contractsStore.signature.value || !contractsStore.metamaskAccount
              ? 'Connected'
              : 'Connected'
          }}</span>
        </button>
      </div>
      <p class="account" v-if="contractsStore.metamaskAccount">
        Your address: {{ contractsStore.metamaskAccount }}
      </p>
    </div>
  </div>
</template>
