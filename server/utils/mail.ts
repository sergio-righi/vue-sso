import { default as ConfigUtil } from './env';
import nodemailer from "nodemailer";
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  String(ConfigUtil.get('mail.gmail.clientID')),
  String(ConfigUtil.get('mail.gmail.clientSecret')),
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: String(ConfigUtil.get('mail.gmail.refreshToken'))
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
      user: String(ConfigUtil.get('mail.gmail.account')),
      accessToken,
      clientId: String(ConfigUtil.get('mail.gmail.clientID')),
      clientSecret: String(ConfigUtil.get('mail.gmail.clientSecret')),
      refreshToken: String(ConfigUtil.get('mail.gmail.refreshToken'))
    }
  }

  return nodemailer.createTransport(transport);
};

export default { createTransporter }