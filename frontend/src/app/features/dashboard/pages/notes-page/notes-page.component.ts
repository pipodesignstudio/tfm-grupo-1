import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INote } from '../../../../shared/interfaces/inote.interface';
import { NotesService } from '../../../../shared/services/notes.service';
import { ButtonModule } from 'primeng/button';
import { NoteCardComponent } from '../../../../components/notes/note-card/note-card.component';
import { NotesFiltersComponent } from '../../../../components/notes/notes-filters/notes-filters.component';

@Component({
  standalone: true,
  selector: 'app-notes-page',
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.css'],
  imports: [
    CommonModule,
    ButtonModule,
    NoteCardComponent,
    NotesFiltersComponent,
  ]
})
export class NotesPageComponent implements OnInit {
  notes: INote[] = [];
  filteredNotes: INote[] = [];

  currentFilters: {
    search: string;
    date: Date | null;
    childId: number | null;
  } = {
    search: '',
    date: null,
    childId: null,
  };

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.notesService.notes$.subscribe((notes) => {
      this.notes = notes;
      this.applyFilters();
    });
  }

  onFiltersChange(filters: {
    search: string;
    date: Date | null;
    childId: number | null;
  }): void {
    const hasChangedChild = filters.childId !== this.currentFilters.childId;

    this.currentFilters = filters;

    if (hasChangedChild && filters.childId !== null) {
      this.notesService.getAllNotes(filters.childId);
    } else {
      this.applyFilters();
    }
  }

  private applyFilters(): void {
    const { search, date } = this.currentFilters;
    const searchText = search?.toLowerCase() || '';
    const selectedDate = date;

    this.filteredNotes = this.notes.filter((note) => {
      const matchesText =
        note.titulo.toLowerCase().includes(searchText) ||
        note.texto.toLowerCase().includes(searchText);

      const matchesDate = selectedDate
        ? new Date(note.fecha_creacion).toDateString() ===
          new Date(selectedDate).toDateString()
        : true;

      return matchesText && matchesDate;
    });
  }

  openNewNoteForm(): void {
    console.log('➡️ Abrir formulario de nueva nota');
  }

  editNote(note: INote): void {
    console.log('✏️ Editar nota:', note);
  }

  deleteNote(note: INote): void {
    console.log('🗑️ Eliminar nota:', note);
  }
}
