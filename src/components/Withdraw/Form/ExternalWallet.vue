<script setup lang="ts">
import {useContractsStore} from '@/stores/contracts.ts';
import DefineAmount from '@/components/Withdraw/Form/DefineAmount.vue';
import DefineAddress from '@/components/Withdraw/Form/DefineAddress.vue';
import Processing from '@/components/Withdraw/Form/Processing.vue';
import Unsuccessful from '@/components/Withdraw/Form/Unsuccessful.vue';

/*Global state*/
const contractsStore = useContractsStore();

/*Methods*/
const resetAmount = () => {
  contractsStore.updateFormField(0, 'external', 'amount');
};

const resetAddress = () => {
  contractsStore.updateFormField('', 'external', 'address');
};

const onAddressChange = () => {
  contractsStore.updateError({external: false});
};

const cancelForm = () => {
  contractsStore.updateModal({withdrawExternal: false});
  contractsStore.updateError({external: false});
  contractsStore.updateLoading({withdrawExternal: false});
  contractsStore.updateWallet('external', {step: 1});
  contractsStore.updateFormField(0, 'external', 'amount');
  contractsStore.updateFormField('', 'external', 'address');
};

const setMaxAmount = () => {
  contractsStore.updateFormField(
    contractsStore.contractBalance.usdt,
    'external',
    'amount'
  );
};
</script>

<template>
  <form
    class="connected__form external__form"
    @submit.prevent="contractsStore.submitExternalForm"
  >
    <DefineAmount
      :amountData="contractsStore.form.external.amount"
      :resetAmount="resetAmount"
      :setMax="setMaxAmount"
      v-if="contractsStore.wallets.external.step === 1"
    />
    <DefineAddress
      :form="contractsStore.form.external"
      :resetAddress="resetAddress"
      :onAddressChange="onAddressChange"
      :errorActive="contractsStore.error.external"
      v-if="contractsStore.wallets.external.step === 2"
      :loading="contractsStore.loading.withdrawExternal"
    />
    <Processing
      :amountData="contractsStore.form.external.amount"
      v-if="
        contractsStore.wallets.external.step === 3 &&
        !contractsStore.error.external
      "
    />
    <Unsuccessful
      v-if="
        contractsStore.wallets.external.step === 3 &&
        contractsStore.error.external
      "
      :cancelForm="cancelForm"
      :loading="contractsStore.loading.withdrawExternal"
    />
  </form>
</template>
