---
"@ecnsdomains/ecnsjs": major
"@ecnsdomains/react": major
---

Rebrand from @ensdomains/ensjs to @ecnsdomains/ecnsjs

BREAKING CHANGE: Package names have been renamed to reflect ECNS (Ethereum Classic Name Service):
- @ensdomains/ensjs → @ecnsdomains/ecnsjs
- @ensdomains/ensjs-react → @ecnsdomains/react

This is a complete rebrand for Ethereum Classic Name Service. All functionality remains the same, but imports must be updated:

```diff
- import { createEnsPublicClient } from '@ensdomains/ensjs'
+ import { createEnsPublicClient } from '@ecnsdomains/ecnsjs'
```

**New features:**
- Added comprehensive Mordor testnet (chain 63) documentation
- Added working example at examples/mordor-basic/
- Updated all descriptions and repository URLs to ECNS branding
- Added docs/mordor.md with 564 lines of Mordor-specific guidance

**Migration guide:**
1. Update package.json: `"@ensdomains/ensjs"` → `"@ecnsdomains/ecnsjs"`
2. Update imports in your code
3. No API changes - all methods work identically
4. For Mordor testnet usage, see docs/mordor.md
