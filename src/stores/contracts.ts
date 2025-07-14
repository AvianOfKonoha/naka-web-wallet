import {defineStore} from 'pinia';
import type {
  IActiveNetwork,
  IConnectedForm,
  IContractsForms,
  IContractsLoading,
  IContractsModal,
  IContractsStore,
  IContractsWallets,
  IWallet
} from '@/types/contracts.ts';
import {Web3} from 'web3';
import {keccak256} from 'js-sha3';
import {encode} from 'rlp';
import {toast} from 'vue3-toastify';
import {NETWORKS, polygonMainnet} from '@/utils/constants.ts';
import {metamaskSdk} from '@/utils/metamask.ts';
import {isMobileChrome} from '@/utils/helpers.ts';

export const useContractsStore = defineStore('contracts', {
  state: (): IContractsStore => ({
    web3: null,
    firstSign: false,
    connectedAccount: '',
    chainId: null,
    balance: null,
    provider: null,
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
      factory: false,
      balance: false,
      withdrawConnected: false,
      withdrawExternal: false
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
    },
    modal: {
      connect: false,
      withdrawConnected: false,
      withdrawExternal: false
    },
    withdrawals: [
      {
        address: 'b432966b510533F2e57B12558C27b2DDFE7FAB',
        date: new Date(),
        amount: 20,
        status: 'ready'
      }
    ],
    form: {
      connected: {
        amount: {
          required: true,
          value: 0
        }
      }
    },
    wallets: {
      connected: {
        step: 1
      }
    }
  }),
  getters: {
    activeNetwork: (state): IActiveNetwork => {
      return {
        name:
          NETWORKS[state.chainId as keyof typeof NETWORKS].name ||
          `Unknown Chain (ID: ${state.chainId})`,
        icon:
          NETWORKS[state.chainId as keyof typeof NETWORKS].icon ||
          './img/icons/bitcoin-btc-logo.png',
        id: NETWORKS[state.chainId as keyof typeof NETWORKS].id || 'No id',
        symbol: NETWORKS[state.chainId as keyof typeof NETWORKS].symbol || ''
      };
    }
  },
  actions: {
    initializeWeb3(provider?: any) {
      this.provider = window.ethereum || provider;
      this.web3 = new Web3(this.provider);
    },

    updateLoading(loader: Partial<IContractsLoading>) {
      this.loading = {
        ...this.loading,
        ...loader
      };
    },

    updateFirstSign(signed: boolean) {
      this.firstSign = signed;
    },

    updateModal(modal: Partial<IContractsModal>) {
      this.modal = {
        ...this.modal,
        ...modal
      };
    },

    updateForm(form: Partial<IContractsForms>) {
      this.form = {
        ...this.form,
        ...form
      };
    },

    updateWallet(
      wallet: keyof IContractsWallets,
      walletData: Partial<IWallet>
    ) {
      this.wallets = {
        ...this.wallets,
        [wallet]: {
          ...this.wallets[wallet],
          ...walletData
        }
      };
    },

    updateFormField(
      value: unknown,
      form: keyof IContractsForms,
      formKey: keyof IConnectedForm,
      nestedKey?: any
    ) {
      if (nestedKey) {
        this.updateForm({
          [form]: {
            ...this.form[form],
            [formKey]: {
              ...(this.form[form] as any)[formKey],
              [nestedKey]: {
                ...(this.form[form] as any)[formKey][nestedKey],
                value: value
              }
            }
          }
        });
        return;
      }

      this.updateForm({
        [form]: {
          ...this.form[form],
          [formKey]: {
            ...(this.form[form] as any)[formKey],
            value: value
          }
        }
      });
    },

    updateChain(chainId: number) {
      this.chainId = chainId;
    },

    async getBalance() {
      if (!this.web3) {
        return;
      }

      /** Init loading */
      this.updateLoading({balance: true});

      try {
        /** Step 1: Connect to metamask and extract balance in ETH or its derivation */
        const balance = await this.web3.eth.getBalance(this.connectedAccount);
        const balanceEth = this.web3.utils.fromWei(balance, 'ether');
        this.balance = parseFloat(balanceEth).toFixed(2);

        /*TODO: Add USD conversion if necessary*/
        /** Step 2: Fetch ETH price in USD */
        /*const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${this.activeNetwork.id}&vs_currencies=usd`
        );
        const data = await res.json();
        const ethPrice = data.ethereum.usd;*/

        /** Step 3: Multiply and fragment to 2 decimal points */
        /*this.balance = (parseFloat(balanceEth) * ethPrice).toFixed(2);*/
      } catch (error) {
        console.error((error as Error).message);
      } finally {
        this.updateLoading({balance: false});
      }
    },

    async connectEthereumWallet() {
      if (!this.web3) {
        return;
      }

      try {
        /** Extract the metamask account's address and display it */
        await this.provider.request({method: 'eth_requestAccounts'});
      } catch (error) {
        toast.error(`${(error as Error).message}`);
      }
    },

    async connectMetamask() {
      if (!this.web3) {
        return;
      }

      /** Notify the user to install Metamask in case the ethereum constructor does not exist */
      if (!this.provider) {
        toast.error('Please install MetaMask!');
        return;
      }

      /** If the user has already connected their MetaMask and their address is saved to the state end propagation */
      if (this.connectedAccount && this.signature.value) {
        this.updateModal({connect: true});
        return;
      }

      try {
        /** Switch the chain to Polygon mainnet - it is the chain of the Vault SC. The call to the chain change is conditioned on two things -> #1 If the user has never connected the dApp to the MetaMask and they're not on mobile device outside Metamask or the user is on desktop device the polygon chain will be switched in metamask app/extension. #2 If the user has already connected the app to the metamask the chain switcher will commence. In any other case this step will be skipped. */
        if ((!this.firstSign && !isMobileChrome()) || this.firstSign) {
          await this.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: polygonMainnet.chainId}]
          });
        }

        /** Extract the metamask account's address and display it */
        await this.provider.request({method: 'eth_requestAccounts'});
        const accounts = await this.web3.eth.getAccounts();

        if (!accounts.length) {
          throw new Error('No accounts found.');
        }

        /** Set the state of the metamask account connected to the network */
        this.allAccounts = accounts;
        this.connectedAccount = accounts[0];

        /** Prompt a user to sign a message via their Metamask using their private key to prove ownership of their wallet without spending any tokens or sending a transaction */
        this.signature.value = await this.web3.eth.personal.sign(
          this.signature.message,
          this.connectedAccount,
          ''
        );
        sessionStorage.setItem('firstSign', 'true');

        /** Extract the chain id of the current account from the MetaMask */
        const chainId = await this.web3.eth.getChainId();
        this.updateChain(Number(chainId));

        /** Extract the balance of the current chain in USDT */
        await this.getBalance();
      } catch (error) {
        toast.error(`${(error as Error).message}`);

        if ((error as any).code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [polygonMainnet]
            });
          } catch (addError) {
            console.error('Failed to add Polygon network:', addError);
          }
        } else {
          console.error('Failed to switch network:', error);
        }
      } finally {
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
    },

    disconnectMetamask() {
      this.connectedAccount = '';
      this.chainId = null;
      this.signature.value = '';
      this.balance = null;
      sessionStorage.removeItem('firstSign');
    },

    updateNetwork() {
      /** If the metamask doesn't exist end propagation and prompt the user to install it */
      if (!this.provider) {
        return;
      }

      this.provider.on('chainChanged', async (chainId: string) => {
        if (chainId === polygonMainnet.chainId) {
          return;
        }

        /** Disconnect metamask because as of right now the Vault SC only operates on Polygon */
        this.disconnectMetamask();

        /*TODO: Uncomment if multiple networks are  allowed*/

        /** If the user has not made the first connection to the metamask wallet end propagation */
        /*if (!this.connectedAccount) {
          return;
        }*/

        /** Update chain id (network) -> The chainId that gets passed through chainChanged event is of type string and a hex format (0x...). We need to parse it to an integer in order to properly map it to its name */
        /*const parsedId = parseInt(chainId, 16);
        this.updateChain(parsedId);*/

        /** Fetch balance from the current chain */
        // await this.getBalance();
      });
    },

    onAccountsChanged() {
      /** If the metamask doesn't exist end propagation and prompt the user to install it */
      if (!this.provider) {
        return;
      }

      this.provider.on('accountsChanged', (accounts: string[]) => {
        /** If the accounts array is populated simply return and don't do anything */
        if (accounts.length) {
          return;
        }

        /** If the accounts array is empty clear the state and show the disconnected state on app */
        this.updateModal({connect: false});
        this.disconnectMetamask();
      });
    },

    async connectMobile() {
      const ethereum = metamaskSdk.getProvider();
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

      if (!ethereum || !isMobile) {
        return;
      }

      this.initializeWeb3(ethereum);
      this.updateNetwork();
      this.onAccountsChanged();
    },

    async checkConnection() {
      if (!this.web3) {
        return;
      }

      try {
        /** Fetch all connected account from the metamask */
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });

        /** Stop propagation if no accounts are connected to metamask */
        if (!accounts.length) {
          return;
        }

        /** Populated global state if metamask is already connected to one or more accounts */
        this.connectedAccount = accounts[0];
        this.allAccounts = accounts;

        /*const signedAddress = this.web3.eth.accounts.recover(
          this.signature.message,
            this.signature.value
        );*/
      } catch (error) {
        console.error('Error connecting to metamask', (error as Error).message);
      }
    },

    async submitConnectedForm() {
      /** Init loading */
      this.updateLoading({withdrawConnected: true});

      /*TODO: Update logic when the SC gets connected*/
      if (this.wallets.connected.step === 1) {
        this.updateWallet('connected', {step: 2});
        this.updateLoading({withdrawConnected: false});
        return;
      }

      /** Close the modal and reset the form  */
      this.updateModal({withdrawConnected: false});
      this.updateFormField(0, 'connected', 'amount');
      this.updateWallet('connected', {step: 1});

      try {
      } catch (error) {
        toast.error(error);
      }
    }
  }
});
