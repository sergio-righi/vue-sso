import express from 'express'
import { TokenController } from '@/controllers'
import { AuthMiddleware } from '@/middlewares'

const router = express.Router()

router.post('/', AuthMiddleware, (req, res) => TokenController.create(req, res))
router.get('/', AuthMiddleware, (req, res) => TokenController.find(req, res))
router.patch('/grant/:id', AuthMiddleware, (req, res) =>
  TokenController.grant(req, res)
)
router.patch('/revoke/:id', AuthMiddleware, (req, res) =>
  TokenController.revoke(req, res)
)
router.patch('/reset/:id', AuthMiddleware, (req, res) =>
  TokenController.reset(req, res)
)

export default router
