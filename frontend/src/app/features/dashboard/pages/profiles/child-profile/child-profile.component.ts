import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from '../../../../../shared/services/child.service';
import { IChild } from '../../../../../shared/interfaces';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-child-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './child-profile.component.html',
  styleUrls: ['./child-profile.component.css'],
})
export class ChildProfileComponent implements OnInit {
  today: Date = new Date();

  editProfile = false;
  editDescription = false;
  editHealth = false;
  generos = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
  ];

  child: IChild | null = null;
  edadCalculada = '';
  loading = true;
  error = '';
  saving = false;

  constructor(
    private childService: ChildService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      const idParam = this.route.snapshot.paramMap.get('id');
      const id = Number(idParam);

      if (!idParam || isNaN(id) || id <= 0) {
        this.error = 'ID de niño inválido.';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.child = await this.childService.getChildById(id);
      this.edadCalculada = this.calcularEdad(this.child.fecha_nacimiento);

      this.loading = false;
      this.cdr.detectChanges();
    } catch (e) {
      this.error = 'No se pudo cargar el perfil del niño.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  calcularEdad(fecha: string): string {
    if (!fecha) return '';
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  }

  async saveProfile(): Promise<void> {
    if (!this.child) return;
    this.saving = true;
    try {
      const updated = await this.childService.updateChild(this.child.id, {
        ...this.child,
        fecha_nacimiento: this.child.fecha_nacimiento,
        peso: this.child.peso,
        altura: this.child.altura,
        genero: this.child.genero,
        img_perfil: this.child.img_perfil,
      });

      if (updated && updated.fecha_nacimiento) {
        this.child = updated;
        this.edadCalculada = this.calcularEdad(this.child.fecha_nacimiento);
        this.editProfile = false;
        this.error = '';
      } else {
        // Recarga el niño desde la API si la respuesta no es válida. Solucionar en el backend.
        this.child = await this.childService.getChildById(this.child.id);
        if (this.child && this.child.fecha_nacimiento) {
          this.edadCalculada = this.calcularEdad(this.child.fecha_nacimiento);
          this.editProfile = false;
          this.error = '';
        } else {
          this.error = 'No se pudo obtener el perfil actualizado.';
        }
      }
    } catch (e) {
      this.error = 'No se pudo guardar el perfil.';
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  async saveDescription(): Promise<void> {
    if (!this.child) return;
    try {
      this.child = await this.childService.updateChild(this.child.id, {
        descripcion: this.child.descripcion,
      });
      this.editDescription = false;
    } catch (e) {
      this.error = 'No se pudo guardar la descripción.';
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.child) {
          this.child.img_perfil = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
