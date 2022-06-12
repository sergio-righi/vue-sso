import express, { Response, Request } from 'express';
import passport from 'passport';

import { ConfigUtil } from '@/utils';
import { JWTMiddleware } from '@/middlewares';
import { AuthController } from "@/controllers";

const router = express.Router();

// local-jwt login

router.post('/find', (req, res) => AuthController.find(req, res));
router.post('/register', (req, res) => AuthController.register(req, res));
router.get('/refresh-token', (req, res) => AuthController.refreshToken(req, res));
router.get('/logout', JWTMiddleware, (req: Request, res: Response) => AuthController.logout(req, res));
router.post('/login', async (req: Request, res: Response) => AuthController.login(req, res));
router.patch('/verified', async (req: Request, res: Response) => AuthController.verified(req, res));

// social-jwt login

Object.keys(ConfigUtil.get('authentication') || {}).forEach((providerName) => {
  const failureRedirect = `${process.env.FRONTEND_URL}"`;
  const providerAuthMiddleware = passport.authenticate(providerName, {
    session: false,
    userProperty: 'currentUser',
    failureRedirect,
  });
  router.get(`/${providerName}`, providerAuthMiddleware);
  router.get(`/${providerName}/callback`, providerAuthMiddleware, (req, res) => AuthController.generateUserTokenAndRedirect(req, res));
});

export default router;