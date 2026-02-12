# Publishing Guide for @ecnsdomains packages

This guide covers the NPM publishing workflow for ECNS SDK packages.

## Prerequisites

### 1. NPM Organization Access

Verify you have access to the `@ecnsdomains` NPM organization:

```bash
npm whoami
# Should return your NPM username

npm org ls @ecnsdomains
# Should list you as a member with publish access
```

**If you don't have access:**
- Contact the organization owner to be added
- You need `developer` or `owner` role for publishing

### 2. NPM Authentication

Ensure you're logged in to NPM:

```bash
npm login
# Follow prompts to authenticate
```

### 3. Required Permissions

- Write access to GitHub repository (for changelog generation)
- `GH_TOKEN` environment variable set with GitHub personal access token
  ```bash
  export GH_TOKEN=ghp_your_token_here
  ```

## Publishing Workflow

### Step 1: Create a Changeset

When you make changes that should be released:

```bash
cd /media/dev/2tb/dev/ecns/sdk
pnpm changeset
```

**Follow the prompts:**
1. Select packages to include (space to select, enter to confirm)
2. Choose version bump type:
   - `major` - Breaking changes (e.g., API changes, renames)
   - `minor` - New features (backwards compatible)
   - `patch` - Bug fixes
3. Write a summary of changes (shown in changelog)

The changeset is saved in `.changeset/` directory.

### Step 2: Review Changeset

```bash
# View current changesets
pnpm changeset status

# See what versions would be bumped
cat .changeset/*.md
```

### Step 3: Version Packages

When ready to release, create version bump commits:

```bash
pnpm changeset version
```

This will:
- Update package.json versions
- Generate CHANGELOG.md entries
- Remove processed changesets

### Step 4: Build Packages

Ensure everything builds successfully:

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Lint check
pnpm lint
```

### Step 5: Commit Version Changes

```bash
git add .
git commit -m "chore: version packages for release"
git push origin etc
```

### Step 6: Publish to NPM

**Option A: Manual Publish**
```bash
pnpm changeset publish
```

**Option B: CI/CD Publish (recommended)**
- Push to GitHub
- Create a release tag
- CI pipeline will automatically publish

### Step 7: Create GitHub Release

```bash
# Tag the release
git tag v1.0.0-alpha.1
git push origin v1.0.0-alpha.1

# Or use GitHub CLI
gh release create v1.0.0-alpha.1 \
  --title "v1.0.0-alpha.1" \
  --notes "See CHANGELOG.md for details"
```

## Version Strategy

### Alpha Releases (Current)

During Mordor testnet phase:
- Use `-alpha.X` suffix (e.g., `1.0.0-alpha.1`)
- Publish to NPM with `next` tag:
  ```bash
  pnpm changeset publish --tag next
  ```
- Install with: `npm install @ecnsdomains/ecnsjs@next`

### Beta Releases

Before ETC mainnet launch:
- Use `-beta.X` suffix (e.g., `1.0.0-beta.1`)
- Publish to NPM with `beta` tag

### Stable Releases

After ETC mainnet deployment:
- Use semantic versioning (e.g., `1.0.0`)
- Publish to NPM with `latest` tag (default)

## Troubleshooting

### "No permission to publish"

```bash
# Check your NPM access
npm whoami
npm org ls @ecnsdomains

# Re-authenticate
npm logout
npm login
```

### "Package name taken"

The `@ecnsdomains` organization must exist on NPM and you must be a member.

### "Version already published"

```bash
# Check published versions
npm view @ecnsdomains/ecnsjs versions

# Bump version again
pnpm changeset version
```

### "Changeset not found"

```bash
# Create a changeset first
pnpm changeset

# Or create an empty one if no release needed
pnpm changeset --empty
```

## CI/CD Integration (Future)

When GitHub Actions is set up:

**.github/workflows/release.yml:**
```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Quick Reference

```bash
# Create changeset
pnpm changeset

# Check status
pnpm changeset status

# Bump versions
pnpm changeset version

# Publish (after building)
pnpm changeset publish

# Publish with tag
pnpm changeset publish --tag next
```

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [NPM Publishing Guide](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Semantic Versioning](https://semver.org)

## Current Status

- **Organization:** @ecnsdomains on NPM
- **Packages:**
  - `@ecnsdomains/ecnsjs` - Main SDK (currently `4.2.2`)
  - `@ecnsdomains/react` - React hooks (currently `4.2.2`)
- **Branch:** `etc` (development), `main` (stable)
- **Phase:** Mordor testnet (alpha releases)
- **Next Version:** `1.0.0-alpha.1` (after rebrand changeset)
