import { Request, Response } from 'express'

export default (req: Request, res: Response, next: any) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
}
