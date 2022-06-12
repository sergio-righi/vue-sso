import { Request, Response } from 'express'

import { TokenModel } from "@/models";
import { TokenService } from "@/services";

const handleError = (res: Response, _: Error) => {
  res.status(500)
}

class TokenController {

  async create(req: Request, res: Response) {
    try {
      return await TokenModel.create(req.body)
    } catch (err) {
      handleError(res, err);
    }
  }

  async find(req: Request, res: Response) {
    try {
      return await TokenModel.findOne(req.params)
    } catch (err) {
      handleError(res, err);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { _id, ...query } = req.body;
      return await TokenModel.findByIdAndUpdate(_id, query, { new: true })
    } catch (err) {
      handleError(res, err);
    }
  }

  async done(req: Request, res: Response) {
    const { id } = req.params;
    const response = await TokenService.access(id, true);
    res.status(response.status).json(response.data);
  };

  async undone(req: Request, res: Response) {
    const { id } = req.params;
    const response = await TokenService.access(id, false);
    res.status(response.status).json(response.data);
  };

  async reset(req: Request, res: Response) {
    const { id } = req.params;
    const response = await TokenService.reset(id, req.body);
    res.status(response.status).json(response.data);
  };
}

export default new TokenController();