import { QueryOperator } from './query-operator.enum'


type QueryCallback<T> = (ref: QueryListApi<T>) => void

export class HttpResult {
  constructor(
    public status: number,
    public statusText: string,
    public body: string
  ) { }
}

export class HttpNewEntityResult extends HttpResult {
  constructor(
    status: number,
    statusText: string,
    body: string,
    public newId: string
  ) {
    super(status, statusText, body)
  }
}

export class SortByPair {
  constructor(
    public field: string,
    public direction: 'asc' | 'desc'
  ) { }

  toString() {
    return `${this.field},${this.direction}`
  }
}

export class SortByCollection {
  constructor(
    public pairs: SortByPair[] = []
  ) { }

  push(...pair: SortByPair[]) {
    this.pairs.push(...pair)
  }

  clear() {
    this.pairs = []
  }

  get length() {
    return this.pairs.length
  }

  toString() {
    return this.pairs
      .map(x => x.toString())
      .join(';')
  }
}

export abstract class QueryClause { }

export class QueryWhereClause extends QueryClause {
  constructor(
    public field: string,
    public operator: QueryOperator,
    public value: any
  ) {
    super()
  }

  toString() {
    return `${this.field}${this.operator}${JSON.stringify(this.value)}`
  }
}

export abstract class QueryContainerClause extends QueryClause {
  constructor(
    public clauses: QueryClause[] = []
  ) {
    super()
  }

  push(clause: QueryClause) {
    this.clauses.push(clause)
  }

  abstract sep: string
  toString() {
    const count = this.clauses.length
    if (count < 1) return ''
    let str = this.clauses.map(x => x.toString()).join(this.sep)
    if (count > 1) str = `(${str})`
    return str
  }
}

export class QueryAndClause extends QueryContainerClause {
  sep = '&&'
}
export class QueryOrClause extends QueryContainerClause {
  sep = '||'
}

export class QueryListApi<T> {
  _offset: number = 0
  _limit: number | null = null
  _sortBy: SortByCollection = new SortByCollection()
  _where: QueryAndClause = new QueryAndClause()
  _clauseStack: QueryContainerClause[] = [this._where]

  constructor(
    private resourceUrl: string
  ) { }

  offset(value: number = 0): QueryListApi<T> {
    this._offset = value
    return this
  }

  limit(value: number | null = null): QueryListApi<T> {
    this._limit = value
    return this
  }

  sortBy(...values: string[]): QueryListApi<T> {
    this._sortBy.clear()
    for (let i = 0, l=values.length; i < l; i += 2) {
      const field = values[i]
      const direction = values[i + 1] || 'asc'
      if (direction !== 'desc' && direction !== 'asc') {
        throw new Error(`Invalid sortBy parameters! Each field name must be followed by a direction (e.g. 'api.sortBy('field1', 'desc', 'field2', 'asc'...)'). Found: (${field}, ${direction}). All: [${values.join(', ')}].`)
      }
      this._sortBy.push(new SortByPair(field, direction))
    }
    return this
  }

  where(
    firstParam: string | QueryCallback<T>,
    operator?: QueryOperator,
    value?: any): QueryListApi<T> {
    if (typeof firstParam === 'string' && operator && value) {
      const field = firstParam
      const currentClause = this._clauseStack[0]
      currentClause.push(new QueryWhereClause(field, operator, value))
    } else if (typeof firstParam === 'function') {
      const callback = firstParam
      callback(this)
    } else {
      throw new Error(`Invalid state.`)
    }
    return this
  }

  and(callback: QueryCallback<T>): QueryListApi<T> {
    const currentClause = this._clauseStack[0]
    const newAndClause = new QueryAndClause()
    currentClause.push(newAndClause)
    this._clauseStack.unshift(newAndClause)
    callback(this)
    this._clauseStack.shift()
    return this
  }

  or(callback: QueryCallback<T>): QueryListApi<T> {
    const currentClause = this._clauseStack[0]
    const newOrClause = new QueryOrClause()
    currentClause.push(newOrClause)
    this._clauseStack.unshift(newOrClause)
    callback(this)
    this._clauseStack.shift()
    return this
  }

  toString(): string {
    let query = ''
    query += `o=${this._offset}`
    if (this._limit != null) {
      query += `&l=${this._limit}`
    }
    if (this._sortBy.length) {
      query += `&s=${encodeURIComponent(this._sortBy.toString())}`
    }
    if (this._where.clauses.length) {
      query += `&f=${encodeURIComponent(this._where.toString())}`
    }
    return `${this.resourceUrl}?${query}`
  }

  async fetch(): Promise<T[]> {
    const url = this.toString()
    const res = await fetch(url)
    const list = await res.json()
    return list as T[]
  }
}

export class QueryApi {

  constructor(
    private baseUri: string
  ) { }

  async get<T>(uri: string): Promise<T> {
    const res = await fetch(this.baseUri + uri)
    const entity = await res.json()
    return entity as T
  }

  list<T>(uri: string): QueryListApi<T> {
    return new QueryListApi<T>(this.baseUri + uri)
  }

  async post<T>(uri: string, entity: T): Promise<HttpNewEntityResult> {
    const res = await fetch(uri, {
      method: 'POST',
      body: JSON.stringify(entity)
    })
    const body = await res.text()
    const json = JSON.parse(body)
    return new HttpNewEntityResult(
      res.status,
      res.statusText,
      body,
      json.newId
    )
  }

  async put<T>(uri: string, entity: T): Promise<HttpResult> {
    const res = await fetch(uri, {
      method: 'PUT',
      body: JSON.stringify(entity)
    })
    const body = await res.text()
    return new HttpResult(
      res.status,
      res.statusText,
      body
    )
  }

  async patch<T>(uri: string, entity: T | any): Promise<HttpResult> {
    const res = await fetch(uri, {
      method: 'PATCH',
      body: JSON.stringify(entity)
    })
    const body = await res.text()
    return new HttpResult(
      res.status,
      res.statusText,
      body
    )
  }

  async del(uri: string): Promise<HttpResult> {
    const res = await fetch(uri, { method: 'DELETE' })
    const body = await res.text()
    return new HttpResult(
      res.status,
      res.statusText,
      body
    )
  }

}
