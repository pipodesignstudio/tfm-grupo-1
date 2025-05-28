import { Request, response, Response } from "express";
import { ApiResponse } from "../utils";



export class UsersController {

    public async retrieveUserData(req: Request, res: Response): Promise<void> {
          const user = req.user;

           ApiResponse.success(res, user, true, "Registrado con exito", 200);
       
    }

}