import cron from 'node-cron';
import { subDays, subWeeks, subMonths, isSameDay } from 'date-fns';
import dotenv from "dotenv";


import prisma from "../config/prisma.config";
import { NewReminderDto, UpdateReminderDto } from "../dtos";
import { IReminder } from "../interfaces";
import { BadRequestError, InternalServerError, logger, NotFoundError } from "../utils";
import { EmailService } from './email.service';

dotenv.config();


export class RemindersService {
    private emailService: EmailService = new EmailService();
    private url = process.env.FRONTEND_URL;

     constructor() {
    // Activar el cron al arrancar. Todos los días a las 9
    cron.schedule('0 9 * * *', () => this.handleDailyReminders());
  }

    /**
     * Crea un nuevo recordatorio para una actividad.
     *
     * @param dto - Los datos del recordatorio.
     * @param userId - El ID del usuario que crea el recordatorio.
     * @returns El recordatorio recién creado.
     * @throws {BadRequestError} - Si ya existe un recordatorio
     *                            para esta actividad.
     */
async createInvitation(dto:NewReminderDto, userId:number):Promise<IReminder> {
    const reminder = await prisma.recordatorios.findFirst({
        where: {usuario_id: userId, actividad_id: dto.actividadId},
    });
    if (reminder) {
        const err = new BadRequestError(
            "Ya tienes un recordatorio para esta actividad.",
            { error: "REMINDER_ALREADY_EXISTS" },
            false
        );
        logger.logError(err);
        throw err;
    }
    else {
        try {
            const reminder = await prisma.recordatorios.create({
            data: {
                usuario_id: userId,
                actividad_id: dto.actividadId,
                periodicidad: dto.periodicidad,
                activo: true,
            },
        });
        const response:IReminder = {
            id: reminder.id,
            activityId: reminder.actividad_id,
            userId: reminder.usuario_id,
            frequency: reminder.periodicidad,
            active: reminder.activo,
        };
        return response;
        } catch (error) {
           const err = new InternalServerError(
               "Error al crear el recordatorio.",
               { error: "INTERNAL_SERVER_ERROR" },
               false
           ) 
           logger.logError(err);
           throw err;
        }
    }
 }


    /**
     * Actualiza un recordatorio existente.
     *
     * @param dto - Los datos del recordatorio a actualizar.
     * @param userId - El ID del usuario que actualiza el recordatorio.
     * @returns El recordatorio actualizado.
     * @throws {NotFoundError} - Si el recordatorio no existe o no pertenece al
     *                           usuario que lo actualiza.
     * @throws {InternalServerError} - Para otros errores inesperados de la base
     *                                de datos.
     */
async updateReminder(dto: UpdateReminderDto, userId: number): Promise<IReminder> {
    const reminder = await prisma.recordatorios.findUnique({
        where: { id: dto.remiderId },
    });

    if (!reminder || reminder.usuario_id !== userId) {
        const err = new NotFoundError(
            'Recordatorio no encontrado.',
            { error: 'REMINDER_NOT_FOUND' },
            false
        );
        logger.logError(err);
        throw err;
    }

    const updated = await prisma.recordatorios.update({
        where: { id: dto.remiderId },
        data: {
            ...(dto.periodicidad !== undefined && { periodicidad: dto.periodicidad }),
            ...(dto.activo !== undefined && { activo: dto.activo }),
        },
    });

    const response: IReminder = {
        id: updated.id,
        activityId: updated.actividad_id,
        userId: updated.usuario_id,
        frequency: updated.periodicidad,
        active: updated.activo,
    };

    return response;
}

/**
 * Obtiene todos los recordatorios de un usuario.
 *
 * @param userId - El ID del usuario.
 * @returns Lista de recordatorios.
 */
async getAllRemindersByUser(userId: number): Promise<IReminder[]> {
  const reminders = await prisma.recordatorios.findMany({
    where: { usuario_id: userId },
  });

  return reminders.map((reminder) => ({
    id: reminder.id,
    activityId: reminder.actividad_id,
    userId: reminder.usuario_id,
    frequency: reminder.periodicidad,
    active: reminder.activo,
  }));
}

    /**
     * Maneja el env o de correos electrónicos a los usuarios que tienen
     * recordatorios activos.
     *
     * Verifica si el recordatorio debe ser enviado seg n su periodicidad
     * y si el  ltimo env o fue hoy. Si es así, envía el correo y actualiza
     * el  último envío en la base de datos.
     *
     * @private
     */
 private async handleDailyReminders() {
    const now = new Date();
    logger.logInfo('⏰ Ejecutando recordatorios diarios...');

    const reminders = await prisma.recordatorios.findMany({
      where: { activo: true },
    });

    for (const reminder of reminders) {
      const { ultimo_envio, periodicidad, id, actividad_id, usuario_id } = reminder;

      let shouldSend = false;

      if (!ultimo_envio) {
        shouldSend = true;
      } else {
        const lastSent = new Date(ultimo_envio);
        switch (periodicidad) {
          case 'daily':
            shouldSend = isSameDay(lastSent, subDays(now, 1));
            break;
          case 'weekly':
            shouldSend = isSameDay(lastSent, subWeeks(now, 1));
            break;
          case 'monthly':
            shouldSend = isSameDay(lastSent, subMonths(now, 1));
            break;
        }
      }

      if (shouldSend) {
        const [actividad, usuario] = await Promise.all([
          prisma.actividades.findUnique({ where: { id: actividad_id } }),
          prisma.usuarios.findUnique({ where: { id: usuario_id } }),
        ]);

        if (actividad && usuario) {
          await this.emailService.sendRecordatorio(
            usuario.email,
            usuario.nick,
            actividad.titulo ?? '',
            this.url ?? 'http://localhost:4200'
          )
          logger.logInfo(`📧 Enviar recordatorio a ${usuario.email} sobre "${actividad.titulo}"`);

          await prisma.recordatorios.update({
            where: { id },
            data: { ultimo_envio: now },
          });
        }
      }
    }
  }

  /**
 * Obtiene un recordatorio por su ID y usuario.
 *
 * @param id - El ID del recordatorio.
 * @param userId - El ID del usuario.
 * @returns El recordatorio encontrado.
 * @throws {NotFoundError} - Si no se encuentra o no pertenece al usuario.
 */
async getReminderById(id: number, userId: number): Promise<IReminder> {
  const reminder = await prisma.recordatorios.findUnique({
    where: { id },
  });

  if (!reminder || reminder.usuario_id !== userId) {
    const err = new NotFoundError(
      "Recordatorio no encontrado.",
      { error: "REMINDER_NOT_FOUND" },
      false
    );
    logger.logError(err);
    throw err;
  }

  return {
    id: reminder.id,
    activityId: reminder.actividad_id,
    userId: reminder.usuario_id,
    frequency: reminder.periodicidad,
    active: reminder.activo,
  };
}



}