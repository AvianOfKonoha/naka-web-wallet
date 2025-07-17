# 🧾 Vault Smart Contract Frontend
**Built with Vue + Vite + TypeScript + Web3.js**

This frontend application was rewritten from a minimal Vite setup into a Vue-based client that interacts with Ethereum smart contracts using **Web3.js** and **MetaMask**. It includes functionality to deterministically compute contract addresses using **RLP encoding** and **Keccak-256 hashing**—entirely within the browser, with no backend.

---


## 🌍 Live Demo

You can access the deployed version of this app here:

🔗 **[https://avianofkonoha.github.io/dapp-withdraw](https://avianofkonoha.github.io/dapp-withdraw)**

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
- 🗄️ Hosted at `/dapp-withdraw` path to enable scoped deployments

---

## 🧠 Web3 Methods

The following methods are available on the **Vault smart contract**, allowing the frontend application to:

- 🔍 Monitor vault status and token balances
- 🧾 Manage card keys
- 💸 Handle deposits and withdrawals
- ⚙️ Configure payment limits

---

## 🏦 Core Vault Methods

| Method | Description |
|--------|-------------|
| `deposit(token, amount)` | Deposit native or ERC-20 tokens into the vault (payable). |
| `withdraw(token, recipient, amount)` | Withdraw tokens directly to a recipient. |
| `withdrawRequest(token, recipient, amount)` | Request a delayed withdrawal. |
| `cancelWithdrawRequest(token)` | Cancel a previously requested withdrawal. |
| `getWithdrawProtocolTokenReservation()` | View pending withdrawal amount and unlock time. |
| `getProtocolTokenBalances()` | Get all protocol token balances and reservations. |

---

## 💳 Card Key Management

| Method | Description |
|--------|-------------|
| `addCardKey(cardKey, active)` | Add a new card key address and set its active status. |
| `setCardKeyActive(cardKey, active)` | Enable or disable an existing card key. |
| `getCardKey(cardKey)` | Fetch a card key's status. |
| `getCardKeyByIndex(index)` | Get a card key address by index. |
| `getCardKeys(page, pageSize, activeOnly)` | Paginated list of card keys (optionally filter active only). |
| `getAvaliableCardKeysCount()` | Count of active/available card keys. |
| `isCardKeyActive(cardKey)` | Check if a card key is active. |

---

## 💸 Merchant & Payment Flow

| Method | Description |
|--------|-------------|
| `addProcessPaymentReservation(...)` | Create a payment reservation for a merchant. |
| `cancelProcessPaymentReservation(gatewayPaymentId)` | Cancel a pending payment reservation. |
| `executeProcessPayment(gatewayPaymentId)` | Finalize a reserved payment. |
| `getProcessPaymentProtocolTokenAmount(merchantId, amount)` | Compute the token cost for a payment. |
| `getProcessPaymentProtocolTokenReservation()` | Total reserved tokens for pending payments. |
| `checkLimitsAndSignitures(...)` | Validate limits and signature of a payment. |
| `verifySignitures(...)` | Verify and recover signed payment amount. |

---

## 🔐 Ownership & Admin

| Method | Description |
|--------|-------------|
| `owner()` | Get the current owner address. |
| `pendingOwner()` | View address of the pending ownership candidate. |
| `acceptOwnership()` | Accept pending ownership transfer. |
| `transferOwnership(newOwner)` | Start ownership transfer process. |
| `renounceOwnership()` | Permanently give up contract ownership. |

---

## ⚙️ KYC & Vault Initialization

| Method | Description |
|--------|-------------|
| `init(owner, registry, level)` | One-time contract initializer. |
| `isInitialized()` | Check if the vault is initialized. |
| `getVaultKYCLevel()` | Get the current KYC level of the vault. |
| `setVaultKYCLevel(level, sig, signer)` | Update KYC level via signed payload. |
| `isKYCLevelValid()` | Verify if the KYC level is still valid. |

---

## 🌉 Bridge Support

| Method | Description |
|--------|-------------|
| `bridgeWithdraw(...)` | Perform a cross-chain bridge withdrawal. |
| `bridgeWithdrawRequest(...)` | Request a bridge-based withdrawal. |
| `getProtocolTokenBridgeAddress()` | Address of the bridge target. |
| `getProtocolTokenIsWrapped()` | Check if the token is a wrapped asset. |

---

## 🧾 View & Utility Methods

| Method | Description |
|--------|-------------|
| `getVaultVersion()` | Returns vault version (pure). |
| `getProtocolTokenAddress()` | ERC-20 address used as protocol token. |
| `getVaultRegistryAddress()` | Address of the connected registry. |
| `getProtocolTokenBalancesWithLimitsCheck(amount)` | Check balances with a simulated reservation. |
| `getPaymentProcessorHash(...)` | Generate a hash for payment verification. |
| `supportsInterface(interfaceId)` | ERC165 support checker. |

---

> These methods can be called from the frontend using Web3.js once the contract is connected and the user is authenticated via MetaMask.

---

## 🚀 Getting Started

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

---

If you prefer to start the server manually, or are on a different OS, you can use Python’s built-in HTTP server:

```bash
python serve_dist.py
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
---
