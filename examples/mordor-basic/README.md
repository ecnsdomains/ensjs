# ECNS SDK - Mordor Testnet Example

Basic example demonstrating how to use the ECNS SDK with Mordor testnet (ETC chain 63).

## What This Example Demonstrates

- Connecting to Mordor testnet
- Querying `.etc` domain information
- Getting domain owner
- Fetching domain records (addresses, text records, content hash)
- Batching multiple calls for efficiency

## Prerequisites

- Node.js 24.x or later
- pnpm package manager
- METC (Mordor testnet tokens) - get from [Mordor Faucet](https://github.com/mordortestnet/mordor-public-faucet)

## Installation

From the SDK root directory:

```bash
# Install dependencies for all examples
pnpm install
```

## Running the Example

```bash
# From this directory
pnpm start

# Or from SDK root
pnpm --filter mordor-basic start
```

## Mordor Testnet Details

| Property | Value |
|----------|-------|
| Chain ID | 63 |
| Network | Mordor Testnet |
| RPC Endpoint | https://rpc.mordor.etccooperative.org |
| Block Explorer | https://etc-mordor.blockscout.com |
| Native Token | METC (Mordor ETC) |
| Faucet | https://github.com/mordortestnet/mordor-public-faucet |

## ECNS Contracts on Mordor

See [deployments/mordor.json](../../../contracts/deployments/mordor.json) for all deployed contract addresses.

Key contracts:
- **ECNSRegistry**: `0x29dd3a41973ec0551bcd195e46e8eb9801621c34`
- **ETCRegistrarController**: `0x6d36c84926c2637448f2a7eabad3a0eed7f95b25`
- **PublicResolver**: `0xc1267bafafd08fe85580985b020b2df08d863ca4`

## Important Limitations

### No Subgraph Support

Mordor testnet does **NOT** have a subgraph deployed. The following methods will not work:

- `getSubgraphRecords()`
- `getNamesForAddress()`
- Any bulk operations that rely on the subgraph

Use RPC-only methods instead:
- `getName()`
- `getRecords()`
- `getOwner()`
- `getResolver()`
- `getAddressRecord()`
- `getTextRecord()`

### No Name Wrapper

Mordor does not have name wrapper contracts deployed. Features that require the wrapper are unavailable:
- Name wrapping/unwrapping
- Fuses and permissions

### RPC-Only Operations

All queries are made directly to the RPC endpoint, which may be slower than subgraph queries for bulk operations.

## Modifying the Example

To query a different domain, edit `src/index.js`:

```javascript
const domainName = 'your-domain.etc'
```

To add more record types:

```javascript
const recordsData = await client.getRecords({
  name: domainName,
  coins: ['ETC', 'ETH', 'BTC', 'LTC', 'DOGE'], // Add more coin types
  texts: ['avatar', 'email', 'custom-key'], // Add custom text keys
  contentHash: true,
  abi: true, // Include ABI if set
})
```

## Next Steps

- [Register a domain on Mordor](https://github.com/ecnsdomains/ens-contracts#deployment)
- [Read the full ECNS SDK documentation](../../docs/README.md)
- [Learn about Mordor-specific considerations](../../docs/mordor.md)
- Test your integration before deploying to ETC mainnet

## Troubleshooting

### "Name not found" error

The domain you're querying doesn't exist on Mordor. Register a domain first using the ETCRegistrarController contract.

### RPC connection issues

Ensure the Mordor RPC endpoint is accessible:

```bash
curl -X POST https://rpc.mordor.etccooperative.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Subgraph errors

Remember: Mordor has no subgraph. Avoid methods that query the subgraph.

## Resources

- [ECNS Contracts Repository](https://github.com/ecnsdomains/ens-contracts)
- [Mordor Testnet Faucet](https://github.com/mordortestnet/mordor-public-faucet)
- [Mordor Block Explorer](https://etc-mordor.blockscout.com)
- [ECNS Documentation](https://github.com/ecnsdomains/ecnsjs/tree/main/docs)
