# ECNSjs

The ultimate ECNS javascript library, with [viem](https://github.com/wagmi-dev/viem) under the hood.

## Features

- Super fast response times
- Easy call batchability
- Written in TypeScript
- Supports the most cutting edge ECNS features
- Full tree-shaking support

## Installation

Install @ecnsdomains/ecnsjs, alongside [viem](https://github.com/wagmi-dev/viem).

```sh
npm install @ecnsdomains/ecnsjs viem
```

## Getting Started

The most simple way to get started is to create a public ECNS client, with a supported
chain and transport imported from viem. The public client has all the read functions available on it,
as well as all subgraph functions.

```ts
// Import viem transport, viem chain, and ECNSjs
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ecnsdomains/ecnsjs'

// Create the client
const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
})

// Use the client
const ethAddress = client.getAddressRecord({ name: 'example.etc' })
```

## Mordor Testnet

ECNS is deployed on **Mordor testnet** (Ethereum Classic testnet, chain 63) for testing before mainnet deployment.

### Quick Start

```ts
import { createEnsPublicClient } from '@ecnsdomains/ecnsjs'
import { http, defineChain } from 'viem'

// Define Mordor testnet
const mordor = defineChain({
  id: 63,
  name: 'Mordor Testnet',
  nativeCurrency: { decimals: 18, name: 'Mordor ETC', symbol: 'METC' },
  rpcUrls: { default: { http: ['https://rpc.mordor.etccooperative.org'] } },
  testnet: true,
})

// Create client
const client = createEnsPublicClient({
  chain: mordor,
  transport: http(),
})

// Query domains
const records = await client.getRecords({ name: 'example.etc' })
```

### Resources

- **Documentation**: [Mordor Testnet Guide](docs/mordor.md)
- **Example**: [mordor-basic example](examples/mordor-basic)
- **RPC**: https://rpc.mordor.etccooperative.org
- **Faucet**: https://github.com/mordortestnet/mordor-public-faucet
- **Explorer**: https://etc-mordor.blockscout.com
- **Contracts**: [deployments/mordor.json](../contracts/deployments/mordor.json)

**Note**: Mordor does not have a subgraph deployed. Use RPC-only methods (see [limitations](docs/mordor.md#limitations)).

## Docs

Docs can be found [here](https://github.com/ecnsdomains/ecnsjs/tree/main/docs).
