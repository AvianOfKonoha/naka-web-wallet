import type {Contract, ContractAbi, Web3} from 'web3';
import type {IFormField} from '@/types/general.ts';
import type {IVaultEvent, IWithdrawRequestData} from '@/types/vault.ts';

export interface IContractsInputs {
  privateKey: string;
  nonce: string;
  transactionHash: string;
  apiKey: string;
  factory: string;
}

export interface IContractsLoading {
  transactionHash: boolean;
  factory: boolean;
  balance: boolean;
  withdrawConnected: boolean;
  withdrawExternal: boolean;
  connect: boolean;
  history: boolean;
  withdraw: boolean;
  cancelWithdraw: boolean;
  completeWithdraw: boolean;
}

export interface IContractsHash {
  contractAddress: string;
}

export interface IContractsFactory {
  contractAddress: string;
  factoryABI: ContractAbi;
}

export interface IContractsDeployer {
  contractAddress: string;
}

export interface IContractsSignature {
  message: string;
  value: string;
}

export interface IContractsModal {
  connect: boolean;
  withdrawConnected: boolean;
  withdrawExternal: boolean;
  cancelWithdraw: boolean;
  completeWithdraw: boolean;
  overtime: boolean;
}

export interface IActiveNetwork {
  name: string;
  icon: string;
  id: string;
  symbol: string;
}

export interface IWithdrawal {
  address: string;
  date: Date;
  amount: number;
  status: string;
}

export interface IConnectedForm {
  amount: IFormField<number | null>;
}

export interface IExternalForm {
  amount: IFormField<number | null>;
  address: IFormField<string>;
}

export interface IContractsForms {
  connected: IConnectedForm;
  external: IExternalForm;
}

export interface IWallet {
  step: number;
}

export interface IContractsWallets {
  connected: IWallet;
  external: IWallet;
}

export interface IContractsErrors {
  external: boolean;
  connected: boolean;
  externalAddress: boolean;
}

export interface ITransactionGas {
  gas: number;
  gasPrice: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
}

export interface IVaultBalance {
  eth: number;
  usdt: number;
}

export interface IContractsStore {
  web3: Web3 | null;
  connectedAccount: string;
  allAccounts: string[];
  chainId: number | null;
  balance: string;
  contractBalance: IVaultBalance;
  signature: IContractsSignature;
  inputs: IContractsInputs;
  loading: IContractsLoading;
  transactionHash: IContractsHash;
  factory: IContractsFactory;
  deployer: IContractsDeployer;
  modal: IContractsModal;
  provider: any;
  withdrawals: IWithdrawal[];
  firstSign: boolean;
  form: IContractsForms;
  wallets: IContractsWallets;
  error: IContractsErrors;
  vaultContract: Contract<ContractAbi> | null;
  factoryContract: Contract<ContractAbi> | null;
  transactionGas: ITransactionGas | null;
  activeRequest: IWithdrawal | null;
  lastBlock: number;
  withdrawalRequests: IVaultEvent<IWithdrawRequestData>[];
  completedWithdrawals: IWithdrawal[];
  cancelledWithdrawals: IWithdrawal[];
  vaultAddress: string;
  blocksOffset: number;
  daysOffset: number;
  thresholdPrompt: string;
}
