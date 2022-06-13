import { Request, Response } from 'express';

import { ConfigUtil, JWTUtil } from '@/utils';
import { UserModel } from '@/models';
import { AuthService } from '@/services';

const handleError = (res: Response, err: Error) => {
  res.status(500)
}

class AuthController {
  constructor() {
    AuthService.init();
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const response = await UserModel.findOne({ email, password });

      if (response) {
        this.generateTokensAndAuthenticateUser(res, String(response._id));
      } else {
        res.status(200).json(null)
      }
    } catch (err) {
      handleError(res, err);
    }
  }

  logout(_: Request, res: any) {
    res.cookie('refresh_token', '', { httpOnly: true });
    res.status(200).end();
  }

  async register(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const response = await UserModel.findOne({ email, password: { $exists: true } });
      if (!response) {
        const user = await UserModel.create(req.body);
        this.generateTokensAndAuthenticateUser(res, String(user._id));
      } else {
        res.status(200).json(null)
      }
    } catch (err) {
      handleError(res, err);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      console.log(Object.entries(req.cookies))
      const tokenEncrypted = req.cookies?.refresh_token;
      const userId = JWTUtil.parseTokenAndGetUserId(tokenEncrypted);
      this.generateTokensAndAuthenticateUser(res, String(userId));
    } catch (err) {
      console.log(err);
      handleError(res, err);
    }
  }

  async generateTokensAndAuthenticateUser(res: any, userId: string) {
    const user = await UserModel.findById(userId).select('-password');
    const { token: access_token, expiration: token_expiration } = await JWTUtil.generateAccessToken(userId);
    const { token: refreshToken } = JWTUtil.generateRefreshToken(userId);
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.status(200).json({ access_token, token_expiration, user });
  }

  async generateUserTokenAndRedirect(req: any, res: any) {
    const fronendUrl = ConfigUtil.get('url.frontend');
    const successRedirect = `${fronendUrl}/authentication/redirect`;
    const { token } = JWTUtil.generateRefreshToken(req.currentUser?._id.toString());
    res.cookie('refresh_token', token, { httpOnly: true });
    res.redirect(successRedirect);
  }

  async find(req: Request, res: Response) {
    const response = await AuthService.find(req.body);
    res.status(response.status).json(response.data);
  }
}

export default new AuthController();