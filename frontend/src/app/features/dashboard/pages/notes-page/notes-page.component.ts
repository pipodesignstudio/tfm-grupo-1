import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INote } from '../../../../shared/interfaces/inote.interface';
import { NotesService } from '../../../../shared/services/notes.service';
import { ButtonModule } from 'primeng/button';
import { NoteCardComponent } from '../../../../components/notes/note-card/note-card.component';
import { NotesFiltersComponent } from '../../../../components/notes/notes-filters/notes-filters.component';
import { NoteFormComponent } from '../../../../components/notes/note-form/note-form.component';
import { ChildService } from '../../../../shared/services/child.service';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';
import { IChild } from '../../../../shared/interfaces';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

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
    NoteFormComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class NotesPageComponent implements OnInit {
  notes: INote[] = [];
  filteredNotes: INote[] = [];

  showForm = false;
  childrenOptions: { label: string; value: number }[] = [];
  noteToEdit: INote | null = null;

  currentFilters: {
    search: string;
    date: Date | null;
    childId: number | null;
  } = {
      search: '',
      date: null,
      childId: null,
    };

  constructor(
    private notesService: NotesService,
    private childService: ChildService,
    private familiesStore: FamiliesStore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

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
        ? new Date(note.fecha_creacion).toDateString() === new Date(selectedDate).toDateString()
        : true;

      return matchesText && matchesDate;
    });
  }

  private mostrarFormulario(note: INote | null): void {
    this.noteToEdit = note;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  async openNewNoteForm(): Promise<void> {
    const familia = this.familiesStore.familiaSeleccionada();
    if (!familia) return;

    try {
      const children = await this.childService.getChildrenByFamily(String(familia.id));
      this.childrenOptions = children.map((child: IChild) => ({
        label: child.nombre,
        value: Number(child.id),
      }));

      this.mostrarFormulario(null);
    } catch (error) {
      console.error('Error al cargar niños:', error);
    }
  }

  async editNote(note: INote): Promise<void> {
    const familia = this.familiesStore.familiaSeleccionada();
    if (!familia) return;

    try {
      const children = await this.childService.getChildrenByFamily(String(familia.id));
      this.childrenOptions = children.map((child: IChild) => ({
        label: child.nombre,
        value: Number(child.id),
      }));

      this.mostrarFormulario(note);
    } catch (error) {
      console.error('Error al cargar niños:', error);
    }
  }

  onEditarNota({ idNino, idNota, data }: { idNino: number; idNota: number; data: any }): void {
    this.notesService.updateNote(idNino, idNota, data).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Nota actualizada',
        detail: 'La nota se actualizó correctamente.',
      });
      this.closeForm();
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al actualizar la nota.',
      });
    });
  }

  onGuardarNota({ idNino, data }: { idNino: number; data: any }): void {
    this.notesService.createNote(idNino, data).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Nota creada',
        detail: 'La nota se ha creado correctamente.',
      });
      this.closeForm();
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al guardar la nota.',
      });
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.noteToEdit = null;
  }

  deleteNote(note: INote): void {
    this.confirmationService.confirm({
      message: `¿Estás segura de que quieres eliminar la nota "${note.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.notesService.deleteNote(note.ninos_id, note.id)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Nota eliminada',
              detail: `La nota "${note.titulo}" ha sido eliminada correctamente`,
            });
          })
          .catch((error) => {
            console.error('Error al eliminar la nota:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la nota',
            });
          });
      }
    });
  }
}
