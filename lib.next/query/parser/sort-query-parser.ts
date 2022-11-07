const pairsSep = /\s*;\s*/g
const pairSep = /\s*,\s*/g

export type SortByPair = { field: string, direction: 'asc' | 'desc' }

export function parseSortQuery(source: string): SortByPair[] | null {
  if (!source) return null
  return source
    .split(pairsSep)
    .filter(Boolean)
    .map(pair => {
      const [field, direction] = pair.split(pairSep)
      return { field, direction: direction as 'asc' | 'desc' }
    })
}
