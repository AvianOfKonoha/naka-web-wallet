import {type ContractAbi, Web3} from 'web3';

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
}

export interface IActiveNetwork {
  name: string;
  icon: string;
  id: string;
  symbol: string;
}

export interface IWithdrawal {}

export interface IContractsStore {
  web3: Web3 | null;
  connectedAccount: string;
  allAccounts: string[];
  chainId: number | null;
  balance: string | null;
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
}
