import {defineStore} from 'pinia';
import type {
  IActiveNetwork,
  IConnectedForm,
  IContractsErrors,
  IContractsForms,
  IContractsLoading,
  IContractsModal,
  IContractsStore,
  IContractsWallets,
  IExternalForm,
  IWallet
} from '@/types/contracts.ts';
import {Web3} from 'web3';
import {keccak256} from 'js-sha3';
import {encode} from 'rlp';
import {toast} from 'vue3-toastify';
import {
  CONTRACT_ADDRESS_STAGING,
  NETWORKS,
  polygonMainnet,
  USDT_ADDRESS_STAGING
} from '@/utils/constants.ts';
import {metamaskSdk} from '@/utils/metamask.ts';
import VaultABI from '@/assets/abi/Vault.json';
import VaultRegistryABI from '@/assets/abi/VaultRegistry.json';
import type {IVaultBalance} from '@/types/vault.ts';
import {
  bottomToast,
  formatNumberToUint256,
  formatUint256toNumber
} from '@/utils/helpers.ts';

export const useContractsStore = defineStore('contracts', {
  state: (): IContractsStore => ({
    web3: null,
    firstSign: false,
    connectedAccount: '',
    chainId: null,
    balance: '',
    contractBalance: {
      eth: 0,
      usdt: 0
    },
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
      withdrawExternal: false,
      connect: false,
      history: false,
      withdraw: false
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
    withdrawals: [],
    form: {
      connected: {
        amount: {
          required: true,
          value: null
        }
      },
      external: {
        amount: {
          required: true,
          value: null
        },
        address: {
          required: true,
          value: ''
        }
      }
    },
    wallets: {
      connected: {
        step: 1
      },
      external: {
        step: 1
      }
    },
    error: {
      external: false,
      connected: false,
      externalAddress: false
    },
    factoryContract: null,
    vaultContract: null,
    transactionGas: null,
    activeRequest: null
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

    updateError(error: Partial<IContractsErrors>) {
      this.error = {
        ...this.error,
        ...error
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

    resetConnectedForm() {
      this.updateError({connected: false});
      this.updateWallet('connected', {step: 1});
      this.updateFormField(null, 'connected', 'amount');
    },

    resetExternalForm() {
      this.updateError({external: false});
      this.updateWallet('external', {step: 1});
      this.updateFormField(null, 'external', 'amount');
      this.updateFormField('', 'external', 'address');
    },

    updateFormField(
      value: unknown,
      form: keyof IContractsForms,
      formKey: keyof (IConnectedForm & IExternalForm),
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

    async convertToUsdt(balanceEth: string) {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${this.activeNetwork.id}&vs_currencies=usd`
        );
        const data = await res.json();
        const ethPrice = data.ethereum.usd;

        return (parseFloat(balanceEth) * parseFloat(ethPrice)).toFixed(2);
      } catch (error) {
        console.error('Error converting to USDT: ', (error as Error).message);
      }
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
        console.error(error);
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
        toast.info('no Web3 provided');
        return;
      }

      /** Notify the user to install Metamask in case the ethereum constructor does not exist */
      if (!this.provider) {
        toast.error('Please install MetaMask!');
        return;
      }

      /** Stop propagation if the loading is already in process */
      if (this.loading.connect) {
        return;
      }

      /** If the user has already connected their MetaMask, signed the wallet and created a Vault contract, end propagation */
      if (this.vaultContract && !this.loading.connect) {
        this.updateModal({connect: true});
        return;
      }

      /** Init loading */
      this.updateLoading({connect: true});

      try {
        /** Switch the chain to Polygon mainnet - it is the chain of the Vault SC. The call to the chain change is conditioned on two things -> #1 If the user has never connected the dApp to the MetaMask and they're not on mobile device outside Metamask or the user is on desktop device the polygon chain will be switched in metamask app/extension. #2 If the user has already connected the app to the metamask the chain switcher will commence. In any other case this step will be skipped. */
        /*TODO: uncomment when you're ready to deploy to prod*/
        /*if ((!this.firstSign && !isMobileChrome()) || this.firstSign) {
          await this.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: polygonMainnet.chainId}]
          });
        }*/

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

        /** Make a connection to the Vault Smart Contract - Check if the metamask address has already made a contract. In case it hasn't, create a new Vault contract. Finally, save the contract to the global state */
        await this.connectContract();
      } catch (error) {
        if ((error as any).cause?.code !== 4902) {
          toast.error(`${(error as Error).message}`);
          return;
        }

        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [polygonMainnet]
          });
        } catch (addError) {
          console.error('Failed to add Polygon network:', addError);
        }
      } finally {
        this.updateLoading({connect: false});
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
      this.balance = '';
      this.contractBalance = {
        eth: 0,
        usdt: 0
      };
      this.vaultContract = null;
      this.factoryContract = null;
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
      } catch (error) {
        console.error('Error connecting to metamask', (error as Error).message);
      }
    },

    async getEstimatedGas() {
      if (!this.web3) {
        return;
      }

      /** Initialize the last number of block to filter through on block explorer */
      const blocksToScan = 30;

      try {
        /** Fetch the latest block */
        const latest = await this.web3.eth.getBlockNumber();

        /** Set the array to be populated with gas */
        const gasUsed = [];

        /** Fill in the gas used in the last 30 blocks */
        for (let i = 0; i < blocksToScan; i++) {
          const block = await this.web3.eth.getBlock(Number(latest) - i, true);

          for (const tx of block.transactions) {
            // 1️⃣  must target our VaultRegistry
            // 2️⃣  must have the createVault method selector
            // const receipt = await this.web3.eth.getTransactionReceipt(tx.hash);
            gasUsed.push({
              gas: Number(tx['gas' as keyof typeof tx]),
              gasPrice: Number(tx['gasPrice' as keyof typeof tx]),
              maxFeePerGas: Number(tx['maxFeePerGas' as keyof typeof tx]),
              maxPriorityFeePerGas: Number(
                tx['maxPriorityFeePerGas' as keyof typeof tx]
              )
            });
          }
        }

        if (!gasUsed.length) {
          throw new Error('No createVault txs found in last 30 blocks');
        }

        this.transactionGas = {
          gas: Math.floor(
            gasUsed
              .filter((item) => !isNaN(item.gas))
              .reduce((a, b) => a + b.gas, 0) / gasUsed.length
          ),
          gasPrice: Math.floor(
            gasUsed
              .filter((item) => !isNaN(item.gasPrice))
              .reduce((a, b) => a + b.gasPrice, 0) / gasUsed.length
          ),
          maxFeePerGas: Math.floor(
            gasUsed
              .filter((item) => !isNaN(item.maxFeePerGas))
              .reduce((a, b) => a + b.maxFeePerGas, 0) / gasUsed.length
          ),
          maxPriorityFeePerGas: Math.floor(
            gasUsed
              .filter((item) => !isNaN(item.maxPriorityFeePerGas))
              .reduce((a, b) => a + b.maxPriorityFeePerGas, 0) / gasUsed.length
          )
        };
      } catch (error) {
        console.error('Error estimating gas: ', (error as Error).message);
      }
    },

    async submitConnectedForm() {
      if (
        this.loading.withdrawConnected ||
        !this.form.connected.amount.value ||
        this.contractBalance.usdt < this.form.connected.amount.value ||
        !this.vaultContract
      ) {
        return;
      }

      /** If the request for withdrawal failed the user has been sent to the retry screen. The retry function takes the user back to the beginning of the form and resets the state */
      if (this.error.connected) {
        this.resetConnectedForm();
        return;
      }

      /** Init loading */
      this.updateLoading({withdrawConnected: true});

      try {
        /** Fetch the reserved withdrawal request amount and unlock time from the smart contract */
        const reservationStatus: {amount: bigint; unlockTime: bigint} =
          await this.vaultContract.methods
            .getWithdrawProtocolTokenReservation()
            .call();

        /** Stop propagation if the withdrawal has already been requested and hasn't been resolved yet */
        if (Number(reservationStatus.amount) > 0) {
          bottomToast(
            'You can not create multiple withdrawal requests.\nConfirm or cancel the existing withdrawal to create a new one.',
            5000,
            'toast__wide toast__withdrawal'
          );
          return;
        }

        /** On amount screen call the "withdrawRequest" method from the Vault SC. On success the withdraw request is pending for an hour before the user can complete it */
        if (this.wallets.connected.step === 1) {
          /** Make a withdrawal request to Vault SC */
          await this.vaultContract.methods
            .withdrawRequest(
              USDT_ADDRESS_STAGING,
              this.connectedAccount,
              formatNumberToUint256(this.form.connected.amount.value, 6)
            )
            .send({
              from: this.connectedAccount,
              gas: this.transactionGas?.gas
                ? `${this.transactionGas.gas}`
                : undefined,
              maxFeePerGas: this.transactionGas?.maxFeePerGas
                ? `${this.transactionGas.maxFeePerGas}`
                : undefined,
              maxPriorityFeePerGas: this.transactionGas?.maxPriorityFeePerGas
                ? `${this.transactionGas.maxPriorityFeePerGas}`
                : undefined
            });

          /** Proceed to the next step */
          this.updateWallet('connected', {step: 2});

          /** Update global state for Vault balance */
          await this.getVaultBalance();
          return;
        }

        /** Close the modal and reset the form  */
        this.updateModal({withdrawConnected: false});
        this.updateFormField(null, 'connected', 'amount');
        this.updateWallet('connected', {step: 1});
        await this.getWithdrawalHistory();
      } catch (error) {
        console.error('Error submitting form: ', (error as Error).message);
        toast.error(`${(error as Error).message}`);
        this.updateError({connected: true});
        this.updateLoading({withdrawConnected: false});

        /** Estimate gas from the last 30 blocks on the chain */
        await this.getEstimatedGas();
      } finally {
        this.updateLoading({withdrawConnected: false});
      }
    },

    async submitExternalForm() {
      if (
        this.loading.withdrawExternal ||
        !this.form.external.amount.value ||
        !this.vaultContract ||
        this.contractBalance.usdt < this.form.external.amount.value ||
        !this.form.external.amount.value
      ) {
        return;
      }

      /** If the request for withdrawal failed the user has been sent to the retry screen. The retry function takes the user back to the beginning of the form and resets the state */
      if (this.error.external) {
        this.resetExternalForm();
        return;
      }

      /** Init loading */
      this.updateLoading({withdrawExternal: true});

      try {
        /** Fetch the reserved withdrawal request amount and unlock time from the smart contract */
        const reservationStatus: {amount: bigint; unlockTime: bigint} =
          await this.vaultContract.methods
            .getWithdrawProtocolTokenReservation()
            .call();

        /** Stop propagation if the withdrawal has already been requested and hasn't been resolved yet */
        if (Number(reservationStatus.amount) > 0) {
          bottomToast(
            'You can not create multiple withdrawal requests.\nConfirm or cancel the existing withdrawal to create a new one.',
            5000,
            'toast__wide toast__withdrawal'
          );
          return;
        }

        /** On amount screen call the "withdrawRequest" method from the Vault SC. On success the withdraw request is pending for an hour before the user can complete it */
        if (this.wallets.external.step === 1) {
          this.updateWallet('external', {step: 2});
          return;
        }

        if (this.wallets.external.step === 2) {
          /** Make a withdrawal request to Vault SC */
          await this.vaultContract.methods
            .withdrawRequest(
              USDT_ADDRESS_STAGING,
              this.form.external.address.value,
              formatNumberToUint256(this.form.external.amount.value, 6)
            )
            .send({
              from: this.connectedAccount,
              gas: this.transactionGas?.gas
                ? `${this.transactionGas.gas}`
                : undefined,
              maxFeePerGas: this.transactionGas?.maxFeePerGas
                ? `${this.transactionGas.maxFeePerGas}`
                : undefined,
              maxPriorityFeePerGas: this.transactionGas?.maxPriorityFeePerGas
                ? `${this.transactionGas.maxPriorityFeePerGas}`
                : undefined
            });

          /** Proceed to the next step */
          this.updateWallet('external', {step: 3});

          /** Update global state for Vault balance */
          await this.getVaultBalance();
          return;
        }

        /** Close the modal and reset the form  */
        this.updateModal({withdrawExternal: false});
        this.updateFormField(null, 'external', 'amount');
        this.updateFormField('', 'external', 'address');
        this.updateWallet('external', {step: 1});
        await this.getWithdrawalHistory();
      } catch (error) {
        console.error('Error submitting form: ', (error as Error).message);
        toast.error(`${(error as Error).message}`);
        this.updateError({external: true});
        this.updateLoading({withdrawExternal: false});

        /** Estimate gas from the last 30 blocks on the chain */
        await this.getEstimatedGas();
      } finally {
        this.updateLoading({withdrawExternal: false});
      }
    },

    async getVaultBalance() {
      if (!this.vaultContract) {
        return;
      }

      try {
        /** Set the balance (in USDT) by calling the "getProtocolTokenBalances" from the Vault SC */
        const balance: IVaultBalance = await this.vaultContract.methods
          .getProtocolTokenBalances()
          .call();

        const converted = formatUint256toNumber(balance.avaliableBalance, 6);

        this.contractBalance = {
          ...this.contractBalance,
          usdt: converted
        };
      } catch (error) {
        console.error(
          'Error fetching vault balance: ',
          (error as Error).message
        );
      }
    },

    async getActiveRequest() {
      if (!this.factoryContract || !this.web3) {
        return;
      }

      try {
        /** Fetch a lock duration of the withdrawal request from the factory contract */
        const lockDuration: bigint = await this.factoryContract.methods
          .getProtocolTokenWithdrawalReservationLockDuration()
          .call();

        /** Get all events from the requests made with withdrawRequest methods. The event contains an unclock time and an amount requested to withdraw but no recipient address */
        const withdrawalRequests = await (
          this.vaultContract as any
        ).getPastEvents('WithdrawRequest', {
          fromBlock: 23988284,
          toBlock: 'latest'
        });

        /** Take the latest WithdrawalRequest event as the active request */
        const activeRequest = withdrawalRequests?.reverse()?.[0];

        if (!activeRequest) {
          return;
        }

        /** In order to access the recipient address used as a second argument in withdrawRequest method we need to first access the transaction from the web3. The transactionHash used to index a transaction can be found in the emitted event WithdrawRequest */
        const activeRequestTransaction: any =
          await this.web3.eth.getTransaction(activeRequest.transactionHash);

        /** Decode the parameters in abi in order to access the recipient address. withdrawRequest takes in three arguments - token address, recipient's address and an amount. */
        const decodedInput = this.web3.eth.abi.decodeParameters(
          ['address', 'address', 'uint256'],
          '0x' + activeRequestTransaction.input.slice(10)
        );

        /** By default, the unlockTime fetched from the SC is of type bigint. Once converted to the number it shows the time in seconds. First we need to multiply it with 1000 to convert it to milliseconds, then we can use Date to mutate it */
        this.activeRequest = {
          address: `${decodedInput[1]}`, //Recipients address
          amount: formatUint256toNumber(activeRequest.returnValues.amount, 6),
          date: new Date(
            (Number(activeRequest.returnValues.unlockTime) -
              Number(lockDuration)) *
              1000
          ),
          status:
            Number(activeRequest.returnValues.unlockTime) * 1000 < Date.now()
              ? 'ready'
              : 'pending'
        };
      } catch (error) {
        console.error(
          'Error fetching active request: ',
          (error as Error).message
        );
      }
    },

    async getWithdrawalHistory() {
      if (!this.vaultContract || !this.factoryContract || !this.web3) {
        return;
      }

      /** Init loading */
      this.updateLoading({history: true});

      try {
        /** Fetch the reserved withdrawal request amount and unlock time from the smart contract */
        const reservationStatus: {amount: bigint; unlockTime: bigint} =
          await this.vaultContract.methods
            .getWithdrawProtocolTokenReservation()
            .call();

        /** Fetch all "Withdrawal" events that manifest after successful "withdraw" method requests from the Vault contract */
        const withdrawals = await (this.vaultContract as any).getPastEvents(
          'Withdrawal',
          {
            fromBlock: 23988284,
            toBlock: 'latest'
          }
        );

        await this.getActiveRequest();

        /** Map the withdrawals by adding a timestamp to the object from withdrawal block */
        const constructedWithdrawals = withdrawals.map(
          async (withdrawal: any) => {
            if (!this.web3) {
              return;
            }

            const block = await this.web3.eth.getBlock(withdrawal.blockNumber);
            const timestamp = block.timestamp;

            return {
              address: withdrawal.returnValues.recipient, //Recipients address
              amount: formatUint256toNumber(withdrawal.returnValues.amount, 6),
              date: new Date(Number(timestamp) * 1000),
              status: 'complete'
            };
          }
        );

        /** Resolve mapping promises */
        const resolvedConstructedWithdrawals = await Promise.all(
          constructedWithdrawals
        );

        /** save the withdrawal requests and withdrawals in global state and sort them by date */
        this.withdrawals =
          Number(reservationStatus.amount) > 0
            ? [
                this.activeRequest,
                ...resolvedConstructedWithdrawals.sort(
                  (a, b) => b.date - a.date
                )
              ]
            : resolvedConstructedWithdrawals.sort((a, b) => b.date - a.date);
      } catch (error) {
        console.error(
          'Error fetching withdrawal history: ',
          (error as Error).message
        );
      } finally {
        this.updateLoading({history: false});
      }
    },

    async setVaultContract(address: string) {
      if (!this.web3) {
        return;
      }

      try {
        /** Set the vault contract state from vault abi and vault address fetched from Vault SC */
        this.vaultContract = new this.web3.eth.Contract(VaultABI, address);

        /** Get the list of all withdrawals */
        await this.getWithdrawalHistory();

        /** Fetch Vault balance */
        await this.getVaultBalance();
      } catch (error) {
        console.error(
          'Error setting vault contract: ',
          (error as Error).message
        );
      }
    },

    async connectContract() {
      if (!this.web3) {
        return;
      }

      /** Initialize factory contract by providing the registry ABI and the factory contract's address to the contract class then save it to the global state */
      this.factoryContract = new this.web3.eth.Contract(
        VaultRegistryABI,
        CONTRACT_ADDRESS_STAGING //TODO: replace contract with production on deploy
      );

      const loadingToast = toast.loading('Connecting to the contract...');

      try {
        /** Check if the currently connected wallet address already created a Vault smart contract. Stop propagation if so, otherwise create a new Vault smart contract. */
        const vaultAddress: string = await this.factoryContract.methods
          .getVaultAddressByOwner(this.connectedAccount)
          .call();
        const vaultExists = parseInt(vaultAddress, 16);

        /** If the Vault contract has already been created stop propagation otherwise proceed to Vault creation */
        if (vaultExists) {
          /** Remove loader */
          await this.setVaultContract(vaultAddress);
          toast.remove(loadingToast);
          return;
        }

        /** Estimate gas from the last 30 blocks on the chain */
        await this.getEstimatedGas();

        /** Make a request to "createVault" method on the factory contract to create a new Vault contract that will connect to the wallet address and the user will be able to withdraw funds from */

        const tx = await this.factoryContract.methods
          .createVault(this.connectedAccount)
          .send({
            from: this.connectedAccount,
            gas: this.transactionGas?.gas
              ? `${this.transactionGas.gas}`
              : undefined,
            maxFeePerGas: this.transactionGas?.maxFeePerGas
              ? `${this.transactionGas.maxFeePerGas}`
              : undefined,
            maxPriorityFeePerGas: this.transactionGas?.maxPriorityFeePerGas
              ? `${this.transactionGas.maxPriorityFeePerGas}`
              : undefined
          });

        if (!tx.events) {
          throw new Error(
            'Something went wrong while creating the Vault contract. Try again.'
          );
        }

        await this.setVaultContract(tx.events.ContractInitialized.address);

        toast.remove(loadingToast);
        toast.success(`Vault contract successfully created:`);
      } catch (error) {
        toast.remove(loadingToast);

        if ((error as any).cause?.code === -32603) {
          toast.error("Couldn't connect to the contract.");
          return;
        }

        toast.error(
          (error as Error).message.replace(
            'Returned error: MetaMask Tx Signature: ',
            ''
          )
        );
        console.error('Error connecting to Vault: ', (error as Error).message);
      }
    },

    async withdrawFunds(
      recipientAddress: string,
      amount: number,
      callback?: () => void
    ) {
      if (!this.vaultContract || this.loading.withdraw) {
        return;
      }

      /** Init loading */
      this.updateLoading({withdraw: true});

      try {
        await this.vaultContract.methods
          .withdraw(
            USDT_ADDRESS_STAGING,
            recipientAddress,
            formatNumberToUint256(amount, 6)
          )
          .send({
            from: this.connectedAccount,
            gas: this.transactionGas?.gas
              ? `${this.transactionGas.gas}`
              : undefined,
            maxFeePerGas: this.transactionGas?.maxFeePerGas
              ? `${this.transactionGas.maxFeePerGas}`
              : undefined,
            maxPriorityFeePerGas: this.transactionGas?.maxPriorityFeePerGas
              ? `${this.transactionGas.maxPriorityFeePerGas}`
              : undefined
          });

        await this.getWithdrawalHistory();

        if (callback) {
          callback();
        }

        bottomToast(
          `Withdraw to: ${recipientAddress.substring(0, 4)}...${recipientAddress.slice(-4)} has been successfully completed.`,
          3000,
          'toast__wide toast__withdrawal'
        );
      } catch (error) {
        console.error('Error withdrawing funds: ', (error as Error).message);
        toast.error(`${(error as Error).message}`);
        this.updateLoading({withdraw: false});
        await this.getEstimatedGas();
      } finally {
        this.updateLoading({withdraw: false});
      }
    }
  }
});
