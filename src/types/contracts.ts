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

export interface IContractsStore {
  web3: Web3 | null;
  metamaskAccount: string;
  allAccounts: string[];
  signature: IContractsSignature;
  inputs: IContractsInputs;
  loading: IContractsLoading;
  transactionHash: IContractsHash;
  factory: IContractsFactory;
  deployer: IContractsDeployer;
}
