<script setup lang="ts">
import Loading from '@/components/Withdraw/List/Loading.vue';
import Empty from '@/components/Withdraw/List/Empty.vue';
import Withdrawal from '@/components/Withdraw/List/Withdrawal.vue';
import {useContractsStore} from '@/stores/contracts.ts';
import {ref, watch} from 'vue';

/*Constants*/
const timeList = [
  {
    text: 'Last hour',
    value: 1 / 24
  },
  {
    text: 'Today',
    value: (Date.now() - new Date().setHours(0, 0, 0, 0)) / 36e5 / 24
  },
  {
    text: '5 days',
    value: 5
  },
  {
    text: '10 days',
    value: 10
  },
  {
    text: 'This month',
    value: new Date().getDate()
  },
  {
    text: 'This year',
    value:
      Math.floor(
        (new Date().getTime() -
          new Date(new Date().getFullYear(), 0, 1).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
  }
];

/*Global state*/
const contractsStore = useContractsStore();

/*Local state*/
const days = ref(timeList[1].value);

/*Methods*/
const updateHistoryList = () => {
  if (contractsStore.loading.history) {
    return;
  }
  contractsStore.resetWithdrawalsList();
  contractsStore.updateOffsetDays(days.value);
  contractsStore.getWithdrawalHistory();
};

/*Watchers*/
watch(days, () => {
  updateHistoryList();
});
</script>

<template>
  <div class="withdraw__screen--row withdraw__screen--history">
    <div class="history__title">Withdrawal History</div>
    <div class="history__list">
      <Empty
        v-if="
          !contractsStore.withdrawals.length && !contractsStore.loading.history
        "
      />
      <div
        class="history__list--grid"
        v-if="
          contractsStore.withdrawals.length && !contractsStore.loading.history
        "
      >
        <Withdrawal
          v-for="withdrawal in contractsStore.withdrawals"
          :withdrawal="withdrawal"
        />
      </div>
      <Loading v-if="contractsStore.loading.history" />
    </div>
    <div class="history__selector">
      <label for="days">Sort by time</label>
      <select
        id="days"
        class="history__selector--select"
        v-model="days"
        :disabled="contractsStore.loading.history"
      >
        <option v-for="time in timeList" :value="time.value">
          {{ time.text }}
        </option>
      </select>
    </div>
  </div>
</template>
