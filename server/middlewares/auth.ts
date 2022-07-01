import { ConfigUtil, JWTUtil } from '@/utils'

export default (req: any, res: any, next: any) => {
  try {
    const authorization = req.headers.authorization.split('&')

    if (!authorization) {
      const error: any = new Error('No parameters to authenticate.')
      error.statusCode = 401
      throw error
    }

    if (authorization[1]) {
      let decodedToken: any
      try {
        decodedToken = JWTUtil.generateAccessToken(authorization[1])
      } catch (err) {
        const error: any = new Error('Authentication failed.')
        error.statusCode = 500
        throw error
      }

      if (!decodedToken) {
        const error: any = new Error('Not authenticated.')
        error.statusCode = 401
        throw error
      }
    }

    if (authorization[0]) {
      const secretKey = ConfigUtil.get('api')
      if (authorization[0] === secretKey) next()
    }
  } catch (err) {
    console.log(err)
    err === 401 ? res.status(401) : res.end()
  }
}
