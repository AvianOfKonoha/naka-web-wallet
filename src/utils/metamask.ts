import {MetaMaskSDK} from "@metamask/sdk";

const sdk = new MetaMaskSDK({
    dappMetadata: {
        name: 'Naka Web Wallet DApp',
        url: window.location.origin,
    },
});
export const provider = sdk.getProvider(); // EIP-6963 provider
