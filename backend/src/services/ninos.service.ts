import prisma from '../config/prisma.config';
import { CreateNinoDto } from '../dtos/ninos/create-nino.dto';
import { UpdateNinoDto } from '../dtos/ninos/update-nino.dto';
import { NotFoundError, InternalServerError } from '../utils';

export class NinosService {
  /**
   * Crea un nuevo niño.
   * Convierte fecha_nacimiento (string) → Date y img_perfil (Base64) → Buffer.
   */
  async create(dto: CreateNinoDto) {
    try {
      const data: any = {
        ...dto,
        fecha_nacimiento: new Date(dto.fecha_nacimiento), // Prisma exige Date
      };
      if (dto.img_perfil) {
        data.img_perfil = Buffer.from(dto.img_perfil, 'base64');
      }
      return await prisma.ninos.create({ data });
    } catch (error) {
      console.error('Error real al crear niño:', error);
      throw new InternalServerError('Error al crear niño', { error: 'INTERNAL_SERVER_ERROR' });
    }
  }

  /** Obtiene un niño por ID. */
  async getById(id: number) {
    const nino = await prisma.ninos.findUnique({ where: { id } });
    if (!nino) throw new NotFoundError('Niño no encontrado', { error: 'NINO_NOT_FOUND' }, false);
    return nino;
  }

  /**
   * Actualiza un niño.
   * Solo actualiza los campos presentes en el DTO.
   * Convierte fecha_nacimiento y img_perfil cuando corresponda.
   */
  async update(id: number, dto: UpdateNinoDto) {
    try {
      const data: any = {};

      // Copiar campos simples
      Object.entries(dto).forEach(([key, val]) => {
        if (val !== undefined && key !== 'img_perfil' && key !== 'fecha_nacimiento') {
          data[key] = val;
        }
      });

      // Manejar fecha_nacimiento
      if (dto.fecha_nacimiento !== undefined) {
        data.fecha_nacimiento = new Date(dto.fecha_nacimiento);
      }

      // Manejar imagen
      if ('img_perfil' in dto) {
        data.img_perfil = dto.img_perfil ? Buffer.from(dto.img_perfil, 'base64') : null;
      }

      const result = await prisma.ninos.updateMany({ where: { id }, data });
      if (result.count === 0) {
        throw new NotFoundError('Niño no encontrado', { error: 'NINO_NOT_FOUND' }, false);
      }
    } catch (error) {
      console.error('Error real al actualizar niño:', error);
      throw new InternalServerError('Error al actualizar niño', { error: 'INTERNAL_SERVER_ERROR' });
    }
  }

  /** Elimina un niño. */
  async delete(id: number) {
    try {
      const result = await prisma.ninos.deleteMany({ where: { id } });
      if (result.count === 0) {
        throw new NotFoundError('Niño no encontrado', { error: 'NINO_NOT_FOUND' }, false);
      }
      return { message: 'Niño eliminado' };
    } catch (error) {
      console.error('Error real al eliminar niño:', error);
      throw new InternalServerError('Error al eliminar niño', { error: 'INTERNAL_SERVER_ERROR' });
    }
  }

  /** Lista los niños pertenecientes a una familia. */
  async listByFamilia(familiaId: number) {
    try {
      return await prisma.ninos.findMany({ where: { familia_id: familiaId } });
    } catch (error) {
      console.error('Error real al listar niños:', error);
      throw new InternalServerError('Error al listar niños', { error: 'INTERNAL_SERVER_ERROR' });
    }
  }
}