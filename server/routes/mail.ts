import express from 'express'
import { MailController } from '@/controllers'
import { AuthMiddleware } from '@/middlewares'

const router = express.Router()

router.post('/verification-code', AuthMiddleware, (req, res) =>
  MailController.verificationCode(req, res)
)
router.post('/forget-password', AuthMiddleware, (req, res) =>
  MailController.forgetPassword(req, res)
)

export default router
