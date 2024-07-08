
export interface KeyWeightPair {
  name: string
  weight: number
}

export interface SearchMeta {
  keys: KeyWeightPair[],
  terms: string
}

const splitWordsRe = /[\s\b]+/g
export function parseSearchQuery(source: string): SearchMeta | null {
  if (!source) return null
  const sepIndex = source.indexOf('~')
  const keyStr = source.slice(0, sepIndex)
  const terms = source.slice(sepIndex + 1)
  const keys = keyStr
    .split(';')
    .filter(Boolean)
    .map(pair => {
      const [name, weight] = pair.split(',').filter(Boolean)
      return { name, weight: +weight }
    })
  return {
    keys,
    terms
  }
}
