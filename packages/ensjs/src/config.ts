export type ChainBrandConfig = {
  brandName: string
  tld: string
  coinType: number
}

const ECNS_CONFIG: ChainBrandConfig = {
  brandName: 'ECNS',
  tld: 'etc',
  coinType: 61,
}

const ENS_CONFIG: ChainBrandConfig = {
  brandName: 'ENS',
  tld: 'eth',
  coinType: 60,
}

/**
 * Returns brand configuration for a given chain ID.
 *
 * - ETC chains (61, 63) → ECNS with `.etc` TLD and coin type 61
 * - ETH chains (1, 11155111) → ENS with `.eth` TLD and coin type 60
 * - Unknown chains → defaults to ENS
 */
export const getChainBrandConfig = (chainId: number): ChainBrandConfig => {
  switch (chainId) {
    case 61:
    case 63:
      return ECNS_CONFIG
    case 1:
    case 11155111:
      return ENS_CONFIG
    default:
      return ENS_CONFIG
  }
}

/** Default brand config for ECNS deployments */
export const DEFAULT_BRAND_CONFIG = ECNS_CONFIG
