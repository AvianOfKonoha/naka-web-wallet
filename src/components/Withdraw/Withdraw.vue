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
import Loading from '@/components/Withdraw/List/Loading.vue';
import {bottomToast} from '@/utils/helpers.ts';

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
  contractsStore.updateFormField(null, 'connected', 'amount');
  contractsStore.updateWallet('connected', {step: 1});
};

const closeExternalModal = () => {
  contractsStore.updateModal({withdrawExternal: false});
  contractsStore.updateError({external: false});
  contractsStore.updateLoading({withdrawExternal: false});
  contractsStore.updateFormField(null, 'external', 'amount');
  contractsStore.updateFormField('', 'external', 'address');
  contractsStore.updateWallet('external', {step: 1});
};

const openConnectedModal = () => {
  /** Stop propagation if the withdrawal has already been requested and hasn't been resolved yet */
  if (contractsStore.activeRequest) {
    bottomToast(
      'You can not create multiple withdrawal requests. Confirm or cancel the existing withdrawal to create a new one.',
      5000,
      'toast__wide toast__withdrawal'
    );
    return;
  }

  contractsStore.updateModal({withdrawConnected: true});
};

const openExternalModal = () => {
  /** Stop propagation if the withdrawal has already been requested and hasn't been resolved yet */
  if (contractsStore.activeRequest) {
    bottomToast(
      'You can not create multiple withdrawal requests. Confirm or cancel the existing withdrawal to create a new one.',
      5000,
      'toast__wide toast__withdrawal'
    );
    return;
  }

  contractsStore.updateModal({withdrawExternal: true});
};

const closeCancelWithdrawModal = () => {
  contractsStore.updateModal({cancelWithdraw: false});
  contractsStore.updateLoading({cancelWithdraw: false});
};

const closeCompleteWithdrawModal = () => {
  contractsStore.updateModal({completeWithdraw: false});
  contractsStore.updateLoading({completeWithdraw: false});
};

/*Lifecycle hooks*/
onMounted(() => {
  setPolygonChain();
});
</script>

<template>
  <!-- Modal -->

  <!-- Connected wallet -->
  <Modal
    class="modal__withdraw--connected"
    wrapClass="modal__withdraw--wrap"
    backdropClass="modal__withdraw--backdrop"
    :closeModal="closeConnectedModal"
    :active="contractsStore.modal.withdrawConnected"
  >
    <ConnectedWallet />
  </Modal>

  <!-- External wallet -->
  <Modal
    class="modal__withdraw--connected modal__withdraw--external"
    wrapClass="modal__withdraw--wrap"
    backdropClass="modal__withdraw--backdrop"
    :closeModal="closeExternalModal"
    :active="contractsStore.modal.withdrawExternal"
  >
    <ExternalWallet />
  </Modal>

  <!-- Complete withdraw -->
  <Modal
    :closeModal="closeCompleteWithdrawModal"
    wrapClass="modal__withdraw--wrap-complete"
    class="modal__withdrawal--complete"
    :active="contractsStore.modal.completeWithdraw"
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
        @click="contractsStore.completeWithdraw"
      >
        Complete withdrawal
        <span class="loader" v-if="contractsStore.loading.withdraw">
          <span></span><span></span>
        </span>
      </button>
    </div>
  </Modal>

  <!-- Cancel withdraw -->
  <Modal
    :closeModal="closeCancelWithdrawModal"
    wrapClass="modal__withdraw--wrap-complete"
    class="modal__withdrawal--complete modal__withdrawal--cancel"
    :active="contractsStore.modal.cancelWithdraw"
  >
    <div class="modal__title">Cancel Withdrawal Request</div>
    <div class="complete__description">
      Please note that a small gas fee is required to complete your
      cancellation. This fee ensures the secure and timely processing of your
      transaction. You can complete the withdrawal process after confirming the
      payment of the gas fee. Thank you for your understanding.
    </div>
    <div class="cancel__button">
      <button
        type="button"
        aria-label="Cancel withdrawal request"
        @click="contractsStore.cancelWithdrawRequest"
      >
        Cancel withdrawal request
        <span class="loader" v-if="contractsStore.loading.cancelWithdraw">
          <span></span><span></span>
        </span>
      </button>
    </div>
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
          @click="openConnectedModal"
          title="Withdraw to connected wallet"
          description="Simply withdraw your funds to the currently connected wallet in your
      browser."
          buttonText="Withdraw connected"
        />
        <WithdrawBox
          @click="openExternalModal"
          title="Withdraw to external wallet"
          description="Insert an external wallet address and transfer your funds."
          buttonText="Withdraw external"
        />
        <div class="spacer"></div>
        <Card :amount="contractsStore.contractBalance.usdt" />
      </div>
      <div class="withdraw__screen--row withdraw__screen--history">
        <div class="history__title">Withdrawal History</div>
        <div class="history__list">
          <Empty
            v-if="
              !contractsStore.withdrawals.length &&
              !contractsStore.loading.history
            "
          />
          <div
            class="history__list--grid"
            v-if="
              contractsStore.withdrawals.length &&
              !contractsStore.loading.history
            "
          >
            <Withdrawal
              v-for="withdrawal in contractsStore.withdrawals"
              :withdrawal="withdrawal"
            />
          </div>
          <Loading v-if="contractsStore.loading.history" />
        </div>
      </div>
    </div>
  </div>
</template>
