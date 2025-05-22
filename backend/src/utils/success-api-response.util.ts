// src/utils/apiResponse.ts
import { Response } from "express";
import { CustomError } from "./errors.util";

interface SuccessApiResponseData  {
  message?: string;
  data?: any;
  success: boolean;
  error?: Error | CustomError | any;
  statusCode?: number;
}

export class ApiResponse {
  static success(
    res: Response,
    data: any,
    success: boolean = true,
    message: string = "Success",
    statusCode: number = 200
  ) {
    const responseBody: SuccessApiResponseData  = {
      success,
      message,
      data,
      statusCode,
    };
    res.status(statusCode).json(responseBody);
  }

}
