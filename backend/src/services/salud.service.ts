import prisma from "../config/prisma.config";
import { CreateEnfermedadDto, CreateVacunaDto, UpdateEnfermedadDto, UpdateVacunaDto } from "../dtos/salud";
import { CreateAlergiaDto } from '../dtos/salud/create-alergia.dto';
import { UpdateAlergiaDto } from '../dtos/salud/update-alergia.dto';
import { IEnfermedad, IVacuna } from "../interfaces";
import { NotFoundError, InternalServerError } from '../utils';


// ----- 🤧 Alergias ----- //

export class SaludService {
  public async create(id_nino: number, dto: CreateAlergiaDto) {
    try {
      return await prisma.alergias.create({
        data: { nombre: dto.nombre, ninos_id: id_nino }
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        'Error interno al crear la alergia',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async findAllByNino(id_nino: number) {
    return await prisma.alergias.findMany({ where: { ninos_id: id_nino } });
  }

  public async update(id_nino: number, id: number, dto: UpdateAlergiaDto) {
    const result = await prisma.alergias.updateMany({
      where: { id, ninos_id: id_nino },
      data: { nombre: dto.nombre! }
    });
    if (result.count === 0) {
      throw new NotFoundError(
        'Alergia no encontrada',
        { error: 'ALERGIA_NOT_FOUND' },
        false
      );
    }
    return;
  }

  public async delete(id_nino: number, id: number) {
    const result = await prisma.alergias.deleteMany({ where: { id, ninos_id: id_nino } });
    if (result.count === 0) {
      throw new NotFoundError(
        'Alergia no encontrada',
        { error: 'ALERGIA_NOT_FOUND' },
        false
      );
    }
    return;
  }


  // ----- 🏥 Enfermedades ----- //


  public async createEnfermedad(id: number, dto: CreateEnfermedadDto):Promise<IEnfermedad> {
    try {
      const enfermedad:IEnfermedad = await prisma.enfermedades.create({
        data: { nombre: dto.nombre, ninos_id: id, doctor: dto.doctor }
      });
      return enfermedad;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al crear la enfermedad',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async updateEndermedad(id:number, dto:UpdateEnfermedadDto):Promise<IEnfermedad> {
    try {
      const enfermedad:IEnfermedad = await prisma.enfermedades.update({
        where: { id },
        data: { nombre: dto.nombre, doctor: dto.doctor }
      });
      return enfermedad;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al actualizar la enfermedad',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async deleteEnfermedad(id:number):Promise<IEnfermedad> {
    try {
      const enfermedad:IEnfermedad = await prisma.enfermedades.delete({
        where: { id },
      });
      return enfermedad;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al eliminar la enfermedad',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async getAllEnfermedades(id_nino: number):Promise<IEnfermedad[]> {
    try {
      const enfermedades:IEnfermedad[] = await prisma.enfermedades.findMany({ where: { ninos_id: id_nino } });
      return enfermedades;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al obtener las enfermedades',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async getEnfermedad(id:number):Promise<IEnfermedad | null> {
    try {
      const enfermedad:IEnfermedad | null = await prisma.enfermedades.findUnique({ where: { id } });
      if (!enfermedad) {
        throw new NotFoundError(
          'Enfermedad no encontrada',
          { error: 'ENFERMEDAD_NOT_FOUND' },
          false
        );
      }
      return enfermedad;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al obtener la enfermedad',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  // ---- 💉 Vacunas ---- /
  
  public async createVacuna(id_nino: number, dto: CreateVacunaDto): Promise<IVacuna> {
    try {
      const vacuna:IVacuna = await prisma.vacunas.create({
        data: { nombre: dto.nombre, fecha: dto.fecha, ninos_id: id_nino }
      });
      return vacuna;
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        'Error interno al crear la vacuna',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async updateVacuna(id:number, dto:UpdateVacunaDto):Promise<IVacuna> {
    try {
      const vacuna:IVacuna = await prisma.vacunas.update({
        where: { id },
        data: { nombre: dto.nombre, fecha: dto.fecha }
      });
      return vacuna;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al actualizar la vacuna',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async deleteVacuna(id:number):Promise<IVacuna> {
    try {
      const vacuna:IVacuna = await prisma.vacunas.delete({
        where: { id },
      });
      return vacuna;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al eliminar la vacuna',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async getAllVacunas(id_nino: number):Promise<IVacuna[]> {
    try {
      const vacunas:IVacuna[] = await prisma.vacunas.findMany({ where: { ninos_id: id_nino } });
      return vacunas;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al obtener las vacunas',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  } 

  public async getVacuna(id:number):Promise<IVacuna | null> {
    try {
      const vacuna:IVacuna | null = await prisma.vacunas.findUnique({ where: { id } });
      if (!vacuna) {
        throw new NotFoundError(
          'Vacuna no encontrada',
          { error: 'VACUNA_NOT_FOUND' },
          false
        );
      }
      return vacuna!;
    } catch (error) {
      throw new InternalServerError(
        'Error interno al obtener la vacuna',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }


}