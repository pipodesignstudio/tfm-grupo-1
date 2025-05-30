// src/services/LogService.ts
import { Request } from 'express'; // Para obtener contexto de la solicitud
import Log, { ILogErrorData, IUserActionData } from '../mongo/mongo-log.model';
import { CustomError } from '../utils';

export class MongoLogService {

  /**
   * Registra un evento de error en la base de datos de logs.
   * @param error El objeto Error o CustomError.
   * @param req El objeto Request de Express para obtener contexto (opcional).
   * @param details Datos adicionales relevantes al error.
   */
  public async logError(error: Error | CustomError, req?: Request, details?: object): Promise<void> {
    const errorData: ILogErrorData = {
      message: error.message,
      stack: error.stack,
      details: details,
    };

    if (error instanceof CustomError) {
      errorData.code = error.statusCode.toString(); 
      if (error.data) {
        errorData.details = { ...errorData.details, ...error.data }; 
      }
    } else {
      errorData.code = 'UNEXPECTED_ERROR'; 
    }

    if (req) {
      errorData.request = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip, 
        userId: req.user?.id, 
      };
    }

    try {
      const logEntry = new Log({
        type: 'error',
        error: errorData,
      });
      await logEntry.save();
      console.log('✅ Error logeado en MongoDB:', errorData.message);
    } catch (dbError) {
      console.error('❌ Error al logear el error en MongoDB:', dbError);
    }
  }

  /**
   * Registra un evento de acción de usuario en la base de datos de logs.
   * @param userId El ID del usuario que realizó la acción.
   * @param action La descripción de la acción (ej. 'LOGIN', 'UPDATE_PROFILE').
   * @param details Datos adicionales relevantes a la acción.
   */
  public async logUserAction(userId: number, action: string): Promise<void> {
    const userActionData: IUserActionData = {
      userId: userId,
      action: action,
    };

    try {
      const logEntry = new Log({
        type: 'userAction',
        userAction: userActionData,
      });
      await logEntry.save();
      console.log('✅ Acción de usuario logeada en MongoDB:', action); 
    } catch (dbError) {
      console.error('❌ Error al logear la acción de usuario en MongoDB:', dbError);
    }
  }
}