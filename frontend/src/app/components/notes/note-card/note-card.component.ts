import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INote } from '../../../shared/interfaces/inote.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-note-card',
  imports: [CommonModule, ButtonModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css'],
})
export class NoteCardComponent {
  @Input() note!: INote;

  @Output() edit = new EventEmitter<INote>();
  @Output() delete = new EventEmitter<INote>();

  onEdit(): void {
    this.edit.emit(this.note);
  }

  onDelete(): void {
    this.delete.emit(this.note);
  }
}
