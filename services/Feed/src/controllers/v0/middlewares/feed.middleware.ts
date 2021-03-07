import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import { config } from '../../../config/config';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req?.headers?.authorization) {
    req.status = 401;
    req.auth = false;
    req.message = "No authorization headers.";
    return next();
  }
  const token_bearer = req.headers.authorization.split(" ");
  if (token_bearer.length != 2) {
    req.status = 401;
    req.auth = false;
    req.message = "Malformed token.";
    return next();
  }
  const token = token_bearer[1];

  return jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      req.status = 500;
      req.auth = false;
      req.message = "Failed to authenticate.";
      return next();
    }
    req.status = 200;
    req.auth = true;
    req.message = "Authenticated.";

    return next();
  });
}

export function requireFeedData(req: Request, res: Response, next: NextFunction) {
  const caption = req.body.caption;
  const fileName = req.body.url;
  if (!caption) {
    return res.status(400).json({ error: { message: 'A valid caption is required.' } });
  }
  if (!fileName) {
    return res.status(400).send({ error: { message: 'A valid file url is required.' } });
  }
  req.caption = caption;
  req.fileName = fileName;

  return next();
}
