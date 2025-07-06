import { IRequestUser } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?:IRequestUser
    }
  }
}

export {};