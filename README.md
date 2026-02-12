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

## Docs

Docs can be found [here](https://github.com/ecnsdomains/ecnsjs/tree/main/docs).
