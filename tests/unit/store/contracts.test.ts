import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {toast} from 'vue3-toastify';
import {useContractsStore} from '@/stores/contracts.ts';
import {avalancheMainnet, CHAINS, polygonMainnet} from '@/utils/constants.ts';

/** vue3-toastify — the store fires toasts on most error paths */
vi.mock('vue3-toastify', () => {
  const toastFn = Object.assign(vi.fn(), {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    remove: vi.fn()
  });
  return {toast: toastFn};
});

/** MetaMask SDK instantiates transports at import time — stub it out */
vi.mock('@/utils/metamask.ts', () => ({
  metamaskSdk: {getProvider: vi.fn(() => null)},
  provider: null
}));

/** Web3 constructor mock — instances expose what initializeWeb3 touches */
const mockGetChainId = vi.fn();
vi.mock('web3', () => {
  class MockWeb3 {
    provider: unknown;
    eth = {
      getChainId: mockGetChainId,
      getBalance: vi.fn(),
      Contract: class {}
    };
    utils = {fromWei: vi.fn()};
    constructor(provider: unknown) {
      this.provider = provider;
    }
  }
  return {Web3: MockWeb3, Contract: class {}};
});

const polygonChain = CHAINS.find((chain) => chain.id === 137)!;
const avaxChain = CHAINS.find((chain) => chain.id === 43114)!;

const makeProvider = () => ({
  on: vi.fn(),
  request: vi.fn()
});

describe('contracts store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorage.clear();
  });

  describe('getters', () => {
    describe('activeNetwork', () => {
      it('falls back to an unknown-chain placeholder when no chain is set', () => {
        const store = useContractsStore();
        expect(store.activeNetwork).toEqual({
          name: 'Unknown Chain',
          icon: './img/icons/bitcoin-btc-logo.png',
          id: '/',
          symbol: ''
        });
      });

      it('maps the active Polygon chain to its network metadata', () => {
        const store = useContractsStore();
        store.activeChain = polygonChain;
        expect(store.activeNetwork).toEqual({
          name: 'Polygon',
          icon: './img/icons/polygon-matic-logo.png',
          id: 'polygon',
          symbol: 'POL'
        });
      });

      it('maps the active Avalanche chain to its network metadata', () => {
        const store = useContractsStore();
        store.activeChain = avaxChain;
        expect(store.activeNetwork.name).toBe('Avalanche (C-Chain)');
        expect(store.activeNetwork.symbol).toBe('AVAX');
      });
    });

    describe('selectedCurrency', () => {
      it('is undefined when no chain is active', () => {
        const store = useContractsStore();
        expect(store.selectedCurrency).toBeUndefined();
      });

      it('resolves the name of the selected currency token', () => {
        const store = useContractsStore();
        store.activeChain = polygonChain;
        store.currencyToken = polygonChain.currencies[1].value;
        expect(store.selectedCurrency).toBe('USDC');
      });

      it('falls back to the first currency when the token is unknown', () => {
        const store = useContractsStore();
        store.activeChain = polygonChain;
        store.currencyToken = '0xdeadbeef';
        expect(store.selectedCurrency).toBe(polygonChain.currencies[0].name);
      });
    });
  });

  describe('initializeWeb3', () => {
    it('sets chain, tokens, currency and rpc from the detected chain id', async () => {
      const store = useContractsStore();
      const provider = makeProvider();
      mockGetChainId.mockResolvedValue(137n);

      await store.initializeWeb3(provider);

      expect(store.activeChain?.id).toBe(137);
      expect(store.tokens).toEqual([polygonChain.currencies[0]]);
      expect(store.currencyToken).toBe(polygonChain.currencies[0].value);
      expect(store.rpc).toEqual(polygonChain.rpcs[0]);
    });

    it('registers chainChanged and accountsChanged listeners', async () => {
      const store = useContractsStore();
      const provider = makeProvider();
      mockGetChainId.mockResolvedValue(137n);

      await store.initializeWeb3(provider);

      const events = provider.on.mock.calls.map((call) => call[0]);
      expect(events).toContain('chainChanged');
      expect(events).toContain('accountsChanged');
    });

    it('leaves chain state untouched for an unsupported chain id', async () => {
      const store = useContractsStore();
      const provider = makeProvider();
      mockGetChainId.mockResolvedValue(1n);

      await store.initializeWeb3(provider);

      expect(store.activeChain).toBeNull();
      expect(store.currencyToken).toBe('');
    });
  });

  describe('updateChain', () => {
    it('switches the chain by hex id and resets tokens and rpc', () => {
      const store = useContractsStore();
      store.updateChain(avalancheMainnet.chainId);

      expect(store.activeChain?.id).toBe(43114);
      expect(store.tokens).toEqual([avaxChain.currencies[0]]);
      expect(store.currencyToken).toBe(avaxChain.currencies[0].value);
      expect(store.rpc).toEqual(avaxChain.rpcs[0]);
    });

    it('is a no-op for an unknown hex id', () => {
      const store = useContractsStore();
      store.activeChain = polygonChain;
      store.updateChain('0x1');
      expect(store.activeChain.id).toBe(137);
    });
  });

  describe('form state', () => {
    it('updateFormField sets the connected amount', () => {
      const store = useContractsStore();
      store.updateFormField(42, 'connected', 'amount');
      expect(store.form.connected.amount.value).toBe(42);
    });

    it('updateFormField sets the external address', () => {
      const store = useContractsStore();
      store.updateFormField('0xabc', 'external', 'address');
      expect(store.form.external.address.value).toBe('0xabc');
    });

    it('updateWallet merges partial wallet data', () => {
      const store = useContractsStore();
      store.updateWallet('external', {step: 3});
      expect(store.wallets.external.step).toBe(3);
      expect(store.wallets.connected.step).toBe(1);
    });

    it('updateLoading and updateModal merge partials without clobbering', () => {
      const store = useContractsStore();
      store.updateLoading({connect: true});
      store.updateModal({withdrawExternal: true});

      expect(store.loading.connect).toBe(true);
      expect(store.loading.history).toBe(false);
      expect(store.modal.withdrawExternal).toBe(true);
      expect(store.modal.connect).toBe(false);
    });
  });

  describe('resetConnectedForm', () => {
    it('resets step, amount, error and loading', () => {
      const store = useContractsStore();
      store.updateFormField(10, 'connected', 'amount');
      store.updateError({connected: true});
      store.updateLoading({withdrawConnected: true});

      store.resetConnectedForm();

      expect(store.wallets.connected.step).toBe(1);
      expect(store.form.connected.amount.value).toBeNull();
      expect(store.error.connected).toBe(false);
      expect(store.loading.withdrawConnected).toBe(false);
    });

    it('refreshes the withdrawal list when leaving the success step', () => {
      const store = useContractsStore();
      const refreshSpy = vi
        .spyOn(store, 'getWithdrawalHistory')
        .mockResolvedValue();
      store.updateWallet('connected', {step: 2});

      store.resetConnectedForm();

      expect(refreshSpy).toHaveBeenCalledOnce();
    });

    it('does not refresh the list from step 1', () => {
      const store = useContractsStore();
      const refreshSpy = vi
        .spyOn(store, 'getWithdrawalHistory')
        .mockResolvedValue();

      store.resetConnectedForm();

      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetExternalForm', () => {
    it('resets step, fields, error and loading', () => {
      const store = useContractsStore();
      store.updateFormField(10, 'external', 'amount');
      store.updateFormField('0xabc', 'external', 'address');
      store.updateWallet('external', {step: 2});
      store.updateError({external: true});

      store.resetExternalForm();

      expect(store.wallets.external.step).toBe(1);
      expect(store.form.external.amount.value).toBeNull();
      expect(store.form.external.address.value).toBe('');
      expect(store.error.external).toBe(false);
    });

    it('refreshes the withdrawal list only from the success step', () => {
      const store = useContractsStore();
      const refreshSpy = vi
        .spyOn(store, 'getWithdrawalHistory')
        .mockResolvedValue();
      store.updateWallet('external', {step: 3});

      store.resetExternalForm();

      expect(refreshSpy).toHaveBeenCalledOnce();
    });
  });

  describe('resetWithdrawalsList', () => {
    it('clears the active request and all withdrawal lists', () => {
      const store = useContractsStore();
      store.activeRequest = {
        address: '0xabc',
        amount: 1,
        date: new Date(),
        status: 'pending',
        token: '0xdef'
      };
      store.withdrawals = [store.activeRequest];
      store.completedWithdrawals = [store.activeRequest];
      store.cancelledWithdrawals = [store.activeRequest];

      store.resetWithdrawalsList();

      expect(store.activeRequest).toBeNull();
      expect(store.withdrawals).toEqual([]);
      expect(store.completedWithdrawals).toEqual([]);
      expect(store.cancelledWithdrawals).toEqual([]);
    });
  });

  describe('disconnectMetamask', () => {
    it('clears the wallet session and removes the firstSign flag', () => {
      const store = useContractsStore();
      sessionStorage.setItem('firstSign', 'true');
      store.connectedAccount = '0xabc';
      store.vaultAddress = '0xdef';
      store.balance = '1.5';
      store.contractBalance = {eth: 1, usdt: 100};

      store.disconnectMetamask();

      expect(store.connectedAccount).toBe('');
      expect(store.vaultAddress).toBe('');
      expect(store.balance).toBe('');
      expect(store.contractBalance).toEqual({eth: 0, usdt: 0});
      expect(store.vaultContract).toBeNull();
      expect(store.factoryContract).toBeNull();
      expect(sessionStorage.getItem('firstSign')).toBeNull();
    });
  });

  describe('getBalance', () => {
    it('formats the fetched balance to five decimals and toggles loading', async () => {
      const store = useContractsStore();
      store.connectedAccount = '0xabc';
      store.web3 = {
        eth: {getBalance: vi.fn().mockResolvedValue(1500000000000000000n)},
        utils: {fromWei: vi.fn().mockReturnValue('1.5')}
      } as never;

      await store.getBalance();

      expect(store.balance).toBe('1.50000');
      expect(store.loading.balance).toBe(false);
    });

    it('does nothing without a web3 instance', async () => {
      const store = useContractsStore();
      await store.getBalance();
      expect(store.balance).toBe('');
    });

    it('recovers loading state when the RPC call rejects', async () => {
      const store = useContractsStore();
      vi.spyOn(console, 'error').mockImplementation(() => {});
      store.web3 = {
        eth: {getBalance: vi.fn().mockRejectedValue(new Error('rpc down'))},
        utils: {fromWei: vi.fn()}
      } as never;

      await store.getBalance();

      expect(store.balance).toBe('');
      expect(store.loading.balance).toBe(false);
    });
  });

  describe('connectMetamask guards', () => {
    it('informs the user when no web3 instance exists', async () => {
      const store = useContractsStore();
      await store.connectMetamask();
      expect(toast.info).toHaveBeenCalledWith('no Web3 provided');
    });

    it('prompts a MetaMask install when web3 exists but no provider does', async () => {
      const store = useContractsStore();
      store.web3 = {} as never;
      store.provider = null;

      await store.connectMetamask();

      expect(toast.error).toHaveBeenCalledWith('Please install MetaMask!');
    });
  });

  describe('connectContract', () => {
    it('rejects unsupported chains before touching the factory contract', async () => {
      const store = useContractsStore();
      store.web3 = {eth: {Contract: class {}}} as never;
      store.activeChain = {...polygonChain, hexId: '0x1'};

      await store.connectContract();

      expect(toast.error).toHaveBeenCalledWith(
        'Switch to either Polygon and Avalanche chain'
      );
      expect(store.factoryContract).toBeNull();
    });
  });

  describe('submitConnectedForm guards', () => {
    it('does nothing when the amount is empty', async () => {
      const store = useContractsStore();
      store.vaultContract = {methods: {}} as never;
      store.activeChain = polygonChain;

      await store.submitConnectedForm();

      expect(store.loading.withdrawConnected).toBe(false);
      expect(store.wallets.connected.step).toBe(1);
    });

    it('does nothing when the amount exceeds the vault balance', async () => {
      const store = useContractsStore();
      const withdrawRequest = vi.fn();
      store.vaultContract = {methods: {withdrawRequest}} as never;
      store.activeChain = polygonChain;
      store.contractBalance = {eth: 0, usdt: 50};
      store.updateFormField(100, 'connected', 'amount');

      await store.submitConnectedForm();

      expect(withdrawRequest).not.toHaveBeenCalled();
      expect(store.wallets.connected.step).toBe(1);
    });

    it('resets the form instead of submitting after a failed attempt', async () => {
      const store = useContractsStore();
      const resetSpy = vi.spyOn(store, 'resetConnectedForm');
      store.vaultContract = {methods: {}} as never;
      store.activeChain = polygonChain;
      store.contractBalance = {eth: 0, usdt: 500};
      store.updateFormField(100, 'connected', 'amount');
      store.updateError({connected: true});

      await store.submitConnectedForm();

      expect(resetSpy).toHaveBeenCalledOnce();
    });
  });

  describe('getEstimatedGas', () => {
    it('applies the buffer and derives EIP-1559 fees from fee history (non-Polygon path)', async () => {
      const store = useContractsStore();
      store.activeChain = avaxChain;
      store.connectedAccount = '0xabc';
      store.web3 = {} as never;
      store.provider = {
        request: vi.fn().mockImplementation(({method}: {method: string}) => {
          if (method === 'eth_feeHistory') {
            return Promise.resolve({
              /** 1 gwei, 1 gwei, 2 gwei priority fees */
              reward: [['0x3b9aca00'], ['0x3b9aca00'], ['0x77359400']]
            });
          }
          if (method === 'eth_getBlockByNumber') {
            /** 30 gwei base fee */
            return Promise.resolve({baseFeePerGas: '0x6fc23ac00'});
          }
          return Promise.reject(new Error(`unexpected ${method}`));
        })
      };

      const contract = {
        methods: {
          withdraw: vi.fn(() => ({
            estimateGas: vi.fn().mockResolvedValue(21000n)
          }))
        }
      };

      await store.getEstimatedGas(contract, 'withdraw', ['0xtoken'], 1.2);

      expect(store.transactionGas.gas).toBe(Math.floor(21000 * 1.2));
      /** p50 of [1, 1, 2] gwei = 1 gwei */
      expect(store.transactionGas.maxPriorityFeePerGas).toBe(1_000_000_000);
      /** (base * 2 + priority) * 10 = (60 + 1) gwei * 10 */
      expect(store.transactionGas.maxFeePerGas).toBe(610_000_000_000);
    });

    it('forwards the method arguments to estimateGas from the connected account', async () => {
      const store = useContractsStore();
      store.activeChain = avaxChain;
      store.connectedAccount = '0xabc';
      store.web3 = {} as never;
      store.provider = {
        request: vi
          .fn()
          .mockImplementation(({method}: {method: string}) =>
            method === 'eth_feeHistory'
              ? Promise.resolve({reward: [['0x3b9aca00']]})
              : Promise.resolve({baseFeePerGas: '0x3b9aca00'})
          )
      };

      const estimateGas = vi.fn().mockResolvedValue(50000n);
      const withdrawRequest = vi.fn(() => ({estimateGas}));
      const contract = {methods: {withdrawRequest}};

      await store.getEstimatedGas(contract, 'withdrawRequest', [
        '0xtoken',
        '0xrecipient',
        100n
      ]);

      expect(withdrawRequest).toHaveBeenCalledWith(
        '0xtoken',
        '0xrecipient',
        100n
      );
      expect(estimateGas).toHaveBeenCalledWith({from: '0xabc'});
    });

    it('leaves transactionGas untouched when estimation fails (documents the stale-gas bug)', async () => {
      const store = useContractsStore();
      vi.spyOn(console, 'error').mockImplementation(() => {});
      store.activeChain = avaxChain;
      store.connectedAccount = '0xabc';
      store.web3 = {} as never;
      store.provider = {request: vi.fn()};

      const contract = {
        methods: {
          withdraw: vi.fn(() => ({
            estimateGas: vi
              .fn()
              .mockRejectedValue(new Error('estimation failed'))
          }))
        }
      };

      await store.getEstimatedGas(contract, 'withdraw', []);

      /**
       * NOTE: getEstimatedGas swallows the error, so callers proceed to
       * .send() with whatever was in transactionGas before — gas 0 on first
       * use. This test pins the current behaviour; when the store is fixed
       * to rethrow (or callers check the result), update this expectation.
       */
      expect(store.transactionGas.gas).toBe(0);
    });
  });
});
