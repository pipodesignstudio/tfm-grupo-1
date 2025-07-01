import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { INote } from '../../../shared/interfaces/inote.interface';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css'],
})
export class NoteFormComponent implements OnChanges {
  @Input() notaInfo: INote | null = null;
  @Input() children: { label: string; value: number }[] = [];

  @Output() guardar = new EventEmitter<{ idNino: number, data: any }>();
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<{ idNino: number, idNota: number, data: any }>();

  form!: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('notaInfo' in changes || 'children' in changes) {
      this.editMode = !!this.notaInfo;

      this.form = this.fb.group({
        titulo: [this.notaInfo?.titulo ?? '', Validators.required],
        texto: [this.notaInfo?.texto ?? '', Validators.required],
        ninos_id: this.fb.control(
          {
            value: this.notaInfo?.ninos_id ?? null,
            disabled: this.editMode
          },
          Validators.required
        )
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = {
      titulo: this.form.value.titulo,
      texto: this.form.value.texto
    };

    if (this.editMode && this.notaInfo) {
      this.editar.emit({
        idNino: this.notaInfo.ninos_id,
        idNota: this.notaInfo.id,
        data
      });
    } else {
      this.guardar.emit({
        idNino: this.form.value.ninos_id,
        data: {
          ...data,
          ninos_id: this.form.value.ninos_id
        }
      });
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
