export interface IVaultBalance {
  avaliableBalance: bigint;
  balance: bigint;
  processPaymentReservation: bigint;
  withdrawalReservation: bigint;
}

export interface IReservation {
  amount: bigint;
  unlockTime: bigint;
}
