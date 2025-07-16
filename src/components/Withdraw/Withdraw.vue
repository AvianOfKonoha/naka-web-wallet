<script setup lang="ts">
import NetworkIcon from '@/components/Withdraw/NetworkIcon.vue';
import Empty from '@/components/Withdraw/List/Empty.vue';
import {useContractsStore} from '@/stores/contracts.ts';
import {onMounted} from 'vue';
import {NetworkEnum, polygonMainnet} from '@/utils/constants.ts';
import {toast} from 'vue3-toastify';
import Modal from '@/components/UI/Modal.vue';
import ConnectedWallet from '@/components/Withdraw/Form/ConnectedWallet.vue';
import Withdrawal from '@/components/Withdraw/List/Withdrawal.vue';
import ExternalWallet from '@/components/Withdraw/Form/ExternalWallet.vue';
import WithdrawBox from '@/components/Withdraw/Content/WithdrawBox.vue';
import Card from '@/components/Withdraw/Content/Card.vue';

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
    contractsStore.updateChain(NetworkEnum.POLYGON);

    /** Retrieve the balance from the wallet and populate the global state */
    await contractsStore.getBalance();
  } catch (error) {
    toast.error((error as Error).message);
  }
};

const closeConnectedModal = () => {
  contractsStore.updateModal({withdrawConnected: false});
  contractsStore.updateError({connected: false});
  contractsStore.updateLoading({withdrawConnected: false});
  contractsStore.updateFormField(0, 'connected', 'amount');
  contractsStore.updateWallet('connected', {step: 1});
};

const closeExternalModal = () => {
  contractsStore.updateModal({withdrawExternal: false});
  contractsStore.updateError({external: false});
  contractsStore.updateLoading({withdrawExternal: false});
  contractsStore.updateFormField(0, 'external', 'amount');
  contractsStore.updateFormField('', 'external', 'address');
  contractsStore.updateWallet('external', {step: 1});
};

/*Lifecycle hooks*/
onMounted(() => {
  // setPolygonChain();
});
</script>

<template>
  <!-- Modal -->
  <Modal
    class="modal__withdraw--connected"
    wrapClass="modal__withdraw--wrap"
    backdropClass="modal__withdraw--backdrop"
    :closeModal="closeConnectedModal"
    :active="contractsStore.modal.withdrawConnected"
  >
    <ConnectedWallet />
  </Modal>
  <Modal
    class="modal__withdraw--connected modal__withdraw--external"
    wrapClass="modal__withdraw--wrap"
    backdropClass="modal__withdraw--backdrop"
    :closeModal="closeExternalModal"
    :active="contractsStore.modal.withdrawExternal"
  >
    <ExternalWallet />
  </Modal>

  <!-- Main -->
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
        <WithdrawBox
          @click="contractsStore.updateModal({withdrawConnected: true})"
          title="Withdraw to connected wallet"
          description="Simply withdraw your funds to the currently connected wallet in your
      browser."
          buttonText="Withdraw connected"
        />
        <WithdrawBox
          @click="contractsStore.updateModal({withdrawExternal: true})"
          title="Withdraw to external wallet"
          description="Insert an external wallet address and transfer your funds."
          buttonText="Withdraw external"
        />
        <div class="spacer"></div>
        <Card :amount="contractsStore.contractBalance" />
      </div>
      <div class="withdraw__screen--row withdraw__screen--history">
        <div class="history__title">Withdrawal History</div>
        <div class="history__list">
          <Empty v-if="!contractsStore.withdrawals.length" />
          <div
            class="history__list--grid"
            v-if="contractsStore.withdrawals.length"
          >
            <Withdrawal
              v-for="withdrawal in contractsStore.withdrawals"
              :withdrawal="withdrawal"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
