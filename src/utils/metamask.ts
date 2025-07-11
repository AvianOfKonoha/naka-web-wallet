import {MetaMaskSDK} from '@metamask/sdk';

export const metamaskSdk = new MetaMaskSDK({
  dappMetadata: {
    name: 'Naka Fund Withdrawal DApp',
    url: window.location.origin
  }
});
export const provider = metamaskSdk.getProvider(); // EIP-6963 provider
