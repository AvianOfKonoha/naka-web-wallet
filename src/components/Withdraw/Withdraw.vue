<script setup lang="ts">
import NetworkIcon from '@/components/Withdraw/NetworkIcon.vue';
import Empty from '@/components/Withdraw/List/Empty.vue';
import {useContractsStore} from '@/stores/contracts.ts';
import {onMounted} from 'vue';
import {NetworkEnum, polygonMainnet} from '@/utils/constants.ts';
import {toast} from 'vue3-toastify';

/*Global state*/
const contractsStore = useContractsStore();

/*Methods*/
const setPolygonChain = async () => {
  if (contractsStore.chainId === NetworkEnum.POLYGON) {
    return;
  }

  try {
    /** Set the Metamask chain to Polygon mainnet and update chain id in global state */
    await contractsStore.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: polygonMainnet.chainId}]
    });
    await contractsStore.updateChain(NetworkEnum.POLYGON);
    await contractsStore.getBalance();
  } catch (error) {
    toast.error((error as Error).message);
  }
};

onMounted(() => {
  setPolygonChain();
});
</script>

<template>
  <div class="withdraw__screen--wrap">
    <div class="withdraw__screen">
      <div class="withdraw__screen--row">
        <h1 class="withdraw__screen--title">NAKA Fund Withdrawal</h1>
        <div class="withdraw__screen--subtitle">Your funds, your control.</div>
        <div class="withdraw__screen--text">
          Choose your withdrawal method and get your funds in just a few steps.
        </div>
      </div>
      <div class="withdraw__screen--row withdraw__screen--connect">
        <div class="connect__withdraw--box">
          <div class="box__title">Withdraw to connected wallet</div>
          <div class="box__text">
            Simply withdraw your funds to the currently connected wallet in your
            browser.
          </div>
          <div class="box__chain">
            <div class="box__chain--text">Supported:</div>
            <div class="box__chain--network">
              <NetworkIcon network="polygon" />
              <span>USDt on Polygon</span>
            </div>
          </div>
          <div class="box__button">
            <button aria-label="Withdraw to connected wallet" type="button">
              <svg
                class="arrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_5950_10307)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.1402 0.859835C11.2866 1.00628 11.2866 1.24372 11.1402 1.39017L1.39017 11.1402C1.24372 11.2866 1.00628 11.2866 0.859835 11.1402C0.713388 10.9937 0.713388 10.7563 0.859835 10.6098L10.6098 0.859835C10.7563 0.713388 10.9937 0.713388 11.1402 0.859835Z"
                    fill="#F8F8F8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.25 1.125C5.25 0.917893 5.41789 0.75 5.625 0.75H10.875C11.0821 0.75 11.25 0.917893 11.25 1.125V6.375C11.25 6.58211 11.0821 6.75 10.875 6.75C10.6679 6.75 10.5 6.58211 10.5 6.375V1.5H5.625C5.41789 1.5 5.25 1.33211 5.25 1.125Z"
                    fill="#F8F8F8"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5950_10307">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="button__text">Withdraw connected</span>
            </button>
          </div>
        </div>
        <div class="connect__withdraw--box">
          <div class="box__title">Withdraw to external wallet</div>
          <div class="box__text">
            Insert an external wallet address and transfer your funds.
            SUPPORTED: USDt on Polygon Withdraw external
          </div>
          <div class="box__chain">
            <div class="box__chain--text">Supported:</div>
            <div class="box__chain--network">
              <NetworkIcon network="polygon" />
              <span>USDt on Polygon</span>
            </div>
          </div>
          <div class="box__button">
            <button aria-label="Withdraw to external wallet" type="button">
              <svg
                class="arrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_5950_10307)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.1402 0.859835C11.2866 1.00628 11.2866 1.24372 11.1402 1.39017L1.39017 11.1402C1.24372 11.2866 1.00628 11.2866 0.859835 11.1402C0.713388 10.9937 0.713388 10.7563 0.859835 10.6098L10.6098 0.859835C10.7563 0.713388 10.9937 0.713388 11.1402 0.859835Z"
                    fill="#F8F8F8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.25 1.125C5.25 0.917893 5.41789 0.75 5.625 0.75H10.875C11.0821 0.75 11.25 0.917893 11.25 1.125V6.375C11.25 6.58211 11.0821 6.75 10.875 6.75C10.6679 6.75 10.5 6.58211 10.5 6.375V1.5H5.625C5.41789 1.5 5.25 1.33211 5.25 1.125Z"
                    fill="#F8F8F8"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5950_10307">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="button__text">Withdraw external</span>
            </button>
          </div>
        </div>
        <div class="spacer"></div>
        <div class="connect__withdraw--card">
          <img
            class="card__image"
            src="/img/cardbg.webp"
            alt="Naka card"
            width="592"
            height="358"
          />
          <div class="card__logo">
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.0959 0.827637H0.344727V41.6552H9.22029V2.27361L23.4212 41.6552H41.1723V0.827637H32.2968V40.2092L18.0959 0.827637Z"
                fill="#F8F8F8"
              />
            </svg>
          </div>
          <div class="card__balance">
            <div class="card__balance--title">Balance</div>
            <div class="card__balance--value">
              <div class="value__number">120.00</div>
              <div class="value__currency">USD₮</div>
            </div>
          </div>
        </div>
      </div>
      <div class="withdraw__screen--row withdraw__screen--history">
        <div class="history__title">Withdrawal History</div>
        <div class="history__list">
          <Empty v-if="!contractsStore.withdrawals.length" />
        </div>
      </div>
    </div>
  </div>
</template>
