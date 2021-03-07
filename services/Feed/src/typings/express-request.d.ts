declare namespace Express {
  export interface Request {
    fileName?: string;
    status?: number;
    caption?: string;
    auth?: boolean;
    message?: string;
  }
}
