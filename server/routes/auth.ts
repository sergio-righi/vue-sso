import express, { Response, Request } from 'express'
import passport from 'passport'

import { env } from '@/utils'
import { auth, jwt } from '@/middlewares'
import { AuthController } from '@/controllers'

const router = express.Router()

// local-jwt login

router.post('/find', auth, (req, res) => AuthController.find(req, res))
router.post('/register', auth, (req, res) => AuthController.register(req, res))
router.get('/refresh-token', auth, (req, res) =>
  AuthController.refreshToken(req, res)
)
router.get('/logout', jwt, (req: Request, res: Response) =>
  AuthController.logout(req, res)
)
router.post('/login', auth, async (req: Request, res: Response) =>
  AuthController.login(req, res)
)

// social-jwt login

Object.keys(env.get('authentication') || {}).forEach((providerName) => {
  const failureRedirect = env.get('url.frontend')
  const providerauth = passport.authenticate(providerName, {
    session: false,
    userProperty: 'currentUser',
    failureRedirect,
  })
  router.get(`/${providerName}`, providerauth)
  router.get(`/${providerName}/callback`, providerauth, (req, res) =>
    AuthController.generateUserTokenAndRedirect(req, res)
  )
})

export default router
