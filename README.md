# 🧾 NAKA Web Wallet
**Built with Vue + Vite + TypeScript + Web3.js**

**Vault dApp** is a lightweight, browser‑based minimal Vite setup and a Vue-based client that interacts with Polygon and Avalanche smart contracts using **Web3.js**. Users can create personal **Vault contracts** via a **VaultRegistry factory**, manage assets, and handle deposits, withdrawals, and KYC settings securely through **MetaMask**.

---

## 🌍 Live Demo

You can access the deployed version of this app here:

🔗 **[https://nakaopensource.github.io/naka-web-wallet](https://nakaopensource.github.io/naka-web-wallet)**

> Make sure your MetaMask wallet is installed and unlocked in your browser to interact with the app.

---

## ⚙️ Features

- 🔗 Connect to Ethereum via MetaMask using Web3.js
- 💼 Withdraw crypto to connected wallet
- 💼 Withdraw crypto to external wallet
- 📜️ View withdraw history
- ⚡ Instant development with Vite
- 🧩 Written in **TypeScript** for type safety and scalability
- 🌐 Clean, static frontend suitable for GitHub Pages
- 🗄️ Hosted at `/naka-web-wallet` path to enable scoped deployments

---

## 🏭 Vault Registry (Factory Contract)

The **VaultRegistry** contract manages all Vault deployments and registry-level settings:

| Method | Description |
|--------|-------------|
| `createVault(owner)` | **Creates a new Vault** for the specified owner. Returns the Vault address. |
| `getVaultByOwner(owner)` | Retrieve vault details by owner address. |
| `getVaultAddressByOwner(owner)` | Get the vault contract address linked to an owner. |
| `getVaults(page, pageSize)` | Paginated list of all registered vaults. |
| `getVaultsCount()` | Total number of vaults created. |
| `getVaultData(vaultAddress)` | Get full details of a specific vault. |
| `getProtocolTokenAddress()` | Address of the protocol’s ERC‑20 token. |
| `getProtocolTokenBridgeAddress()` | Address used for cross‑chain bridge withdrawals. |
| `getProtocolTokenIsWrapped()` | Returns true if the token is wrapped. |
| `getKYCLevels(...)` | List of KYC levels and associated spending limits. |
| `getDefaultKYCLevel()` | Default KYC level assigned to new vaults. |

---

## 🏦 Vault Contract Methods

Once created, each Vault provides a full suite of fund, key, and payment management methods:

### Funds Management
| Method | Description |
|--------|-------------|
| `deposit(token, amount)` | Deposit native or ERC‑20 tokens into the vault (payable). |
| `withdraw(token, recipient, amount)` | Withdraw tokens directly to a recipient. |
| `withdrawRequest(token, recipient, amount)` | Request a delayed withdrawal. |
| `cancelWithdrawRequest(token)` | Cancel a pending withdrawal. |
| `getWithdrawProtocolTokenReservation()` | View pending withdrawal amount and unlock time. |
| `getProtocolTokenBalances()` | Retrieve protocol token balances and reservations. |

### Card Key Management
| Method | Description |
|--------|-------------|
| `addCardKey(cardKey, active)` | Add a new card key and set active status. |
| `setCardKeyActive(cardKey, active)` | Enable or disable an existing card key. |
| `getCardKeys(page, pageSize, activeOnly)` | Paginated list of card keys, optionally filtering active only. |
| `isCardKeyActive(cardKey)` | Check if a card key is currently active. |

### Merchant Payments
| Method | Description |
|--------|-------------|
| `addProcessPaymentReservation(...)` | Create a reservation for a merchant payment. |
| `executeProcessPayment(gatewayPaymentId)` | Finalize a reserved payment. |
| `cancelProcessPaymentReservation(gatewayPaymentId)` | Cancel a pending payment reservation. |
| `getProcessPaymentProtocolTokenAmount(merchantId, amount)` | Calculate token cost for a payment. |
| `getProcessPaymentProtocolTokenReservation()` | Total reserved tokens for pending payments. |

### Ownership & Administration
| Method | Description |
|--------|-------------|
| `owner()` | Get the current vault owner. |
| `transferOwnership(newOwner)` | Initiate transfer of ownership. |
| `acceptOwnership()` | Accept pending ownership transfer. |
| `renounceOwnership()` | Permanently renounce ownership. |

### KYC & Initialization
| Method | Description |
|--------|-------------|
| `init(owner, registry, level)` | One‑time initializer for vaults. |
| `getVaultKYCLevel()` | Get current KYC level. |
| `setVaultKYCLevel(level, sig, signer)` | Update vault’s KYC level using a signed payload. |
| `isKYCLevelValid()` | Check if KYC level is valid. |

### Bridge Support
| Method | Description |
|--------|-------------|
| `bridgeWithdraw(...)` | Execute cross-chain withdrawal. |
| `bridgeWithdrawRequest(...)` | Request a bridge withdrawal. |
| `getProtocolTokenBridgeAddress()` | Address of the bridge. |
| `getProtocolTokenIsWrapped()` | Whether the vault’s token is wrapped. |

---

> These methods can be called from the frontend using Web3.js once the contract is connected and the user is authenticated via MetaMask.

---

## 🚀 Quick Start for Users

### ✅ Prerequisites

- **MetaMask** browser extension installed and set up. [Get MetaMask](https://metamask.io/)
- A modern web browser (Chrome, Firefox, Edge, Brave, etc.) with JavaScript enabled.

---
### 🔧 Running the Project

For **Windows users**, simply double-click the included `start_WIN.bat` file in the project directory. This batch file will:

- Start a local HTTP server serving the project files on port 8000.
- Automatically open your default web browser to `http://localhost:8000`.


---
### 🍎 macOS

1. Double-click `start_macOS.command`.

   > If it doesn't open, run the following once in Terminal to make it executable:

   ```bash
   chmod +x start_macOS.command
   ```
---

If you prefer to start the server manually, or are on a different OS, you can use Python’s built-in HTTP server:

```bash
python serve_dist.py
```
---


## 👨‍💻 Quick Start for Developers

Here’s how to interact with the dApp programmatically using **Web3.js**.

### 1. Connect MetaMask

```ts
import Web3 from "web3";

let web3: Web3;
let accounts: string[] = [];

async function connectMetaMask() {
   if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
   }
   try {
      web3 = new Web3(window.ethereum);
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected account:", accounts[0]);
   } catch (error) {
      console.error(error)
   }
}
```

### 2. Create a Vault via the VaultRegistry

```ts
import VaultRegistryABI from "./abi/VaultRegistry.json";

const registryAddress = "0x..."; // Deployed VaultRegistry address
const registry = new web3.eth.Contract(VaultRegistryABI, registryAddress);

async function createVault() {
   try {
      const owner = accounts[0];
      const tx = await registry.methods.createVault(owner).send({ from: owner });
      console.log("Vault created, receipt:", tx);
      // Vault address is in tx.events.VaultCreated.returnValues.vaultAddress
   } catch (error) {
      console.error(error)
   }
}
```


### 3. Interact with your Vault

```ts
import VaultABI from "./abi/Vault.json";

async function depositToVault(vaultAddress: string, tokenAddress: string, amountUsdt: bigint) {
   const vault = new web3.eth.Contract(VaultABI, vaultAddress);

   try {
      await vault.methods.deposit(tokenAddress, amountUsdt).send({
         from: accounts[0],
         value: tokenAddress === "0x0..." ? amountWei : "0"
      });
      console.log("Deposit successful");
   } catch (error) {
      console.error(error)
   }
}

async function requestWithdrawFromVault(vaultAddress: string, tokenAddress: string, recipient: string, amountUsdt: bigint) {
   const vault = new web3.eth.Contract(VaultABI, vaultAddress);

   try {
      await vault.methods.withdraw(tokenAddress, recipient, amountUsdt).send({ from: accounts[0] });
      console.log("Withdrawal successful");
   } catch (error) {
      console.error(error)
   }
}

async function withdrawFromVault(vaultAddress: string, tokenAddress: string, recipient: string, amountUsdt: bigint) {
   const vault = new web3.eth.Contract(VaultABI, vaultAddress);

   try {
      await vault.methods.withdraw(tokenAddress, recipient, amountUsdt).send({ from: accounts[0] });
      console.log("Withdrawal successful");
   } catch (error) {
      console.error(error)
   }
}
```
---

## 🏗️ Rebuilding the project locally

Build the project for production with assets scoped to /withdraw:

```bash
pnpm run build
```
Preview the production build using Vite’s built-in preview server:
```bash
pnpm run preview
```

## 🛠️ Publishing new version

1. Build the new version with "pnpm build:(remote)"

```bash
pnpm run build:naka
```

2. Add all the files to git (including dist which is by default excluded in .gitignore)

```bash
pnpm add .
```

3. Commit changes and push to a relevant remote branch

```bash
git push naka main
```

4. Deploy the new version to github pages (the remote name should be the same as deploy:(remote))

```bash
pnpm run deploy:naka
```