import express from 'express'
import { MailController } from '@/controllers'
import { auth } from '@/middlewares'

const router = express.Router()

router.post('/verification-code', auth, (req, res) =>
  MailController.verificationCode(req, res)
)
router.post('/forget-password', auth, (req, res) =>
  MailController.forgetPassword(req, res)
)

export default router
