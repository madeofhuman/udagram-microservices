/**
 * In order to Typescript accept custom properties in Express Request
 * object, this extension declaration is needed.
 */
declare namespace Express {
  export interface Request {
    status?: number;
    auth?: boolean;
    message?: string;
  }
}
