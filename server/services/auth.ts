import fs from 'fs';
import { join } from 'path';
import passport from 'passport';
import { VerifiedCallback } from 'passport-jwt';

import { UserModel } from '@/models';
import { ConfigUtil, HelperUtil } from '@/utils';

class AuthService {

  requireAuth = passport.authenticate('jwt', {
    userProperty: 'currentUser',
    session: false,
  });

  init() {
    const providersPath = join(__dirname, '..', 'providers');
    fs.readdirSync(providersPath).forEach((file) => {
      const authFile = HelperUtil.removeExtensionFromFile(file);
      import(join(providersPath, authFile));
    });
  };

  getConfigByProviderName(providerName: string) {
    return {
      clientID: ConfigUtil.get(`authentication.${providerName}.clientID` as any),
      clientSecret: ConfigUtil.get(`authentication.${providerName}.clientSecret` as any),
      scope: ConfigUtil.get(`authentication.${providerName}.scope` as any),
      callbackURL: this._getAuthCallbackUrl(providerName),
    };
  };

  processUserFromSSO(req: any, profile: any, origin: string, done: VerifiedCallback) {

    UserModel.findOneAndUpdate(
      { origin, originId: profile.id },
      {
        email: profile.email,
        name: profile.name,
        origin,
        originId: profile.id,
      },
      { upsert: true },
      (err, user) => {
        if (err) {
          return done(err);
        }
        req.currentUser = user;
        return done(null, user);
      },
    );
  }

  _getAuthCallbackUrl(providerName: string) {
    return `${ConfigUtil.get('http.host')}:${ConfigUtil.get('http.port')}/auth/${providerName}/callback`;
  };
}

export default new AuthService();