import CryptoJS from 'crypto-js'

import { default as env } from './env'

const secret = env.get('authorization.secret')
const iv = env.get('authorization.iv')

export default {
  encrypt: (value: string) => {
    const cipher = CryptoJS.AES.encrypt(
      value,
      CryptoJS.enc.Utf8.parse(secret),
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
      }
    )

    return cipher.toString(CryptoJS.format.Hex)
  },

  decrypt: (value: string) => {
    const tempWordArray = CryptoJS.enc.Hex.parse(value)
    const tempBase64 = CryptoJS.enc.Base64.stringify(tempWordArray)
    const cipher = CryptoJS.AES.decrypt(
      tempBase64,
      CryptoJS.enc.Utf8.parse(secret),
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
      }
    )

    return CryptoJS.enc.Utf8.stringify(cipher).toString()
  },

  hash: (value: string) => {
    const hash = CryptoJS.SHA256(secret + value)
    return hash.toString(CryptoJS.enc.Base64)
  },
}
