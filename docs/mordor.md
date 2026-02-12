[**@ecnsdomains/ecnsjs**](../README.md)

---

> Mordor Testnet

# Using ECNS SDK with Mordor Testnet

Comprehensive guide for using the ECNS SDK on Mordor testnet (Ethereum Classic testnet, chain 63).

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Client Setup](#client-setup)
- [Contract Addresses](#contract-addresses)
- [Supported Operations](#supported-operations)
- [Limitations](#limitations)
- [Example Usage](#example-usage)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## Overview

Mordor is the Ethereum Classic testnet, equivalent to Ethereum's Sepolia or Goerli. ECNS contracts are deployed on Mordor for testing before mainnet deployment.

### Mordor Testnet Details

| Property | Value |
|----------|-------|
| **Chain ID** | 63 |
| **Network Name** | Mordor Testnet |
| **Native Token** | METC (Mordor ETC) |
| **RPC Endpoint** | https://rpc.mordor.etccooperative.org |
| **Block Explorer** | https://etc-mordor.blockscout.com |
| **Faucet** | https://github.com/mordortestnet/mordor-public-faucet |
| **Deployment Date** | February 8, 2026 |

### Why Use Mordor?

- **Safe Testing**: Test ECNS integrations without spending real ETC
- **Identical Contracts**: Same contract code as ETC mainnet
- **Free Tokens**: Get METC from the public faucet
- **Contract Verification**: All contracts are verified on Blockscout
- **RPC-Only**: No subgraph dependency, pure RPC operations

---

## Getting Started

### Prerequisites

1. **Node.js 24.x** or later
2. **pnpm** package manager
3. **METC tokens** from the [Mordor faucet](https://github.com/mordortestnet/mordor-public-faucet)

### Installation

```bash
npm install @ecnsdomains/ecnsjs viem
# or
pnpm add @ecnsdomains/ecnsjs viem
# or
yarn add @ecnsdomains/ecnsjs viem
```

---

## Client Setup

### Define Mordor Chain

First, define the Mordor chain using viem's `defineChain`:

```typescript
import { defineChain } from 'viem'

const mordor = defineChain({
  id: 63,
  name: 'Mordor Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Mordor ETC',
    symbol: 'METC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.mordor.etccooperative.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://etc-mordor.blockscout.com',
    },
  },
  testnet: true,
})
```

### Create Public Client (Read-Only)

```typescript
import { createEnsPublicClient } from '@ecnsdomains/ecnsjs'
import { http } from 'viem'

const client = createEnsPublicClient({
  chain: mordor,
  transport: http(),
})

// Query domain information
const nameData = await client.getName({ name: 'example.etc' })
const ownerData = await client.getOwner({ name: 'example.etc' })
const records = await client.getRecords({
  name: 'example.etc',
  coins: ['ETC', 'ETH'],
  texts: ['avatar', 'description'],
})
```

### Create Wallet Client (Read + Write)

```typescript
import { createEnsWalletClient } from '@ecnsdomains/ecnsjs'
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount('0x...')

const walletClient = createEnsWalletClient({
  chain: mordor,
  transport: http(),
  account,
})

// Set records for your domain
await walletClient.setRecords({
  name: 'mydomain.etc',
  records: {
    coins: [{ coin: 'ETC', value: '0x...' }],
    texts: [{ key: 'avatar', value: 'https://...' }],
  },
})
```

### Custom RPC Endpoint

If using a self-hosted Mordor node:

```typescript
const client = createEnsPublicClient({
  chain: mordor,
  transport: http('http://localhost:8545'), // Your RPC endpoint
})
```

---

## Contract Addresses

All ECNS contracts deployed on Mordor are listed in the [contracts repository](https://github.com/ecnsdomains/ens-contracts/blob/main/deployments/mordor.json).

### Core Contracts

| Contract | Address |
|----------|---------|
| **ECNSRegistry** | `0x29dd3a41973ec0551bcd195e46e8eb9801621c34` |
| **BaseRegistrar** | `0xfbce90395535d6ae9448f55d676bde9a40215a37` |
| **ETCRegistrarController** | `0x6d36c84926c2637448f2a7eabad3a0eed7f95b25` |
| **PublicResolver** | `0xc1267bafafd08fe85580985b020b2df08d863ca4` |
| **ReverseRegistrar** | `0x0ebc22b513866796157a9fc9e86d23c3cddc28ab` |
| **ECNSMetadataRenderer** | `0xb82b372b7a368a3f3c1ff9ba96128650f629194b` |

### Pricing Contracts

| Contract | Address |
|----------|---------|
| **ETCswapFullOracle** | `0x34bda98deb5862a7f387a60a1e3b01879eb5f3fe` |
| **ExponentialPremiumPriceOracle** | `0xae4cdb10b803849766a2b695bca1a7df5a962b06` |

### View on Block Explorer

All contracts are verified on [Blockscout](https://etc-mordor.blockscout.com). You can view contract source code, read/write functions, and transaction history.

---

## Supported Operations

### ✅ Supported (RPC-Based)

The following operations work perfectly on Mordor using RPC:

#### Domain Information
- `getName()` - Get name details
- `getOwner()` - Get domain owner
- `getResolver()` - Get resolver address
- `getExpiry()` - Get domain expiration

#### Records
- `getRecords()` - Get all records at once
- `getAddressRecord()` - Get specific coin address
- `getTextRecord()` - Get specific text record
- `getContentHash()` - Get content hash
- `getAbi()` - Get ABI record

#### Write Operations (Wallet Client)
- `setRecords()` - Set multiple records
- `setAddressRecord()` - Set coin address
- `setTextRecord()` - Set text record
- `setContentHash()` - Set content hash
- `registerName()` - Register new domain
- `renewNames()` - Renew domain registration
- `setResolver()` - Change resolver

#### Batching
- `ensBatch()` - Batch multiple RPC calls

#### Utilities
- `normalize()` - Normalize domain names
- `namehash()` - Calculate namehash
- `labelhash()` - Calculate labelhash

---

## Limitations

### ❌ Not Supported on Mordor

The following features are **NOT** available due to missing infrastructure:

#### No Subgraph

Mordor does not have an ECNS subgraph deployed. These methods will fail:

```typescript
// ❌ Will throw error - no subgraph
await client.getSubgraphRecords({ name: 'example.etc' })
await client.getNamesForAddress({ address: '0x...' })
await client.getSubgraphRegistrant({ name: 'example.etc' })
```

**Workaround**: Use RPC-only methods like `getRecords()`, `getOwner()`, and `getName()`.

#### No Name Wrapper

Name wrapper contracts are not deployed on Mordor. These features are unavailable:

- Name wrapping/unwrapping
- Fuses and permissions
- Subdomain expiry control
- ERC-1155 functionality for wrapped names

#### No Bulk Operations

Operations that rely on the subgraph for bulk queries are not available:

- Fetching all names for an address
- Searching domains by text records
- Historical event queries

**Workaround**: Query individual domains by name if you know them.

### Performance Considerations

- **RPC Queries**: All queries hit the RPC endpoint directly, which may be slower than subgraph queries
- **Rate Limits**: Public RPC may have rate limits; use your own node for heavy usage
- **No Caching**: Without a subgraph, there's no query caching layer

---

## Example Usage

### Basic Domain Query

```typescript
import { createEnsPublicClient } from '@ecnsdomains/ecnsjs'
import { http, defineChain } from 'viem'

const mordor = defineChain({
  id: 63,
  name: 'Mordor Testnet',
  nativeCurrency: { decimals: 18, name: 'Mordor ETC', symbol: 'METC' },
  rpcUrls: { default: { http: ['https://rpc.mordor.etccooperative.org'] } },
  testnet: true,
})

const client = createEnsPublicClient({
  chain: mordor,
  transport: http(),
})

// Get all information about a domain
const domainInfo = await client.getRecords({
  name: 'example.etc',
  coins: ['ETC', 'ETH', 'BTC'],
  texts: ['avatar', 'email', 'url', 'description'],
  contentHash: true,
})

console.log('Domain:', domainInfo.resolverAddress)
console.log('ETC Address:', domainInfo.coins?.find(c => c.coin === 'ETC')?.value)
console.log('Avatar:', domainInfo.texts?.find(t => t.key === 'avatar')?.value)
```

### Register a Domain

```typescript
import { createEnsWalletClient } from '@ecnsdomains/ecnsjs'
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount('0x...')

const walletClient = createEnsWalletClient({
  chain: mordor,
  transport: http(),
  account,
})

// Check availability
const available = await walletClient.getAvailable({ name: 'mydomain.etc' })

if (available) {
  // Get price
  const price = await walletClient.getPrice({
    nameOrNames: 'mydomain.etc',
    duration: 31536000, // 1 year in seconds
  })

  console.log('Price:', price.base, 'METC')

  // Register domain
  const tx = await walletClient.registerName({
    name: 'mydomain.etc',
    duration: 31536000, // 1 year
    owner: account.address,
    records: {
      coins: [{ coin: 'ETC', value: account.address }],
      texts: [{ key: 'description', value: 'My ECNS domain' }],
    },
  })

  console.log('Registration transaction:', tx)
}
```

### Set Records

```typescript
import { createEnsWalletClient } from '@ecnsdomains/ecnsjs'
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount('0x...')

const walletClient = createEnsWalletClient({
  chain: mordor,
  transport: http(),
  account,
})

// Update records for your domain
const tx = await walletClient.setRecords({
  name: 'mydomain.etc',
  records: {
    coins: [
      { coin: 'ETC', value: '0x...' },
      { coin: 'ETH', value: '0x...' },
      { coin: 'BTC', value: 'bc1...' },
    ],
    texts: [
      { key: 'avatar', value: 'https://example.com/avatar.png' },
      { key: 'email', value: 'user@example.com' },
      { key: 'url', value: 'https://example.com' },
      { key: 'com.twitter', value: '@username' },
      { key: 'com.github', value: 'username' },
    ],
    contentHash: 'ipfs://Qm...',
  },
})

console.log('Records updated:', tx)
```

### Batch Multiple Calls

```typescript
import { getName, getOwner, getRecords } from '@ecnsdomains/ecnsjs/public'

const [nameData, ownerData, recordsData] = await client.ensBatch(
  getName.batch({ name: 'example.etc' }),
  getOwner.batch({ name: 'example.etc' }),
  getRecords.batch({
    name: 'example.etc',
    coins: ['ETC'],
    texts: ['description'],
  }),
)

console.log('Name:', nameData)
console.log('Owner:', ownerData)
console.log('Records:', recordsData)
```

### Reverse Resolution

```typescript
// Set reverse record (points address to name)
await walletClient.setReverseRecord({
  name: 'mydomain.etc',
})

// Get primary name for an address
const primaryName = await client.getName({
  address: '0x...',
})

console.log('Primary name:', primaryName?.name)
```

---

## Troubleshooting

### "Name not found" Error

**Cause**: The domain hasn't been registered on Mordor.

**Solution**: Register the domain first using `registerName()` or query a domain you know exists.

### RPC Connection Timeout

**Cause**: Mordor RPC endpoint may be slow or unreachable.

**Solutions**:
- Check RPC status: `curl https://rpc.mordor.etccooperative.org`
- Use a self-hosted Mordor node
- Increase timeout in transport config:

```typescript
const client = createEnsPublicClient({
  chain: mordor,
  transport: http('https://rpc.mordor.etccooperative.org', {
    timeout: 30000, // 30 seconds
  }),
})
```

### Subgraph Method Errors

**Cause**: Mordor has no subgraph.

**Solution**: Use RPC-only methods:
- ❌ `getSubgraphRecords()` → ✅ `getRecords()`
- ❌ `getNamesForAddress()` → ✅ Query domains individually

### Insufficient METC Balance

**Cause**: Not enough METC to pay for transactions.

**Solution**: Get METC from the [Mordor faucet](https://github.com/mordortestnet/mordor-public-faucet).

### Transaction Stuck/Pending

**Cause**: Gas price too low or network congestion.

**Solutions**:
- Check transaction on [Blockscout](https://etc-mordor.blockscout.com)
- Increase gas price
- Cancel and resubmit with higher gas

---

## Differences from ETC Mainnet

### Similarities

- ✅ Same contract code
- ✅ Same TLD (`.etc`)
- ✅ Same pricing model (ETCswap oracle)
- ✅ Same record types
- ✅ Same NFT metadata rendering

### Differences

| Feature | Mordor | ETC Mainnet |
|---------|--------|-------------|
| **Chain ID** | 63 | 61 |
| **Native Token** | METC (free) | ETC (real value) |
| **Subgraph** | ❌ Not deployed | ✅ Planned |
| **Name Wrapper** | ❌ Not deployed | ✅ Planned |
| **RPC Endpoint** | Public (ETC Coop) | Multiple providers |
| **Faucet** | ✅ Available | ❌ N/A |
| **Block Explorer** | Blockscout | Multiple explorers |

### Migration Path

Code written for Mordor will work on ETC mainnet by simply changing the chain configuration:

```typescript
// Mordor (testing)
const mordor = defineChain({ id: 63, ... })

// ETC Mainnet (production)
const etcMainnet = defineChain({ id: 61, ... })

// Same code works on both!
const client = createEnsPublicClient({
  chain: etcMainnet, // Just swap the chain
  transport: http(),
})
```

---

## Resources

### Documentation

- [ECNS SDK Documentation](../README.md)
- [Public Functions](public/README.md)
- [Wallet Functions](wallet/README.md)
- [Basics](basics/README.md)

### Contracts & Deployment

- [ECNS Contracts Repository](https://github.com/ecnsdomains/ens-contracts)
- [Mordor Deployment Info](https://github.com/ecnsdomains/ens-contracts/blob/main/deployments/mordor.json)
- [Verified Contracts on Blockscout](https://etc-mordor.blockscout.com)

### Mordor Network

- [Mordor RPC Endpoint](https://rpc.mordor.etccooperative.org)
- [Mordor Block Explorer](https://etc-mordor.blockscout.com)
- [Mordor Faucet](https://github.com/mordortestnet/mordor-public-faucet)
- [Mordor Network Info](https://ethereumclassic.org/development/testnets)

### Examples

- [Mordor Basic Example](../examples/mordor-basic)
- [Basic ESM Example](../examples/basic-esm)
- [TypeScript ESM Example](../examples/basic-tsnode-esm)

### Support

- [ECNS Discord](https://discord.gg/ecns) (if available)
- [GitHub Issues](https://github.com/ecnsdomains/ecnsjs/issues)
- [ETC Cooperative](https://etccooperative.org)

---

## Next Steps

1. **Get METC**: Visit the [Mordor faucet](https://github.com/mordortestnet/mordor-public-faucet)
2. **Run the example**: Try the [mordor-basic example](../examples/mordor-basic)
3. **Register a domain**: Use the wallet client to register your first `.etc` domain
4. **Set records**: Add avatar, social links, and crypto addresses
5. **Test thoroughly**: Validate your integration before mainnet deployment

---

**Last Updated**: February 12, 2026
**ECNS SDK Version**: 1.0.0+
**Mordor Deployment**: February 8, 2026
