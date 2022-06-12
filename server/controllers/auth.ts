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
      }
    } catch (error) {
      handleError(res, error);
    }
  }

  logout(_: Request, res: Response) {
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
      }
    } catch (error) {
      handleError(res, error);
    }
  }

  async refreshToken(req: Request, res: Response) {
    console.log(req.cookies);
    try {
      const tokenEncrypted = req.cookies.refresh_token;
      const userId = await JWTUtil.parseTokenAndGetUserId(tokenEncrypted);
      this.generateTokensAndAuthenticateUser(res, String(userId));
    } catch (error) {
      handleError(res, error);
    }
  }

  async generateTokensAndAuthenticateUser(res: Response, userId: string) {
    const user = await UserModel.findById(userId).select('-password');
    const { token: access_token, expiration: token_expiration } = await JWTUtil.generateAccessToken(userId);
    const { token: refreshToken } = JWTUtil.generateRefreshToken(userId);
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.status(200).json({ access_token, token_expiration, user });
  }

  async generateUserTokenAndRedirect(req: any, res: Response) {
    const fronendUrl = ConfigUtil.get('url.frontend');
    const successRedirect = `${fronendUrl}/authentication/redirect`;
    const { token } = JWTUtil.generateRefreshToken(req.currentUser?._id.toString());
    res.cookie('refresh_token', token, { httpOnly: true });
    res.redirect(successRedirect);
  }

  async find(req: Request, res: Response) {
    try {
      const { email } = req.body
      const response = await UserModel.findOne({ email, password: { $exists: true } }, { new: true });
      res.status(200).json(response);
    } catch (error) {
      handleError(res, error);
    }
  }

  async verified(req: Request, res: Response) {
    try {
      const { _id, ...query } = req.body;
      const response = await UserModel.findByIdAndUpdate(_id, query, { new: true });
      res.status(200).json(response);
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new AuthController();