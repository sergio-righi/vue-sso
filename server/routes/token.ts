import express from 'express'
import { TokenController } from '@/controllers'
import { auth } from '@/middlewares'

const router = express.Router()

router.post('/', auth, (req, res) => TokenController.create(req, res))
router.get('/', auth, (req, res) => TokenController.find(req, res))
router.patch('/grant/:id', auth, (req, res) => TokenController.grant(req, res))
router.patch('/revoke/:id', auth, (req, res) =>
  TokenController.revoke(req, res)
)
router.patch('/reset/:id', auth, (req, res) => TokenController.reset(req, res))

export default router
