import { join } from 'path'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { generateKey } from '../pid'
import { readFile, writeFile } from '../utils'


const AUTH_CONFIG_FILENAME = 'auth.json'

export async function Auth(clayPath: string) {
  const config = await readAuthConfig(clayPath)

  const createJwt = (sub: string, claims: any) {
    return jwt.sign(claims, config.secret, {
      issuer: '@yesiree/clay',
      subject: sub,
      algorithm: 'HS256',
      expiresIn: '14d',
      jwtid: generateKey()
    })
  }

  const verifyJwt = (token: any) => {
    return jwt.verify(token, config.secret, {
      algorithms: ['HS256']
    })
  }

  const refreshJwt = (refreshToken: any, accessToken: any) => {

  }

  return {
    api: {
      signin()
    },
    jwt: {
      create: createJwt,
      verify: verifyJwt
    },
    passwords: {
      hash: hashPassword,
      check: checkPassword
    }
  }
}


const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ':' + derivedKey.toString('hex'))
    })
  })
}

const checkPassword = (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(key == derivedKey.toString('hex'))
    })
  })
}

const readAuthConfig = async (clayPath: string): Promise<any> => {
  let config
  try {
    config = await readFile(clayPath, AUTH_CONFIG_FILENAME)
  } catch (err) {
    console.error(err)
    config = getDefaultAuthConfig()
    await writeFile(join(clayPath, AUTH_CONFIG_FILENAME), config)
  }
  return config
}

const getDefaultAuthConfig = () => {
  const secret = `${generateKey()}${generateKey}`
  const adminKey = generateKey()
  const admin = {
    username: 'admin',
    password: hashPassword('admin123'),
    roles: { 'admin': true }
  }
  return {
    secret,
    roles: [
      'admin'
    ],
    permissions: [
      'users/read',
      'users/write',
      'users/create',
      'users/update',
      'users/delete',
      'users/authorize',
      'resources/read',
      'resources/write',
      'resources/create',
      'resources/update',
      'resources/delete'
    ],
    rolePermissions: {
      'admin': [
        'users/read',
        'users/write',
        'users/delete',
        'users/authorize',
        'resources/read',
        'resources/write',
        'resources/delete'
      ]
    },
    users: {
      [adminKey]: admin
    },
    sessions: {
      sub: {
        sessionId: {
          refreshId: {

          }
        }
      }
    }
  }
}
