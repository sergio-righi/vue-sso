import fs from 'fs';
import { join } from 'path';
import passport from 'passport';
import { VerifiedCallback } from 'passport-jwt';

import { UserModel } from '@/models';
import { env, helper } from '@/utils';

class AuthService {

  /**
   * middleware used to authenticate the user
   */

  requireAuth = passport.authenticate('jwt', {
    userProperty: 'currentUser',
    session: false,
  });

  /**
 * init the providers
 */

  init() {
    const providersPath = join(__dirname, '..', 'providers');
    fs.readdirSync(providersPath).forEach((file) => {
      const authFile = helper.removeExtensionFromFile(file);
      import(join(providersPath, authFile));
    });
  };

  /**
 * get the configuration of the provider by name
 */

  getConfigByProviderName(providerName: string) {
    return {
      clientID: env.get(`authentication.${providerName}.clientID` as any),
      clientSecret: env.get(`authentication.${providerName}.clientSecret` as any),
      scope: env.get(`authentication.${providerName}.scope` as any),
      callbackURL: this._getAuthCallbackUrl(providerName),
    };
  };

  /**
 * process the return from the third party authentication provider
 */

  processUserFromSSO(req: any, profile: any, origin: string, done: VerifiedCallback) {

    UserModel.findOneAndUpdate(
      { origin, originId: profile.id },
      {
        email: profile.email,
        name: profile.name,
        origin,
        verified: true,
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
    return `${env.get('http.host')}:${env.get('http.port')}/auth/${providerName}/callback`;
  }

  /**
   * it runs a find function only considering local users
   * @param query 
   * @returns 
   */

  async find(query: any) {
    try {
      const response = await UserModel.findOne({ ...query, password: { $exists: true } }, { new: true });
      return { status: 200, data: response };
    } catch (error) {
      return { status: 500 }
    }
  }
}

export default new AuthService();