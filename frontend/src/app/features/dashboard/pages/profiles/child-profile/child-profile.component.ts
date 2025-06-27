import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

interface Vacuna {
  id: number;
  nombre: string;
  fecha: string;
}

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
  ],
  templateUrl: './child-profile.component.html',
  styleUrls: ['./child-profile.component.css'],
})
export class ChildProfileComponent implements OnInit {
  today: Date = new Date();

  // Estados de edición por card
  editProfile = false;
  editDescription = false;
  editHealth = false;
  generos = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
  ];

  // 🔍 Referencia a todos los calendarios (usado para toggle desde icono)
  @ViewChildren('calendarRefs') calendarRefs!: QueryList<any>;

  // Datos del niño
  child = {
    id: 1,
    perfilesAprendizajeId: 100,
    nombre: 'Max',
    apellido: 'Gómez',
    fechaNacimiento: '2022-10-17',
    descripcion: 'Le encanta jugar al aire libre y explorar cosas nuevas.',
    genero: 'Masculino',
    peso: 12.5,
    altura: 90,
    imgPerfil: 'https://picsum.photos/150',
  };

  // Datos de salud
  salud = {
    alergias: 'Ninguna',
    enfermedades: 'Asma',
    pediatra: 'Dra. López',
  };

  // Vacunas
  vacunas: Vacuna[] = [
    { id: 1, nombre: 'Triple Viral', fecha: '2023-01-15' },
    { id: 2, nombre: 'Polio', fecha: '2023-06-10' },
  ];

  edadCalculada = '';

  ngOnInit(): void {
    this.edadCalculada = this.calcularEdad(this.child.fechaNacimiento);
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

  saveProfile(): void {
    this.edadCalculada = this.calcularEdad(this.child.fechaNacimiento);
    this.editProfile = false;
  }

  saveDescription(): void {
    this.editDescription = false;
  }

  saveHealth(): void {
    this.editHealth = false;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.child.imgPerfil = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  agregarVacuna(): void {
    const newId =
      this.vacunas.length > 0
        ? Math.max(...this.vacunas.map((v) => v.id)) + 1
        : 1;
    this.vacunas.push({ id: newId, nombre: '', fecha: '' });
  }

  eliminarVacuna(index: number): void {
    this.vacunas.splice(index, 1);
  }
}
