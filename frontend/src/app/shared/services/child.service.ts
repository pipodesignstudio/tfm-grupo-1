import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';
import { IChild } from '../interfaces';
import { TokenService } from '../../features/auth/services';

export interface ChildProfile {
  id: number;
  name: string;
  dob: string;
  profileImageUrl: string | null;
  gender?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private apiUrl: string = 'http://localhost:3000/api';

  private readonly tokenService = inject(TokenService);

  async getChildrenByFamily(id_familia: string): Promise<IChild[]> {
    const response = await axios.get<{ data: IChild[] }>(
      `${this.apiUrl}/ninos/familia/${id_familia}`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

  async addChild(childData: Partial<IChild>): Promise<IChild> {
    const response = await axios.post<{ data: IChild }>(
      `${this.apiUrl}/ninos`,
      childData,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

  async deleteChild(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/ninos/${id}`, {
      headers: { Authorization: `Bearer ${this.tokenService.token()}` },
    });
  }

  private childrenSubject = new BehaviorSubject<ChildProfile[]>([]);
  public children$: Observable<ChildProfile[]> =
    this.childrenSubject.asObservable();

  private nextId = 1;

  constructor() {
    const storedChildren = localStorage.getItem('children');
    if (storedChildren) {
      const children = JSON.parse(storedChildren);
      this.childrenSubject.next(children);
      if (children.length > 0) {
        this.nextId = Math.max(...children.map((c: ChildProfile) => c.id)) + 1;
      }
    }
  }

  addChildLocalStorage(childData: Omit<ChildProfile, 'id'>): void {
    const newChild: ChildProfile = {
      ...childData,
      id: this.nextId++,
    };
    const currentChildren = this.childrenSubject.getValue();
    const updatedChildren = [...currentChildren, newChild];
    this.childrenSubject.next(updatedChildren);
    this.saveChildrenToLocalStorage(updatedChildren);
  }

  getChildren(): ChildProfile[] {
    return this.childrenSubject.getValue();
  }

  private saveChildrenToLocalStorage(children: ChildProfile[]): void {
    localStorage.setItem('children', JSON.stringify(children));
  }

  clearChildren(): void {
    this.childrenSubject.next([]);
    localStorage.removeItem('children');
    this.nextId = 1;
  }
}
