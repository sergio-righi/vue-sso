import passport from 'passport';
import { Request } from 'express';
import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';

import { UserModel } from '@/models';
import { TokenType } from "@/utils/jwt";
import { env, crypto, jwt } from '@/utils';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req: Request) => {
        try {
          if (!req.headers.authorization) {
            throw new Error('token was not provided, authorization header is empty');
          }

          const tokenFromHeader = req.headers.authorization.replace('Bearer ', '').trim();
          const decryptedToken = crypto.decrypt(tokenFromHeader);
          const tokenType = jwt.getTokenType(decryptedToken);

          if (tokenType !== TokenType.ACCESS_TOKEN) {
            throw new Error('wrong token type provided');
          }

          return decryptedToken;
        } catch (e) {
          console.error('Token is not valid', e.message);
          return null;
        }
      },
      secretOrKey: env.get('authorization.secret'),
      issuer: env.get('authentication.token.issuer'),
      audience: env.get('authentication.token.audience'),
      passReqToCallback: true,
    },
    (req: any, payload: any, done: VerifiedCallback) => {
      UserModel.findById(payload.sub, (err, user) => {
        if (err) {
          return done(err, false);
        }
        req.currentUser = user?.toObject();
        return !user ? done(null, false) : done(null, user);
      });
    },
  ),
);