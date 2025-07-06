import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { TokenService } from '../../features/auth/services';

export interface Alergia {
  id: number;
  nombre: string;
}

export interface Enfermedad {
  id: number;
  nombre: string;
  doctor: string;
}

export interface Vacuna {
  id: number;
  nombre: string;
  fecha: string | Date;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private apiUrl = 'http://localhost:3000/api';
  private readonly tokenService = inject(TokenService);

  private authHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    };
  }

  // ---------- Alergias ----------

  async getAlergias(id_nino: number): Promise<Alergia[]> {
    const res = await axios.get<{ data: Alergia[] }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/alergias`,
      this.authHeaders()
    );
    return res.data.data;
  }

  async addAlergia(id_nino: number, alergia: Alergia): Promise<Alergia> {
    const res = await axios.post<{ data: Alergia }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/alergias`,
      { nombre: alergia.nombre },
      this.authHeaders()
    );
    return res.data.data;
  }

  async updateAlergia(id_nino: number, alergia: Alergia): Promise<Alergia> {
    const res = await axios.put<{ data: Alergia }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/alergias/${alergia.id}`,
      { nombre: alergia.nombre },
      this.authHeaders()
    );
    return res.data.data;
  }

  async deleteAlergia(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/ninos/salud/alergias/${id}`, this.authHeaders());
  }

  // ---------- Enfermedades ----------

  async getEnfermedades(id_nino: number): Promise<Enfermedad[]> {
    const res = await axios.get<{ data: Enfermedad[] }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/enfermedades`,
      this.authHeaders()
    );
    return res.data.data;
  }

  async addEnfermedad(id_nino: number, enfermedad: Enfermedad): Promise<Enfermedad> {
    const res = await axios.post<{ data: Enfermedad }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/enfermedades`,
      { nombre: enfermedad.nombre, doctor: enfermedad.doctor },
      this.authHeaders()
    );
    return res.data.data;
  }

  async updateEnfermedad(id_nino: number, enfermedad: Enfermedad): Promise<Enfermedad> {
    const res = await axios.patch<{ data: Enfermedad }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/enfermedades/${enfermedad.id}`,
      { nombre: enfermedad.nombre, doctor: enfermedad.doctor },
      this.authHeaders()
    );
    return res.data.data;
  }

  async deleteEnfermedad(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/ninos/salud/enfermedades/${id}`, this.authHeaders());
  }

  // ---------- Vacunas ----------

  async getVacunas(id_nino: number): Promise<Vacuna[]> {
    const res = await axios.get<{ data: Vacuna[] }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/vacunas`,
      this.authHeaders()
    );
    return res.data.data;
  }

  async addVacuna(id_nino: number, vacuna: Vacuna): Promise<Vacuna> {
    const fecha = this.formatFecha(vacuna.fecha);
    const res = await axios.post<{ data: Vacuna }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/vacunas`,
      { nombre: vacuna.nombre, fecha },
      this.authHeaders()
    );
    return res.data.data;
  }

  async updateVacuna(id_nino: number, id: number, vacuna: Vacuna): Promise<Vacuna> {
    const fecha = this.formatFecha(vacuna.fecha);
    const res = await axios.patch<{ data: Vacuna }>(
      `${this.apiUrl}/ninos/${id_nino}/salud/vacunas/${id}`,
      { nombre: vacuna.nombre, fecha },
      this.authHeaders()
    );
    return res.data.data;
  }

  async deleteVacuna(id_nino: number, id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/ninos/${id_nino}/salud/vacunas/${id}`, this.authHeaders());
  }

  // Utilidad: asegurar formato fecha ISO
  private formatFecha(fecha: string | Date): string {
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      return fecha.toISOString();
    }
    if (typeof fecha === 'string') {
      const parsed = new Date(fecha);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
    console.warn('⚠️ Fecha inválida:', fecha);
    return new Date().toISOString(); // fallback
  }
}
