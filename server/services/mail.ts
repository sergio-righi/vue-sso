import { FileUtil, MailUtil } from "@/utils"

class MailService {

  /**
   * create and send a verification code email
   * @param options from, to, subject and content
   * @returns 
   */

  async verificationCode(options: any) {
    const html = FileUtil.readAndReplace('verification_code.html', options.content);
    return await this.send({
      ...options.mail,
      html
    });
  }

  /**
   * create and send a reset password email
   * @param options  from, to, subject and content
   * @returns 
   */

  async forgetPassword(options: any) {
    const html = FileUtil.readAndReplace('forget_password.html', options.content);
    return await this.send({
      ...options.mail,
      html
    });
  }

  /**
   * send and email using the transporter
   * @param options the content of the email
   * @returns 
   */

  async send(options: any) {
    try {
      const transporter = await MailUtil.createTransporter();
      await transporter.sendMail(options);
      transporter.close();
      return 200;
    } catch (err) {
      return 500;
    }
  };
}

export default new MailService()