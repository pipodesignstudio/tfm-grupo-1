import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { INote } from '../../../../shared/interfaces/inote.interface';
import { NotesService } from '../../../../shared/services/notes.service';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
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
    FormsModule,
    ButtonModule,
    DropdownModule,
    NoteCardComponent,
    NotesFiltersComponent,
    NoteFormComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class NotesPageComponent implements OnInit {
  childrenOptions: { label: string; value: number }[] = [];
  selectedChildId: number | null = null;

  notes: INote[] = [];
  filteredNotes: INote[] = [];

  showForm = false;
  noteToEdit: INote | null = null;

  currentFilters = {
    search: '',
    date: null as Date | null,
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
    const familia = this.familiesStore.familiaSeleccionada();
    if (!familia) return;

    this.childService.getChildrenByFamily(String(familia.id)).then(children => {
      this.childrenOptions = children.map((child: IChild) => ({
        label: child.nombre,
        value: Number(child.id),
      }));

      if (this.childrenOptions.length > 0) {
        this.selectedChildId = this.childrenOptions[0].value;

        this.cdr.detectChanges();

        this.loadNotes();
      }
    });

    this.notesService.notes$.subscribe(notes => {
      this.notes = notes.filter(Boolean);
      this.applyFilters();
      this.cdr.detectChanges();
    });
  }

  onChildChange(): void {
    this.loadNotes();
  }

  private loadNotes(): void {
    if (this.selectedChildId !== null) {
      this.notesService.getAllNotes(this.selectedChildId);
    }
  }

  onFiltersChange(filters: { search: string; date: Date | null }): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    const { search, date } = this.currentFilters;
    const searchText = search?.toLowerCase() || '';

    this.filteredNotes = this.notes.filter(note => {
      const matchesText =
        note.titulo.toLowerCase().includes(searchText) ||
        note.texto.toLowerCase().includes(searchText);

      const matchesDate = date
        ? new Date(note.fecha_creacion).toDateString() === new Date(date).toDateString()
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
    if (!this.selectedChildId) return;
    this.mostrarFormulario(null);
  }

  async editNote(note: INote): Promise<void> {
    this.mostrarFormulario(note);
  }

  onGuardarNota({ idNino, data }: { idNino: number; data: any }): void {
    this.notesService.createNote(idNino, data).then(() => {
      this.loadNotes();
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

  onEditarNota({ idNino, idNota, data }: { idNino: number; idNota: number; data: any }): void {
    this.notesService.updateNote(idNino, idNota, data).then(() => {
      this.loadNotes();
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
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la nota',
            });
          });
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.noteToEdit = null;
  }
}
