import { join, basename } from 'path'
import mkdirp from 'mkdirp'
import { readDir, readFile, writeFile, deleteFile } from '../utils'


export const writeEntity = async (
    collectionPath: string,
    key: string,
    entity: any
  ): Promise<void> => {
  await mkdirp(collectionPath)
  collectionPath = join(collectionPath, key)
  const data = JSON.stringify(entity)
  return writeFile(collectionPath, data)
}

export const deleteEntity = (path: string): Promise<void> => {
  return deleteFile(path)
}

export const readStorage = async (clayPath: string) => {
  const entries = await readDir(clayPath)
  const directories = await Promise.all(
    entries
      .filter(entry => entry.isDirectory)
      .map(async entry => {
        const collectionPath = join(clayPath, entry.name)
        const collection = await _readCollection(collectionPath)
        return {
          name: entry.name,
          collection
        }
      })
  )
  const storage: { [key: string]: any } = {}
  directories.forEach(directory => {
    storage[directory.name] = directory.collection
  })
  return storage
}

const _readCollection = async (path: string) => {
  const entries = await readDir(path)
  const files = await Promise.all(
    entries
      .filter(e => e.isFile)
      .map(async entry => {
        const data = await readFile(join(path, entry.name))
        return {
          name: basename(entry.name),
          data
        }
      })
  )
  const collection: { [key: string]: any } = {}
  files.forEach(file => {
    collection[file.name] = file.data
  })
  return collection
}
