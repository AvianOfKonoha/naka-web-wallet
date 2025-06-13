# 🧾 Ethereum Smart Contract Frontend
**Built with Vue + Vite + TypeScript + Web3.js**

This frontend application was rewritten from a minimal Vite setup into a Vue-based client that interacts with Ethereum smart contracts using **Web3.js** and **MetaMask**. It includes functionality to deterministically compute contract addresses using **RLP encoding** and **Keccak-256 hashing**—entirely within the browser, with no backend.

---


## 🌍 Live Demo

You can access the deployed version of this app here:

🔗 **[https://avianofkonoha.github.io/withdraw](https://avianofkonoha.github.io/withdraw)**

> Make sure your MetaMask wallet is installed and unlocked in your browser to interact with the app.

---

## ⚙️ Features

- 🔗 Connect to Ethereum via MetaMask using Web3.js
- 🧠 Compute contract addresses from a deployer address and nonce using **RLP** and **Keccak-256**
- 📬 Extract deployed contract address directly from a **transaction hash**
- 🏗️ Retrieve contract address from a **factory contract**
- ⚡ Instant development with Vite
- 🧩 Written in **TypeScript** for type safety and scalability
- 🌐 Clean, static frontend suitable for GitHub Pages
- 🗄️ Hosted at `/withdraw` path to enable scoped deployments

---

## 🧠 Web3 Methods

The following methods are available on the **Vault smart contract**, allowing the frontend application to:

- 🔍 Monitor vault status and token balances
- 🧾 Manage card keys
- 💸 Handle deposits and withdrawals
- ⚙️ Configure payment limits

---

### 📖 Public Getter Methods / Properties

| Method | Description |
|--------|-------------|
| `getVaultVersion()` | Returns the version of the vault contract |
| `getProtocolTokenAddress()` | Returns the address of the protocol token |
| `getMaxPaymentProcessorAllowedSingleAmount()` | Returns the maximum allowed single payment amount |
| `getMaxPaymentProcessorAllowedDailyAmount()` | Returns the maximum allowed daily payment amount |
| `getAvaliableCardKeysCount()` | Returns the total number of available card keys |
| `isCardKeyActive(address cardKey_)` | Checks if a specific card key is active |
| `getCardKey(address cardKey_)` | Returns details about a specific card key |
| `getCardKeyByIndex(uint256 index)` | Returns card key details by index |
| `getCardKeys(uint16 page_, uint16 pageSize_, bool activeOnly_)` | Returns paginated list of card keys |
| `getProcessPaymentProtocolTokenAmount(bytes32 merchantId_, uint256 paymentAmount_)` | Calculates protocol token amount for a payment |
| `getProcessPaymentProtocolTokenReservation()` | Returns total amount of protocol tokens reserved for payments |
| `getWithdrawProtocolTokenReservation()` | Returns withdrawal reservation data |
| `getProtocolTokenBalances()` | Returns detailed protocol token balance information |
| `getProtocolTokenBalancesWithLimitsCheck(uint256 paymentProtocolTokenAmountForNewReservation_)` | Returns balance info with payment limit checks |

---

### 🔐 Owner Management Methods

These methods require owner-level access and are used to manage the vault's internal configuration:

| Method | Description |
|--------|-------------|
| `addCardKey(address cardKey_, bool active_)` | Adds a new card key to the vault |
| `setCardKeyActive(address cardKey_, bool active_)` | Activates or deactivates a card key |
| `withdrawRequest(address token_, address recipient_, uint256 amount_)` | Initiates a withdrawal request |
| `cancelWithdrawRequest(address token_)` | Cancels an existing withdrawal request |
| `withdraw(address token_, address recipient_, uint256 amount_)` | Executes a withdrawal after the lock period |
| `setMaxPaymentProcessorAllowedSingleAmount(uint256 amount_)` | Sets the maximum single payment amount |
| `setMaxPaymentProcessorAllowedDailyAmount(uint256 amount_)` | Sets the maximum daily payment amount |
| `deposit(address token_, uint256 amount_)` | Deposits tokens into the vault |

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
