import { QueryApi } from './query-api'
import { parseFilterQuery } from './parser/filter-query-parser'


const api = new QueryApi('http://localhost:8080/api')

const result = api
  .list('/people')
  .offset(10)
  .limit(10)
  .sortBy('title', 'asc', 'created', 'desc')
  .where(ref => {
    ref.and(ref => {
      ref.or(ref => {
        ref.where('title', '~', 'Business')
        ref.where('region', '==', 'US')
      })
      ref.where('age', '>', 30)
      ref.where('created', '>', new Date())
      ref.or(ref => {
        ref.where('city', '<in>', ['Provo', 'Orem'])
        ref.where('tags', '<array-contains-any>', ['veggies', 'fruit', 'grain'])
      })
    })
  })
  .toString()

console.log(decodeURIComponent(result))

const url = new URL(result)

// const offset = +(url.searchParams.get('o') || '') || 0
// const limit = +(url.searchParams.get('l') || '') || -1
// const sortBy = url.searchParams.get('s') || ''
const where = url.searchParams.get('f') || ''

const ast = parseFilterQuery(where)

console.log(JSON.stringify(ast, null, 2))
