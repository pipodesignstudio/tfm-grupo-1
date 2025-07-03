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


  /**
   * Retrieves a list of children associated with a specific family by its ID.
   *
   * @param id_familia - The unique identifier of the family whose children are to be fetched.
   * @returns A promise that resolves to an array of `IChild` objects belonging to the specified family.
   * @throws Will throw an error if the HTTP request fails or if the response is invalid.
   */
  async getChildrenByFamily(id_familia: string): Promise<IChild[]> {
    const response = await axios.get<{ data: IChild[] }>(
      `${this.apiUrl}/ninos/familia/${id_familia}`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }
  /**
   * Retrieves a specific child by their ID.
   *
   * @param id - The unique identifier of the child to be fetched.
   * @returns A promise that resolves to an `IChild` object representing the specified child.
   * @throws Will throw an error if the HTTP request fails or if the response is invalid.
   */
  async getChildById(id: number): Promise<IChild> {
    const response = await axios.get<{ data: IChild }>(
      `${this.apiUrl}/ninos/${id}`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }
  /**
   * Adds a new child to the system.
   *
   * @param childData - An object containing the details of the child to be added.
   * @returns A promise that resolves to the newly created `IChild` object.
   * @throws Will throw an error if the HTTP request fails or if the response is invalid.
   */
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
  
  /**
   * Deletes a specific child by their ID.
   *
   * @param id - The unique identifier of the child to be deleted.
   * @returns A promise that resolves when the child has been successfully deleted.
   * @throws Will throw an error if the HTTP request fails or if the response is invalid.
   */
  async deleteChild(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/ninos/${id}`,
      {
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
