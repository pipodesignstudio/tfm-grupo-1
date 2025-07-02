import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INote, INoteCreate, INoteUpdate } from '../interfaces/inote.interface';
import { TokenService } from '../../features/auth/services/token.service';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly baseUrl = `${environment.backendUrl}/api/notes`;

  private notesSubject = new BehaviorSubject<INote[]>([]);
  public notes$: Observable<INote[]> = this.notesSubject.asObservable();

  constructor(private tokenService: TokenService) {}

  private getAuthHeaders() {
    const token = this.tokenService.token();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  public async getAllNotes(idNino: number): Promise<void> {
    try {
      const response = await axios.get<{ data: INote[] }>(
        `${this.baseUrl}/${idNino}`,
        this.getAuthHeaders()
      );
      this.notesSubject.next(response.data.data);
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      this.notesSubject.next([]);
    }
  }

  public async getNoteById(idNino: number, idNota: number): Promise<INote | null> {
    try {
      const response = await axios.get<{ data: INote }>(
        `${this.baseUrl}/${idNino}/${idNota}`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener la nota:', error);
      return null;
    }
  }

  public async createNote(idNino: number, noteData: INoteCreate): Promise<void> {
    try {
      const response = await axios.post<{ data: INote }>(
        `${this.baseUrl}/${idNino}`,
        noteData,
        this.getAuthHeaders()
      );
      const currentNotes = this.notesSubject.getValue();
      this.notesSubject.next([...currentNotes, response.data.data]);
    } catch (error) {
      console.error('Error al crear la nota:', error);
    }
  }

  public async updateNote(idNino: number, idNota: number, noteData: INoteUpdate): Promise<void> {
    try {
      const response = await axios.put<{ data: INote }>(
        `${this.baseUrl}/${idNino}/${idNota}`,
        noteData,
        this.getAuthHeaders()
      );
      const updatedNote = response.data.data;
      const updatedNotes = this.notesSubject.getValue().map(note =>
        note.id === idNota ? updatedNote : note
      );
      this.notesSubject.next(updatedNotes);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  }

  public async deleteNote(idNino: number, idNota: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${idNino}/${idNota}`, this.getAuthHeaders());
      const updatedNotes = this.notesSubject.getValue().filter(note => note.id !== idNota);
      this.notesSubject.next(updatedNotes);
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  }

  public getNotes(): INote[] {
    return this.notesSubject.getValue();
  }

  public clearNotes(): void {
    this.notesSubject.next([]);
  }
}

export type { INote };
