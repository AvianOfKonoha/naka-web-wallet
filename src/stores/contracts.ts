import {defineStore} from 'pinia';
import type {IContractsLoading, IContractsStore} from '@/types/contracts.ts';
import {Web3} from 'web3';
import {keccak256} from 'js-sha3';
import {encode} from 'rlp';
import {toast} from 'vue3-toastify';

export const useContractsStore = defineStore('contracts', {
  state: (): IContractsStore => ({
    web3: null,
    metamaskAccount: '',
    allAccounts: [],
    signature: {
      message: 'Please sign this message to confirm you own this wallet',
      value: ''
    },
    inputs: {
      privateKey: '',
      nonce: '',
      transactionHash: '',
      apiKey: '',
      factory: ''
    },
    loading: {
      transactionHash: false,
      factory: false
    },
    transactionHash: {
      contractAddress: ''
    },
    factory: {
      contractAddress: '',
      factoryABI: []
    },
    deployer: {
      contractAddress: ''
    }
  }),
  getters: {},
  actions: {
    initializeWeb3() {
      this.web3 = new Web3(window.ethereum);
    },

    updateLoading(loader: Partial<IContractsLoading>) {
      this.loading = {
        ...this.loading,
        ...loader
      };
    },

    async connectMetamask() {
      if (!this.web3) {
        return;
      }

      /** Notify the user to install Metamask in case the ethereum constructor does not exist */
      if (!window.ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      /*const signedAddress = this.web3.eth.accounts.recover(
        this.signature.message,
        this.signature.value
      );
      console.log('Recovered address:', signedAddress);*/

      /** If the user has already connected their MetaMask and their address is saved to the state end propagation */
      if (this.metamaskAccount && this.signature.value) {
        toast.info("You're already connected");
        return;
      }

      try {
        /** Extract the metamask account's address and display it */
        await window.ethereum.request({method: 'eth_requestAccounts'});
        const accounts = await this.web3.eth.getAccounts();

        if (!accounts.length) {
          throw new Error('No accounts found.');
        }

        /** Set the state of the metamask account connected to the network */
        this.allAccounts = accounts;
        this.metamaskAccount = accounts[0];
        this.signature.value = await this.web3.eth.personal.sign(
          this.signature.message,
          this.metamaskAccount,
          '123456'
        );
      } catch (error) {
        toast.error(`${(error as Error).message}`);
      }
    },

    /** Derive the contract address from the deployer's contract and the nonce number (the number of transactions made by the deployer) and hash it via RLP and SHA3 */
    decodeContractAddressFromDeployer(deployerAddress: string, nonce: number) {
      this.deployer.contractAddress =
        '0x' + keccak256(encode([deployerAddress, nonce || 0])).slice(24);
    },

    /** Extract the transaction receipt from the transaction has that made the smart contract and output the contract address from the receipt */
    async getContractFromDeployer() {
      /** Stop propagation if web3 is not initialized */
      if (!this.web3) {
        toast.error('Connect to metamask wallet first');
        return;
      }

      /** Stop propagation if the private key input is empty */
      if (!this.inputs.privateKey) {
        toast.error('Insert a private key');
        return;
      }

      /** Verify the private key format */
      if (
        !this.inputs.privateKey.startsWith('0x') ||
        this.inputs.privateKey.length !== 66
      ) {
        toast.error(
          'Private key must start with 0x and be 66 characters long.'
        );
        return;
      }

      /** Extract the metamask account's address */
      const account = this.web3.eth.accounts.privateKeyToAccount(
        this.inputs.privateKey
      );
      const sender = account.address;

      /** The contract address is derived from the creator’s address and their nonce. When the contract is deployed, the network computes the contract's address deterministically:
       * sender(creator's address) = the deploying account's network address (20 bytes)
       * nonce = number of transactions sent from the creator (as an integer)
       * rlp.encode([...]) = Recursive Length Prefix encoding of the array [sender, nonce]. RLP - Network’s serialization method - encodes data structures into bytes.
       * */
      this.decodeContractAddressFromDeployer(
        sender,
        parseInt(this.inputs.nonce)
      ); // last 40 hex chars

      /** TODO: Get the contract */
      // contract = new web3.eth.Contract(contractABI, contractAddress);
    },

    async getContractAddressFromTxHash() {
      if (!this.web3) {
        toast.error('Connect to metamask wallet first');
        return;
      }

      /** Get input value and remove the whitespaces */
      if (!this.inputs.transactionHash) {
        toast.error('Enter transaction hash');
        return;
      }

      /** Add a loader to the CTA */
      this.updateLoading({transactionHash: true});

      try {
        /** Extract the receipt from the transaction hash */
        const receipt = await this.web3.eth.getTransactionReceipt(
          this.inputs.transactionHash
        );

        if (!receipt.contractAddress) {
          throw new Error('Contract address does not exist');
        }

        /** Set the local state of the contract address from the receipt */
        this.transactionHash.contractAddress = receipt.contractAddress;
      } catch (error) {
        toast.error(`${(error as Error).message}`);
      } finally {
        this.updateLoading({transactionHash: false});
      }
    },

    /** Fetch an ABI from Polygon scan by attaching two dynamic parameters to the Polygon Scan API request: #1 the address of the contract and #2 your API key. You specify both in their respective input fields. */
    async getAbiFromPolygonScan(address: string) {
      /** Construct a Polygon Scan API url with two dynamic arguments */
      const apiUrl = `https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}&apikey=${this.inputs.apiKey}`;

      try {
        /** Make a request */
        const res = await fetch(apiUrl);
        const response = await res.json();

        /** If the request is not successful aka the status does not equal "1"(string) return an error */
        if (response.status !== '1') {
          throw new Error(response.result);
        }

        /** Parse the stringify ABI array */
        this.factory.factoryABI = JSON.parse(response.result);
      } catch (error) {
        toast.error(`${(error as Error).message}`);
      }
    },

    /** In order to output the Smart Contract address from the Factory contract we need to generate it from the Contract class inside the web3 instance by using the Factory contract's ABI and address. The ABI is retrieved from the Polygon scan API using your API key and the Factory contract address */
    async getContractFromFactory() {
      if (!this.web3) {
        toast.error('Connect to metamask wallet first');
        return;
      }

      if (!this.inputs.factory) {
        alert('Enter transaction hash');
        return;
      }

      /** Add a loader to the CTA */
      this.updateLoading({factory: true});

      try {
        /** Get the factory contract data with abi and address */
        await this.getAbiFromPolygonScan(this.inputs.factory);
        const factoryContract = new this.web3.eth.Contract(
          this.factory.factoryABI,
          this.inputs.factory
        );

        /** Extract the contract address made by the factory contract via methods or events */
        // Option 1: From a public array
        const contractAddress = await factoryContract.methods
          .deployedContracts(0)
          .call();
        console.log('address:', contractAddress);

        // Option 2: From an emitted event
        /*const events = await factory.getPastEvents('ContractCreated', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        console.log(events[0].returnValues.newContractAddress);
        */

        /** Output the contract address */
        /*const output = document.querySelector<HTMLElement>('.factory__output');
        if (!output) return;
        output.innerText = `Contract Address: ${contractAddress}`;*/
      } catch (error) {
        toast.error(`${(error as Error).message}`);
      } finally {
        this.updateLoading({factory: false});
      }
    }
  }
});
