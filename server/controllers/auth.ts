import { Request, Response } from 'express'

import { env, jwt, crypto } from '@/utils'
import { UserModel } from '@/models'
import { AuthService } from '@/services'
import { BaseController } from './base.controller'

class AuthController extends BaseController {
  constructor() {
    super()
    AuthService.init()
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const hashedPassword = crypto.hash(password)
      const response = await UserModel.findOne({
        email,
        password: hashedPassword,
      })

      if (response) {
        this.generateTokensAndAuthenticateUser(res, String(response._id))
      } else {
        res.status(200).json(null)
      }
    } catch (err) {
      this.handleError(res, err)
    }
  }

  logout(_: Request, res: any) {
    res.cookie('refresh_token', '', { httpOnly: true })
    res.status(200).end()
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const response = await UserModel.findOne({
        email,
        password: { $exists: true },
      })
      if (!response) {
        const hashedPassword = crypto.hash(password)
        const user = await UserModel.create({
          ...req.body,
          password: hashedPassword,
        })
        this.generateTokensAndAuthenticateUser(res, String(user._id))
      } else {
        res.status(200).json(null)
      }
    } catch (err) {
      this.handleError(res, err)
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      // const tokenEncrypted = req.cookies.refresh_token;
      const tokenEncrypted = String(req.query.payload)
      const userId = jwt.parseTokenAndGetUserId(tokenEncrypted)
      this.generateTokensAndAuthenticateUser(res, String(userId))
    } catch (err) {
      this.handleError(res, err)
    }
  }

  async generateTokensAndAuthenticateUser(res: any, userId: string) {
    const user = await UserModel.findById(userId).select('-password')
    const { token: access_token, expiration: token_expiration } =
      await jwt.generateAccessToken(userId)
    const { token: refreshToken } = jwt.generateRefreshToken(userId)
    res.cookie('refresh_token', refreshToken, { httpOnly: false, secure: false })
    res.status(200).json({ access_token, token_expiration, user })
  }

  async generateUserTokenAndRedirect(req: any, res: any) {
    const { token } = jwt.generateRefreshToken(req.currentUser?._id.toString())
    const fronendUrl = env.get('url.frontend')
    const successRedirect = `${fronendUrl}/authentication?token=${token}`
    res.cookie('refresh_token', token, { httpOnly: false, secure: false })
    res.redirect(successRedirect)
  }

  async find(req: Request, res: Response) {
    const response = await AuthService.find(req.body)
    res.status(response.status).json(response.data)
  }
}

export default new AuthController()
