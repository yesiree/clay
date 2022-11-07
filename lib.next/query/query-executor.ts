import Fuse from 'fuse.js'
import {
  parseFilterQuery,
  parseSearchQuery,
  parseSortQuery,
  SortByPair
} from './parser'


export function QueryExecutor(arr: any[], params: { [key: string]: string }) {
  const offset = +params['o'] || 0
  const limit = +params['l'] || undefined
  const sortBy: SortByPair[] | null = parseSortQuery(params['s'] || '')
  const condition = parseFilterQuery(params['w'] || '')
  const search = parseSearchQuery(params['fts'])
  arr = arr.filter(item => filter(item, condition))
  if (search) {
    const fuse = new Fuse(arr, { keys: search.keys })
    arr = fuse.search(search.terms)
  }
  if (sortBy) {
    arr.sort((a, b) => compare(a, b, sortBy))
  }
  return arr.slice(offset, limit)
}

function filter(item: any, condition: any): boolean {
  if (condition.type === 'and') {
    const { lhs, rhs } = condition
    const lhsResult = filter(item, lhs)
    const rhsResult = filter(item, rhs)
    return lhsResult && rhsResult
  } else if (condition.type === 'or') {
    const { lhs, rhs } = condition
    const lhsResult = filter(item, lhs)
    const rhsResult = filter(item, rhs)
    return lhsResult || rhsResult
  } else if (condition.type === 'expression') {
    const { key, operator, value } = condition
    const itemValue = item[key]
    switch (operator) {
      case '==':  return itemValue === value
      case '!=':  return itemValue !== value
      case '<':   return itemValue < value
      case '<=':  return itemValue <= value
      case '>':   return itemValue > value
      case '>=':  return itemValue >= value
      case '=*':  return (itemValue || '').startsWith(value)
      case '*=':  return (itemValue || '').endsWith(value)
      case '*':   return (itemValue || '').includes(value)
      case '~':   return true // Unused/Undefined
      case '<in>': return coerceArray(value).includes(itemValue)
      case '<not-in>': return !coerceArray(value).includes(itemValue)
      case '<array-contains-any>':
        return coerceArray(value).some(x => coerceArray(itemValue).some(y => x === y))
      case '<array-contains-all>':
        return coerceArray(value).every(x => coerceArray(itemValue).some(y => y === x))
      default:
        throw new Error(`Unknown operator: ${operator}.`)
    }
  } else {
    throw new Error(`Unknown condition type: ${condition.type}.`)
  }
}

function coerceArray(value: any) {
  return Array.isArray(value) ? value : [value]
}

function compare(a: any, b: any, sortBy: SortByPair[], index = 0): number {
  if (index > sortBy.length) return 0
  const { field, direction } = sortBy[index]
  const aValue = a[field]
  const aType = typeof aValue
  const bValue = b[field]
  const bType = typeof bValue
  if (aType !== bType) return compare(a, b, sortBy, index + 1)
  if (aType === 'number') {
    return aValue - bValue * (direction === 'asc' ? 1 : -1)
  } else if (aType === 'string') {
    return aValue.localeCompare(bValue) * (direction === 'asc' ? 1 : -1)
  }
  return compare(a, b, sortBy, index + 1)
}
