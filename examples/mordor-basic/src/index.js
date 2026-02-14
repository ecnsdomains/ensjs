import { createEnsPublicClient } from '@ecnsdomains/ecnsjs'
import { getName, getOwner } from '@ecnsdomains/ecnsjs/public'
import { http } from 'viem'
import { defineChain } from 'viem'

// Define Mordor testnet chain
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

// Create ECNS client for Mordor
const client = createEnsPublicClient({
  chain: mordor,
  transport: http(),
})

const main = async () => {
  console.log('ECNS SDK - Mordor Testnet Example\n')
  console.log('Chain:', mordor.name)
  console.log('Chain ID:', mordor.id)
  console.log('RPC:', mordor.rpcUrls.default.http[0])
  console.log('Block Explorer:', mordor.blockExplorers.default.url)
  console.log()

  // Example domain to query (replace with an actual registered .etc domain on Mordor)
  const domainName = 'example.etc'

  console.log(`Querying domain: ${domainName}\n`)

  try {
    // Get name details
    console.log('1. Getting name details...')
    const nameData = await client.getName({ name: domainName })
    console.log('Name data:', nameData)
    console.log()

    // Get owner
    console.log('2. Getting owner...')
    const ownerData = await client.getOwner({ name: domainName })
    console.log('Owner data:', ownerData)
    console.log()

    // Get records (address, text records, content hash)
    console.log('3. Getting records...')
    const recordsData = await client.getRecords({
      name: domainName,
      coins: ['ETC', 'ETH', 'BTC'],
      texts: [
        'avatar',
        'email',
        'description',
        'url',
        'com.twitter',
        'com.github',
      ],
      contentHash: true,
    })
    console.log('Records:', recordsData)
    console.log()

    // Batch call example
    console.log('4. Batching calls...')
    const batchData = await client.ensBatch(
      getName.batch({ name: domainName }),
      getOwner.batch({ name: domainName }),
    )
    console.log('Batch results:', batchData)
  } catch (error) {
    console.error('Error:', error.message)
    console.log()
    console.log(
      'Note: This example requires a registered .etc domain on Mordor testnet.',
    )
    console.log(
      'Get METC from the faucet: https://github.com/mordortestnet/mordor-public-faucet',
    )
  }
}

// IMPORTANT NOTES:
// - Mordor testnet does NOT have a subgraph deployed
// - Use RPC-only methods (getName, getRecords, getOwner, etc.)
// - Subgraph methods (getNamesForAddress, getSubgraphRecords) will not work
// - No name wrapper support on Mordor
// - Bulk operations that rely on subgraph are unavailable

main()
