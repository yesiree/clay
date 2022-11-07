import { readStorage, writeEntity, deleteEntity } from './io'
import { generateKey } from '../pid'


export function Storage() {
  let storage: { [key: string]: any} = {}
  return {
    async load(clayPath: string) {
      storage = await readStorage(clayPath)
    },
    get(path: string) {
      const [$key, collectionPath] = splitPath(path)
      const collection = getCollection(storage, collectionPath)
      if (!collection) return null
      const entity = collection[$key]
      entity['$key'] = $key
      return entity
    },
    list(path: string) {
      const collection = getCollection(storage, path) || {}
      return Object
        .keys(collection)
        .map($key => {
          const entity = collection[$key]
          entity['$key'] = $key
          return entity
        })
    },
    async post(path: string, entity: any): Promise<string> {
      const collection = getCollection(storage, path, true)
      const $key = generateKey()
      delete entity['$key']
      collection[$key] = entity
      await writeEntity(path, $key, entity)
      return $key
    },
    async put(path: string, entity: any) {
      const [$key, collectionPath] = splitPath(path)
      const collection = getCollection(storage, collectionPath, true)
      collection[$key] = entity
      await writeEntity(collectionPath, $key, entity)
    },
    async patch(path: string, partial: any) {
      const [$key, collectionPath] = splitPath(path)
      const collection = getCollection(storage, collectionPath, true)
      const old = collection[$key]
      const entity = collection[$key] = Object.assign({}, old, partial)
      await writeEntity(collectionPath, $key, entity)
    },
    async delete(path: string) {
      const [$key, collectionPath] = splitPath(path)
      const collection = getCollection(storage, collectionPath)
      if (!collection) return null
      delete collection[$key]
      await deleteEntity(path)
    }
  }
}


const getCollection = (storage: any, path: string, create = false) => {
  let collection = storage[path]
  if (!collection && create) collection = storage[path] = {}
  return collection
}

const splitPath = (path: string) => {
  const sepIndex = path.lastIndexOf('/')
  if (sepIndex < 0) throw new Error(`Invalid resource path: ${path}!`)
  const $key = path.slice(sepIndex + 1)
  const collectionPath = path.slice(0, sepIndex)
  return [$key, collectionPath]
}
