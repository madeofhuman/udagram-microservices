/**
 * In order to Typescript accept custom properties in Express Request
 * object, this extension declaration is needed.
 */
declare namespace Express {
  export interface Request {
      caption?: string;
      fileName?: string;
  }
}
