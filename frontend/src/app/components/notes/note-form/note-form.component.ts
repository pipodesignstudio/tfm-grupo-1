import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { INote } from '../../../shared/interfaces/inote.interface';

@Component({
  selector: 'app-note-form',
  standalone: true,
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
  ]
})
export class NoteFormComponent implements OnChanges {
  @Input() notaInfo: INote | null = null;
  @Input() children: { label: string; value: number }[] = [];

  @Output() guardar = new EventEmitter<{ idNino: number; data: any }>();
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<{ idNino: number; idNota: number; data: any }>();

  form!: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.editMode = !!this.notaInfo;

    this.form = this.fb.group({
      titulo: [this.notaInfo?.titulo ?? '', Validators.required],
      texto: [this.notaInfo?.texto ?? '', Validators.required],
      ninos_id: [
        {
          value: this.notaInfo?.ninos_id ?? this.children[0]?.value ?? null,
          disabled: this.editMode,
        },
        Validators.required,
      ],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = {
      titulo: this.form.get('titulo')?.value,
      texto: this.form.get('texto')?.value,
    };

    if (this.editMode && this.notaInfo) {
      this.editar.emit({
        idNino: this.notaInfo.ninos_id,
        idNota: this.notaInfo.id,
        data,
      });
    } else {
      const idNino = this.form.get('ninos_id')?.value;
      this.guardar.emit({ idNino, data: { ...data, ninos_id: idNino } });
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
