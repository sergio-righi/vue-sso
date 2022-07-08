import { decode, sign, verify } from 'jsonwebtoken';
import { default as env } from './env';
import { default as crypto } from './crypto';

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

type JWT = { exp: number; type: TokenType; sub: string };

const generateToken = (userId: string, type: TokenType) => {
  const audience = env.get('authentication.token.audience');
  const issuer = env.get('authentication.token.issuer');
  const secret = env.get('authorization.secret');
  const expiresIn =
    type === TokenType.ACCESS_TOKEN
      ? env.get('authentication.token.expiresIn')
      : env.get('authentication.refreshToken.expiresIn');

  const token = sign({ type }, secret, {
    expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId,
  });

  return {
    token: crypto.encrypt(token),
    expiration: (decode(token) as JWT).exp * 1000,
  };
};

export default {
  generateAccessToken: (userId: string) => {
    return generateToken(userId, TokenType.ACCESS_TOKEN);
  },

  generateRefreshToken: (userId: string) => {
    return generateToken(userId, TokenType.REFRESH_TOKEN);
  },

  getTokenType: (token: string): TokenType => {
    return (verify(token, env.get('authorization.secret')) as JWT).type;
  },

  parseTokenAndGetUserId: (token: string): string => {
    const decryptedToken = crypto.decrypt(token);
    const decoded = verify(decryptedToken, env.get('authorization.secret')) as JWT;
    return decoded.sub || '';
  }
}