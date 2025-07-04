import { computed, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';
import { CreateNinoDto, IChild } from '../interfaces';
import { TokenService } from '../../features/auth/services';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private apiUrl: string = 'http://localhost:3000/api';
  private childrenSubject = new BehaviorSubject<IChild[]>([]);
  public children$: Observable<IChild[]> = this.childrenSubject.asObservable();
  private readonly tokenService = inject(TokenService);
  private token = computed(() => this.tokenService.token());

  // Carga los niños de la familia desde el backend y actualiza el observable
  async getChildrenByFamily(id_familia: string): Promise<IChild[]> {
    const response = await axios.get<{ data: IChild[] }>(
      `${this.apiUrl}/ninos/familia/${id_familia}`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    const children = response.data.data;
    this.childrenSubject.next(children); // Actualiza el observable
    return children;
  }

  // Añade un niño y actualiza el observable
  async addChild(childData: Partial<IChild>): Promise<IChild> {
    const response = await axios.post<{ data: IChild }>(
      `${this.apiUrl}/ninos`,
      childData,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    // Refresca la lista desde el backend
    const familia_id = childData.familia_id?.toString();
    if (familia_id) {
      await this.getChildrenByFamily(familia_id);
    }
    return response.data.data;
  }

  // Borra un niño individualmente (no actualiza el observable automáticamente)
  async deleteChild(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/ninos/${id}`, {
      headers: { Authorization: `Bearer ${this.tokenService.token()}` },
    });
    const updatedChildren = this.childrenSubject
      .getValue()
      .filter((child) => child.id !== id);
    this.childrenSubject.next(updatedChildren);
  }

  // Borra todos los niños de la familia y limpia el observable
  async deleteAllChildrenByFamily(familia_id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/ninos/familia/${familia_id}`, {
      headers: { Authorization: `Bearer ${this.tokenService.token()}` },
    });
    this.childrenSubject.next([]);
  }

  clearChildren(): void {
    this.childrenSubject.next([]);
  }

  public async getNinoById(id: number): Promise<IChild | null> {
    try {
      const response = await axios.get<{ data: IChild }>(
        `${this.apiUrl}/ninos/${id}`,
        {
          headers: { Authorization: `Bearer ${this.tokenService.token()}` },
        }
      );
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener niño:', error);
      return null;
    }
  }

  private async createPerfilAprendizaje(nombre:string, apellido:string):Promise<number | null> {
    try {
      const response = await axios.post<{ data: number }>(
        `${this.apiUrl}/perfil-aprendizaje`,
        { nombre: `Perfil de ${nombre} ${apellido}`,
        descripcion: `Perfil de aprendizaje de ${nombre} ${apellido}`,
      },
        {
          headers: { Authorization: `Bearer ${this.tokenService.token()}` },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al crear perfil de aprendizaje:', error);
      return null;
    }
  }

  async createChild(childData: Omit<CreateNinoDto, 'perfiles_aprendizaje_id'>): Promise<IChild | null> {
    try {
      const perfiles_aprendizaje_id = await this.createPerfilAprendizaje(childData.nombre, childData.apellido);
      const ninoDto = {
        ...childData,
        perfiles_aprendizaje_id: perfiles_aprendizaje_id,
      };
      const response = await axios.post<{ data: IChild }>(
        `${this.apiUrl}/ninos`,
        ninoDto,
        {
          headers: { Authorization: `Bearer ${this.tokenService.token()}` },
        }
      );
      const familia_id = childData.familia_id?.toString();
      if (familia_id) {
        await this.getChildrenByFamily(familia_id);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error al crear perfil de aprendizaje:', error);
      return null;
    }

  }

}
