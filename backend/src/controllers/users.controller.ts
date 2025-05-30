import {  Request, Response } from "express";
import { ApiCorrectResponse, BadRequestError, NotFoundError } from "../utils";
import { UserService } from "../services";
import { UpdateUserDto } from "../dtos";

const userService = new UserService();

export class UsersController {
  public async retrieveUserDataFromToken(
    req: Request,
    res: Response
  ): Promise<void> {
    // Puedo usar nullcheck con tranquilidad porque el Middleware lo ha validado antes
    const reqUser = req.user!;

    const userWithoutPassword = await userService.getUserByRequest(reqUser);
    if (!userWithoutPassword)
      throw new NotFoundError(
        "No se ha encontrado el usuario",
        {
          error: "USER_NOT_FOUND",
        },
        false
      );

    ApiCorrectResponse.returnUserResponse(
      res,
      { user: userWithoutPassword },
      true,
      "Registrado con exito",
      200
    );
  }

  public async completeOnboarding(req: Request, res: Response): Promise<void> {
    const reqUser = req.user!;

    const success = await userService.completeUserOnboardingOrVerifyEmail(
      reqUser,
      "complete"
    );
    if (success) {
      ApiCorrectResponse.genericSuccess(
        res,
        {
          message: "USER_UPDATED",
        },
        true,
        "Actualizado con exito",
        200
      );
    }
  }

  public async verifyEmail(req: Request, res: Response): Promise<void> {
    const reqUser = req.user!;

    const success = await userService.completeUserOnboardingOrVerifyEmail(
      reqUser,
      "verify"
    );
    if (success) {
      ApiCorrectResponse.genericSuccess(
        res,
        {
          message: "USER_UPDATED",
        },
        true,
        "Actualizado con exito",
        200
      );
    }
  }

    public updateProfile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
      const dataToUpdate: UpdateUserDto = req.body;
      

      // Como los campos son opcionales, no vamos a impactar la BBDD con todos los campos vacios
      if (Object.keys(dataToUpdate).length === 0) {
        throw new BadRequestError(
          "No se han enviado datos para actualizar",
          {
            error: "EMPTY_FIELDS",
          },
          false
        );
      }

      const updatedUser = await userService.updateProfile(
        req.user!.id,
        dataToUpdate
      );

      ApiCorrectResponse.genericSuccess(
        res,
        updatedUser,
        true,
        "Perfil actualizado exitosamente.",
        200
      );
  };


  async deleteUser(req:Request, res:Response) {
    const reqUser = req.user!;
    const success = await userService.deleteUser(reqUser);
    if (success) {
      ApiCorrectResponse.genericSuccess(
        res,
        {
          message: "USER_DELETED",
        },
        true,
        "Eliminado con exito",
        200
      );
    }
  }

}
