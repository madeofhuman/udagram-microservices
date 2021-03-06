import { Request, Response, NextFunction } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../../../config/config';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  let response: AxiosResponse;
  let axiosConf: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
  if (req?.headers?.authorization) {
    axiosConf.headers.Authorization = req.headers.authorization;
  }
  try {
    response = await axios.get<{ auth: boolean; message: string }>(
      `${config.user_service_host}/api/v0/users/auth/verification`,
      axiosConf
    );
  } catch (error) {
    return res
      .status(error.response.status)
      .send({ error: { message: error.response.data.message } });
  }

  if (response.data.auth) {
    return next();
  } else {
    return res.status(response.status).send({ error: { message: response.data.message } });
  }
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
