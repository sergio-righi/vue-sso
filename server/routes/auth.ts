import express, { Response, Request } from 'express'
import passport from 'passport'

import { ConfigUtil } from '@/utils'
import { AuthMiddleware, JWTMiddleware } from '@/middlewares'
import { AuthController } from '@/controllers'

const router = express.Router()

// local-jwt login

router.post('/find', AuthMiddleware, (req, res) =>
  AuthController.find(req, res)
)
router.post('/register', AuthMiddleware, (req, res) => AuthController.register(req, res))
router.get('/refresh-token', AuthMiddleware, (req, res) =>
  AuthController.refreshToken(req, res)
)
router.get('/logout', JWTMiddleware, (req: Request, res: Response) =>
  AuthController.logout(req, res)
)
router.post('/login', AuthMiddleware, async (req: Request, res: Response) =>
  AuthController.login(req, res)
)

// social-jwt login

Object.keys(ConfigUtil.get('authentication') || {}).forEach((providerName) => {
  const failureRedirect = `${process.env.FRONTEND_URL}"`
  const providerAuthMiddleware = passport.authenticate(providerName, {
    session: false,
    userProperty: 'currentUser',
    failureRedirect,
  })
  router.get(`/${providerName}`, providerAuthMiddleware)
  router.get(`/${providerName}/callback`, providerAuthMiddleware, (req, res) =>
    AuthController.generateUserTokenAndRedirect(req, res)
  )
})

export default router
