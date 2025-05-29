import { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncMiddlewareWrapper(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}