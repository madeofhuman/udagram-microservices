import { Request, Response, NextFunction } from 'express';

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).json({ error: { message: err.message } });
};
