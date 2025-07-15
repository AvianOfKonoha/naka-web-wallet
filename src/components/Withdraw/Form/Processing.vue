<script setup lang="ts">
import type {IFormField} from '@/types/general.ts';

/*Props*/
const props = defineProps<{
  amountData: IFormField<number>;
}>();
</script>

<template>
  <div class="connected__form--step-process">
    <div class="modal__title">Withdraw processing</div>
    <div class="process__description">
      During this period, your selected
      <b>funds will be reserved for 1h</b> thi s is done to provide an extra
      layer of security. After the Token Reservation Period ends you can
      complete the withdraw of reserved funds by pressing on the complete
      withdraw button.
    </div>
    <div class="process__statement">
      <div class="statement__label">Amount:</div>
      <div class="statement__value">
        {{ props.amountData.value.toFixed(2) }} USD₮
      </div>
    </div>
    <div class="process__button">
      <button type="submit" aria-label="Close the modal">I understand</button>
    </div>
  </div>
</template>
