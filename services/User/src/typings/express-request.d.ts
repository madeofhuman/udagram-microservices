declare namespace Express {
  export interface Request {
    auth?: boolean;
    status?: number;
    message?: string;
  }
}
