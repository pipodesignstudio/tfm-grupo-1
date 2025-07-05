import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';

import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './message-modal.component.html',
})
export class MessageModalComponent {

  @Input() message: string = '';
  @Input() buttonText: string = '';
  @Input() showButton: boolean = true;

  @Output() button = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();





  submitButton() {
    this.button.emit();
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
