import { v4 as uuidv4 } from 'uuid'

export const generateKey = () => {
  let hex = uuidv4().replace(/-/g, '')
  if (hex.length % 2) hex = '0' + hex
  return BigInt('0x' + hex).toString(36).padStart(25, '0')
}
