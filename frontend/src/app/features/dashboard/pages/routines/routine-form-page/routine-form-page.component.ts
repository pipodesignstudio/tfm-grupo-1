import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormSubmittedEvent } from '@angular/forms';


interface IActividad {
  titulo: string;
  hora_inicio: string;
}

interface IRutina {
  nombre: string;
  descripcion: string;
  frecuencia: {
    lunes: boolean;
    martes: boolean;
    miercoles: boolean;
    jueves: boolean;
    viernes: boolean;
    sabado: boolean;
    domingo: boolean;
  };
  actividades: IActividad[];
}

@Component({
  selector: 'app-routine-form-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './routine-form-page.component.html',
})
export class RoutineFormPageComponent {
  editMode = false;

  rutina: IRutina = {
    nombre: '',
    descripcion: '',
    frecuencia: {
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false,
      domingo: false,
    },
    actividades: [
      { titulo: 'Desayunar', hora_inicio: '07:30' },
      { titulo: 'Vestirse', hora_inicio: '07:50' }
    ]
  };

  constructor(private router: Router) {}

  guardarRutina(): void {
    if (this.editMode) {
      console.log('Actualizando rutina:', this.rutina);
      // Aquí puedes llamar a un servicio para actualizar
    } else {
      console.log('Creando nueva rutina:', this.rutina);
      // Aquí puedes llamar a un servicio para guardar
    }

    this.router.navigate(['/dashboard/routine-list']);
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/routine-list']);
  }

  agregarActividad(): void {
    this.rutina.actividades.push({ titulo: '', hora_inicio: '' });
  }

  eliminarActividad(index: number): void {
    this.rutina.actividades.splice(index, 1);
  }
}
