// src/utils/apiResponse.ts
import { Response } from "express";
import { IUser } from "../interfaces";


export class ApiCorrectResponse {
  static genericSuccess(
    res: Response,
    data: any,
    success: boolean = true,
    message: string = "Success",
    statusCode: number = 200
  ) {
    const responseBody  = {
      success,
      message,
      data,
      statusCode
    };
    res.status(statusCode).json(responseBody);
  }

  static returnUserResponse(
    res:Response,
    data:{user: Omit<IUser , 'id' | 'contrasena'> },
    success: boolean,
    message: string,
    statusCode: number,
  ) {
    const responseBody  = {
      success: true,
      data,
      message,
      statusCode
    };
    res.status(statusCode).json(responseBody);
  }

}
