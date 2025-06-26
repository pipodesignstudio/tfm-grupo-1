import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { Note } from '../interfaces/api-responses/note-correct-response';
import { NewNoteDto, UpdateNoteDto } from '../interfaces/dto';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly baseUrl = `${environment.backendUrl}/api/notes`;

  // Obtener todas las notas de un niño
  public async getAllNotes(idNino: number): Promise<Note[] | null> {
    try {
      const response = await axios.get<Note[]>(`${this.baseUrl}/${idNino}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      return null;
    }
  }

  // Obtener una nota concreta
  public async getNoteById(idNino: number, idNota: number): Promise<Note | null> {
    try {
      const response = await axios.get<Note>(`${this.baseUrl}/${idNino}/${idNota}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la nota:', error);
      return null;
    }
  }

  // Crear una nueva nota usando DTO
  public async createNote(idNino: number, dto: NewNoteDto): Promise<Note | null> {
    try {
      const response = await axios.post<Note>(`${this.baseUrl}/${idNino}`, dto);
      return response.data;
    } catch (error) {
      console.error('Error al crear la nota:', error);
      return null;
    }
  }

  // Actualizar una nota usando DTO
  public async updateNote(idNino: number, idNota: number, dto: UpdateNoteDto): Promise<Note | null> {
    try {
      const response = await axios.put<Note>(`${this.baseUrl}/${idNino}/${idNota}`, dto);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
      return null;
    }
  }
}
