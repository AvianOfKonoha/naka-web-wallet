import {MetaMaskSDK} from '@metamask/sdk';

export const metamaskSdk = new MetaMaskSDK({
  dappMetadata: {
    name: 'Naka Web Wallet',
    url: window.location.origin
  }
});
export const provider = metamaskSdk.getProvider(); // EIP-6963 provider
