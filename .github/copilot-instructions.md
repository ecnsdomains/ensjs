# GitHub Copilot Instructions: ECNS SDK

> **For GitHub Copilot only.** This file is self-contained. Claude Code uses `.claude/CLAUDE.md` which references global settings.

---

## Project Overview

ECNS SDK - TypeScript library for Ethereum Classic Name Service (ECNS). Forked from ENS.js v3. Provides read/write operations for `.etc` domains on ETC (chain 61) and Mordor testnet (chain 63).

**Packages:**
- `@ecnsdomains/ensjs` - Core library
- `@ecnsdomains/react` - React hooks

**Repository:** github.com/ecnsdomains/ensjs

---

## Tech Stack (LTS Versions)

| Technology | Version | Notes |
|------------|---------|-------|
| Node.js | 24.x | Required (engines) |
| TypeScript | 5.8.3 | Strict mode |
| pnpm | 10.10.0 | Workspaces |
| Biome | 1.9.4 | Linter (NOT ESLint) |
| Vitest | 1.x | Testing |
| viem | 2.30.6 | Blockchain lib (peer dep) |
| Changesets | 2.27.8 | Versioning |

### React Package

| Technology | Version | Notes |
|------------|---------|-------|
| wagmi | 2.x | Peer dependency |
| TanStack Query | 5.54+ | Peer dependency |

---

## Commands

```bash
# Root workspace
pnpm install             # Install all dependencies
pnpm lint                # Biome check (no auto-fix)
pnpm biome check --write # Auto-fix linting issues
pnpm chgset:run          # Create changeset (versioning)
pnpm chgset:version      # Bump versions from changesets
pnpm release             # Publish to NPM

# Core library (packages/ensjs)
cd packages/ensjs
pnpm build               # TypeScript compilation
pnpm test                # Run all tests (no file parallelism)
pnpm test:watch          # Watch mode
pnpm lint                # Biome check

# React package (packages/react)
cd packages/react
pnpm build               # TypeScript compilation
```

---

## Chain Configuration

### Supported Chains

| Chain | Chain ID | RPC |
|-------|----------|-----|
| ETC Mainnet | 61 | https://etc.rivet.cloud |
| Mordor Testnet | 63 | https://rpc.mordor.etccooperative.org |

### Contract Addresses

Located in `packages/ensjs/src/contracts/consts.ts`:
- `ensRegistry` - Core ECNS registry
- `ensPublicResolver` - Standard resolver
- `ensNameWrapper` - Name wrapper
- `ensEthRegistrarController` - Name registration

---

## Code Patterns

### Client Usage

```typescript
import { createEnsPublicClient } from '@ecnsdomains/ensjs'
import { http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createEnsPublicClient({
  chain: mainnet, // or custom ETC chain
  transport: http(),
})

const address = await client.getAddressRecord({ name: 'example.etc' })
```

### Tree-Shakeable Imports

```typescript
import { getOwner } from '@ecnsdomains/ensjs/public'
import { setRecords } from '@ecnsdomains/ensjs/wallet'
import { getNamesForAddress } from '@ecnsdomains/ensjs/subgraph'
```

### viem Types

```typescript
import type { Address, Hex, Chain } from 'viem'

// Use Address type (checksummed string)
const address: Address = '0x...'

// Use Hex for bytes
const contentHash: Hex = '0x...'
```

### Error Handling

```typescript
import { RecordNotFoundError } from '../errors'

if (!record) {
  throw new RecordNotFoundError({ name, recordType: 'address' })
}
```

---

## Linting with Biome

**CRITICAL:** This project uses **Biome** (NOT ESLint).

### Suppression Syntax

```typescript
// Single rule
// biome-ignore lint/suspicious/noExplicitAny: viem types require any
const data: any = result

// Multiple rules
// biome-ignore lint/suspicious/noExplicitAny lint/complexity/noBannedTypes: reason
const data: any = result
```

**IMPORTANT:** Biome does NOT support `biome-ignore-all` directives. Use line-level comments only.

### Common Rules

- `lint/suspicious/noExplicitAny` - Avoid `any` (warn)
- `lint/correctness/noUnusedImports` - Remove unused imports (error)
- `lint/correctness/noUnusedVariables` - Remove unused variables (error)
- `lint/complexity/noBannedTypes` - Avoid `{}` as type (warn)

### Formatting

- Semicolons: omit where possible
- Quotes: single
- Indent: 2 spaces

---

## Changeset Workflow

This project uses **Changesets** for versioning.

### Creating a Changeset

```bash
pnpm chgset:run  # Create changeset after making changes
```

Choose:
- Packages affected (ensjs, react, or both)
- Bump type: patch (0.0.X), minor (0.X.0), major (X.0.0)
- Description (appears in CHANGELOG)

### When to Create Changesets

- **Patch:** Bug fixes, internal refactors
- **Minor:** New features, new functions
- **Major:** Breaking changes, removed functions

---

## TypeScript Patterns

### Strict Mode

Always use strict mode:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Avoid `any`

```typescript
// Bad
const data: any = result

// Good
const data: unknown = result
if (isValidData(data)) {
  // Type guard
}

// Acceptable with justification
// biome-ignore lint/suspicious/noExplicitAny: viem requires any
const data: any = result
```

---

## Testing

### Test Structure

Tests are colocated with source:
- `getOwner.ts` → `getOwner.test.ts`

### Example Test

```typescript
import { expect, test } from 'vitest'
import { getOwner } from './getOwner'

test('returns owner address', async () => {
  const owner = await getOwner(client, { name: 'example.etc' })
  expect(owner).toBe('0x...')
})
```

### Running Tests

```bash
pnpm test                    # All tests
pnpm test:watch              # Watch mode
vitest src/path/to/file.test.ts  # Specific test
```

---

## Protected Files

Do not modify without explicit request:
- `package.json` (root) - Workspace config
- `biome.json` - Linter config
- `packages/ensjs/src/contracts/consts.ts` - Contract addresses
- `.changeset/config.json` - Changeset config

---

## Validation

Before committing:

```bash
pnpm lint      # Biome check
pnpm test      # Run tests
pnpm build     # Build packages
```

---

## Rules

### Always Do

- Run `pnpm test` before committing
- Run `pnpm lint` before committing
- Use TypeScript strict mode
- Add tests for new functions
- Create changesets for user-facing changes
- Use viem types (`Address`, `Hex`, `Chain`)

### Never Do

- Use ESLint syntax (Biome only)
- Use `any` without justification
- Commit without tests passing
- Break backward compatibility without major version bump
- Commit without changesets for user-facing changes

---

## Example: Public Function

```typescript
// packages/ensjs/src/functions/public/getOwner.ts
import type { Address } from 'viem'
import type { ClientWithEns } from '../../contracts/consts'

export type GetOwnerParameters = {
  name: string
}

export type GetOwnerReturnType = Address | null

export async function getOwner(
  client: ClientWithEns,
  { name }: GetOwnerParameters,
): Promise<GetOwnerReturnType> {
  const { ensRegistry } = client.chain.contracts

  const owner = await client.readContract({
    address: ensRegistry.address,
    abi: ensRegistry.abi,
    functionName: 'owner',
    args: [namehash(name)],
  })

  return owner === '0x0000000000000000000000000000000000000000'
    ? null
    : owner
}
```

---

## Deprecated Versions (Do Not Use)

| Technology | Deprecated Version | Use Instead |
|------------|-------------------|-------------|
| Node.js | 22.x, 20.x, 18.x | 24.x |
| React | 18.x | 19.x |
| Next.js | 15.x, 14.x, 13.x | 16.x |

---

## Response Style

- Direct answers, no filler
- Code examples over explanations
- Assume TypeScript knowledge
- Focus on library patterns (API design, tree-shaking, types)
