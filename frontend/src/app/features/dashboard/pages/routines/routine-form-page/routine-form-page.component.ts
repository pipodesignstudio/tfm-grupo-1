import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routine-form-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './routine-form-page.component.html'
})
export class RoutineFormPageComponent implements OnInit {
  rutina = {
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
      { titulo: '', hora_inicio: '' },
      { titulo: '', hora_inicio: '' },
      { titulo: '', hora_inicio: '' }
    ]
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  guardarRutina(): void {
    console.log('Rutina guardada:', this.rutina);
    // Aquí enviarías la rutina al backend
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/routine-list']);
  }

  agregarActividad(): void {
    const maxActividades = 3;
    const disponibles = this.rutina.actividades.filter(a => !a.titulo && !a.hora_inicio);
    if (this.rutina.actividades.length < maxActividades || disponibles.length > 0) {
      const index = this.rutina.actividades.findIndex(a => !a.titulo && !a.hora_inicio);
      if (index !== -1) {
        this.rutina.actividades[index] = { titulo: '', hora_inicio: '' };
      } else {
        this.rutina.actividades.push({ titulo: '', hora_inicio: '' });
      }
    }
  }

  eliminarActividad(index: number): void {
    if (index >= 0 && index < this.rutina.actividades.length) {
      this.rutina.actividades[index] = { titulo: '', hora_inicio: '' };
    }
  }
}
