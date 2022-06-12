import { decode, sign, verify } from 'jsonwebtoken';
import { default as ConfigUtil } from './env';
import { default as CryptoUtil } from './crypto';

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

type JWT = { exp: number; type: TokenType; sub: string };

const generateToken = (userId: string, type: TokenType) => {
  const audience = ConfigUtil.get('authentication.token.audience');
  const issuer = ConfigUtil.get('authentication.token.issuer');
  const secret = ConfigUtil.get('authentication.token.secret');
  const expiresIn =
    type === TokenType.ACCESS_TOKEN
      ? ConfigUtil.get('authentication.token.expiresIn')
      : ConfigUtil.get('authentication.refreshToken.expiresIn');

  const token = sign({ type }, secret, {
    expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId,
  });

  return {
    token: CryptoUtil.encrypt(token),
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
    return (verify(token, ConfigUtil.get('authentication.token.secret')) as JWT).type;
  },

  parseTokenAndGetUserId: (token: string): string => {
    const decryptedToken = CryptoUtil.decrypt(token);
    const decoded = verify(decryptedToken, ConfigUtil.get('authentication.token.secret')) as JWT;
    return decoded.sub || '';
  }
}