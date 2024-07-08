import {
  Dirent,
  readdir as fsReadDir,
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  unlink as fsDeleteFile,
} from 'fs'
import { join } from 'path'


export const readDir = (path: string): Promise<Dirent[]> => {
  return new Promise((resolve, reject) => {
    fsReadDir(path, { withFileTypes: true }, (err, entries) => {
      if (err) return reject(err)
      resolve(entries)
    })
  })
}

export const readFile = (...paths: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    const path = join(...paths)
    fsReadFile(path, (err, data) => {
      if (err) return reject(err)
      resolve(JSON.parse(data.toString()))
    })
  })
}

export const writeFile = (path: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    fsWriteFile(path, JSON.stringify(data), (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export const deleteFile = (path: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    fsDeleteFile(path, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
