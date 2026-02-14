import { DEFAULT_BRAND_CONFIG } from '../config.js'
import {
  NameWithEmptyLabelsError,
  RootNameIncludesOtherLabelsError,
} from '../errors/utils.js'
import { MINIMUM_NATIVE_TLD_CHARS } from './consts.js'
import { checkLabel, isEncodedLabelhash, saveName } from './labels.js'
import { type Label, normalise, split } from './normalise.js'

export const validateName = (name: string) => {
  const nameArray = name.split('.')
  const normalisedArray = nameArray.map((label) => {
    if (label.length === 0) throw new NameWithEmptyLabelsError({ name })
    if (label === '[root]') {
      if (name !== label) throw new RootNameIncludesOtherLabelsError({ name })
      return label
    }
    return isEncodedLabelhash(label)
      ? checkLabel(label) || label
      : normalise(label)
  })
  const normalisedName = normalisedArray.join('.')
  saveName(normalisedName)
  return normalisedName
}

export type ParsedInputResult = {
  type: 'name' | 'label'
  normalised: string | undefined
  isValid: boolean
  isShort: boolean
  is2LD: boolean
  isNativeTld: boolean
  labelDataArray: Label[]
}

export const parseInput = (
  input: string,
  { nativeTld = DEFAULT_BRAND_CONFIG.tld } = {},
): ParsedInputResult => {
  let nameReference = input
  let isValid = false

  try {
    nameReference = validateName(input)
    isValid = true
  } catch {}

  const normalisedName = isValid ? nameReference : undefined

  const labels = nameReference.split('.')
  const tld = labels[labels.length - 1]
  const isNativeTld = tld === nativeTld
  const labelDataArray = split(nameReference)
  const isShort =
    (labelDataArray[0].output?.length || 0) < MINIMUM_NATIVE_TLD_CHARS

  if (labels.length === 1) {
    return {
      type: 'label',
      normalised: normalisedName,
      isShort,
      isValid,
      is2LD: false,
      isNativeTld,
      labelDataArray,
    }
  }

  const is2LD = labels.length === 2
  return {
    type: 'name',
    normalised: normalisedName,
    isShort: isNativeTld && is2LD ? isShort : false,
    isValid,
    is2LD,
    isNativeTld,
    labelDataArray,
  }
}

export const checkIsNativeTld2LD = (
  labels: string[],
  tld = DEFAULT_BRAND_CONFIG.tld,
) => labels.length === 2 && labels[1] === tld

/** @deprecated Use checkIsNativeTld2LD */
export const checkIsDotEth = checkIsNativeTld2LD
