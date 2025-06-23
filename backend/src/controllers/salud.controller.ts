import { Request, Response, NextFunction } from 'express';
import { SaludService } from '../services/salud.service';
import { ApiCorrectResponse, CustomError, NotFoundError, checkIfChildBelongsToUser } from '../utils';
import { CreateEnfermedadDto, CreateVacunaDto } from '../dtos/salud';

const saludService = new SaludService();

export class SaludController {

  // ----- 🤧 Alergias ----- //

  public async crearAlergia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const dto = req.body;
      const nueva = await saludService.create(id_nino, dto);
      ApiCorrectResponse.genericSuccess(res, nueva, true, 'Alergia creada', 201);
    } catch (err) {
      next(err);
    }
  }

  public async listarAlergias(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const lista = await saludService.findAllByNino(id_nino);
      ApiCorrectResponse.genericSuccess(res, lista, true, 'Listado de alergias', 200);
    } catch (err) {
      next(err);
    }
  }

  public async actualizarAlergias(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await saludService.update(id_nino, id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Alergia actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  public async borrarAlergias(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await saludService.delete(id_nino, id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Alergia borrada', 204);
    } catch (err) {
      next(err);
    }
  }

  // ---- 🏥 Enfermedades ---- //

  public async crearEnfermedad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { id } = user;
      const id_nino = Number(req.params.id_nino);
      const dto:CreateEnfermedadDto = req.body;
      const childBelongsToUser = await checkIfChildBelongsToUser(id, id_nino);
      if (!childBelongsToUser) {
        throw new CustomError("USER_NOT_AUTHORIZED", 403, { error: "USER_NOT_AUTHORIZED" }, false);
      }
      const nueva = await saludService.createEnfermedad(id,dto);
      ApiCorrectResponse.genericSuccess(res, nueva, true, 'Enfermedad creada', 201);
    } catch (err) {
      next(err);
    }
  }
  
  public async actualizarEnfermedad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await saludService.updateEndermedad(id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Enfermedad actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  public async borrarEnfermedad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await saludService.deleteEnfermedad(id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Enfermedad borrada', 204);
    } catch (err) {
      next(err);
    }
  }

  public async listarEnfermedades(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const lista = await saludService.getAllEnfermedades(id_nino);
      ApiCorrectResponse.genericSuccess(res, lista, true, 'Listado de enfermedades', 200);
    } catch (err) {
      next(err);
    }
  }

  public async getEnfermedadById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const enfermedad = await saludService.getEnfermedad(id);
      if (!enfermedad) {
        throw new NotFoundError(
          'Enfermedad no encontrada',
          { error: 'ENFERMEDAD_NOT_FOUND' },
          false
        );
      }
      ApiCorrectResponse.genericSuccess(res, enfermedad, true, 'Enfermedad obtenida', 200);
    } catch (err) {
      next(err);
    }
  }

  // ---- 💉 Vacunas ---- //

  public async crearVacuna(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { id } = user;
      const id_nino = Number(req.params.id_nino);
      const dto:CreateVacunaDto = req.body;
      const childBelongsToUser = await checkIfChildBelongsToUser(id, id_nino);
      if (!childBelongsToUser) {
        throw new CustomError("USER_NOT_AUTHORIZED", 403, { error: "USER_NOT_AUTHORIZED" }, false);
      }
      const nueva = await saludService.createVacuna(id_nino, dto);
      ApiCorrectResponse.genericSuccess(res, nueva, true, 'Vacuna creada', 201);
    } catch (err) {
      next(err);
    }
  }

  public async listarVacunas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const lista = await saludService.getAllVacunas(id_nino);
      ApiCorrectResponse.genericSuccess(res, lista, true, 'Listado de vacunas', 200);
    } catch (err) {
      next(err);
    }
  }

  public async getVacunaById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const vacuna = await saludService.getVacuna(id);
      if (!vacuna) {
        throw new NotFoundError(
          'Vacuna no encontrada',
          { error: 'VACUNA_NOT_FOUND' },
          false
        );
      }
      ApiCorrectResponse.genericSuccess(res, vacuna, true, 'Vacuna obtenida', 200);
    } catch (err) {
      next(err);
    }
  }

  public async actualizarVacuna(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await saludService.updateVacuna(id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Vacuna actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  public async borrarVacuna(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await saludService.deleteVacuna(id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Vacuna borrada', 204);
    } catch (err) {
      next(err);
    }
  }

  
}

