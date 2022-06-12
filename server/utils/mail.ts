import nodemailer from "nodemailer";
import { OAuth2Client } from 'google-auth-library';

import { default as ConfigUtil } from './env';

const params = {
  user: String(ConfigUtil.get('mail.gmail.account')),
  clientId: String(ConfigUtil.get('mail.gmail.clientID')),
  clientSecret: String(ConfigUtil.get('mail.gmail.clientSecret')),
  refreshToken: String(ConfigUtil.get('mail.gmail.refreshToken')),
}

const oauth2Client = new OAuth2Client(
  params.clientId,
  params.clientSecret,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: params.refreshToken
});

const createTransporter = async () => {

  const accessToken = await oauth2Client.getAccessToken();

  const transport: any = {
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: params.user,
      accessToken,
      clientId: params.clientId,
      clientSecret: params.clientSecret,
      refreshToken: params.refreshToken
    }
  }

  return nodemailer.createTransport(transport);
};

export default { createTransporter }