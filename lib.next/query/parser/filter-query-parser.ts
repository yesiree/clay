import type { QueryOperator } from '../query-operator.enum'


type FilterQueryTokenType = 'group-open' | 'group-close' | 'key' | 'operator' | 'value' | 'junction' | 'unknown'
type FilterQueryToken = { type: FilterQueryTokenType, text: string }

function tokenizeFilterQuery(source: string): FilterQueryToken[] {
  const whitespaceRe = /^\s+/
  const juncRe = /^(&&|\|\|)\s*/
  const keyRe = /^[a-zA-Z$_][a-zA-Z0-9$_]*\s*/
  const operatorRe = /^(==|!=|<(=|in>|not-in>|array-contains-any>|array-contains-all>)?|>=?|=\*|\*=|\*|~)\s*/
  const valueRe = /^(null|true|false|[0-9]+|"(?:[^\\"]|\\.)*"|\[((\d+|"([^"]|\\")*?")\s*,?\s*)*(?<!,)\])\s*/
  const length = source.length
  const tokens: FilterQueryToken[] = []
  let i = 0
  let token
  while (i < length) {
    const c = source.charAt(i)
    if (token = peekRegex(whitespaceRe)) {
      i += token.length
    } else if (c === '(') {
      tokens.push({ type: 'group-open', text: '(' })
      i++
    } else if (c === ')') {
      tokens.push({ type: 'group-close', text: ')' })
      i++
    } else if (token = peekRegex(operatorRe)) {
      tokens.push({ type: 'operator', text: token.trim() })
      i += token.length
    } else if (token = peekRegex(juncRe)) {
      tokens.push({ type: 'junction', text: token.trim() })
      i += token.length
    } else if (token = peekRegex(keyRe)) {
      tokens.push({ type: 'key', text: token.trim() })
      i += token.length
    } else if (token = peekRegex(valueRe)) {
      tokens.push({ type: 'value', text: token.trim() })
      i += token.length
    } else {
      tokens.push({ type: 'unknown', text: c })
      i++
    }
  }

  return tokens

  function peekRegex(regex: RegExp) {
    const [text] = regex.exec(source.slice(i)) || []
    return text || ''
  }
}


const splitWordsRe = /[\s\b]+/g
export function parseFilterQuery(source: string) {
  const tokens = tokenizeFilterQuery(source)
  let i = 0
  return parseOr()

  /*
      O -> A | O or A
      A -> E | A and E
      E -> ( O ) | key op value
  */

  function parseOr(): any {
    const lhs = parseAnd()
    const next = peek()
    if (!next || next.type !== 'junction' || next.text !== '||') {
      return lhs
    }
    consume('junction')
    return {
      type: 'or',
      lhs,
      rhs: parseOr()
    }
  }

  function parseAnd(): any {
    const lhs = parseExpression()
    const next = peek()
    if (!next || next.type !== 'junction' || next.text !== '&&') {
      return lhs
    }
    consume('junction')
    return {
      type: 'and',
      lhs,
      rhs: parseOr()
    }
  }

  function parseExpression(): any {
    const next = peek()
    if (next.type === 'group-open') {
      consume('group-open')
      const node = parseOr()
      consume('group-close')
      return node
    } else {
      const [keyToken, operatorToken, valueToken] = consume('key', 'operator', 'value')
      const key = keyToken.text
      const operator = operatorToken.text as QueryOperator
      let value = JSON.parse(valueToken.text)
      return {
        type: 'expression',
        key,
        operator,
        value
      }
    }
  }

  function peek() {
    return tokens[i]
  }

  function consume(...tokenTypes: FilterQueryTokenType[]) {
    return tokenTypes.map(tokenType => {
      const token = tokens[i]
      if (token.type !== tokenType) {
        error(token, tokenType)
      }
      i++
      return token
    })
  }

  function error(found: FilterQueryToken, expectedType: FilterQueryTokenType) {
    throw new Error(`SyntaxError: Found <${found.type}: ${found.text}>' but expected token of type '${expectedType}'.`)
  }
}
