import { Request, Response } from 'express'
import { MailService } from "@/services";

class MailsController {
  async verificationCode(res: Response, req: Request) {
    res.status(await MailService.verificationCode(req.body))
  }

  async forgetPassword(res: Response, req: Request) {
    res.status(await MailService.forgetPassword(req.body))
  }
}

export default new MailsController();