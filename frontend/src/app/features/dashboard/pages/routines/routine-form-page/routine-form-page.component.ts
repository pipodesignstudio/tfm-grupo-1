import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-routine-form-page',
  standalone: true,
  templateUrl: './routine-form-page.component.html',
  imports: [FormsModule, HttpClientModule],
})
export class RoutineFormPageComponent implements OnInit {
  rutina: any = {
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
  };

  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  actividades: { id: number; nombre: string; hora: string }[] = [];
  actividadIdAuto = 1;

  idNino = 0;
  rutinaId: number | null = null;
  editando = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const paramIdNino = this.route.snapshot.queryParamMap.get('id_nino');
    const paramRutinaId = this.route.snapshot.queryParamMap.get('id');

    if (!paramIdNino) {
      alert('Falta el parámetro id_nino en la URL. Ejemplo: ?id_nino=123');
      this.router.navigate(['/dashboard/routine-list']);
      return;
    }
    this.idNino = Number(paramIdNino);
    this.rutinaId = paramRutinaId ? Number(paramRutinaId) : null;
    this.editando = !!this.rutinaId;

    // Si necesitas cargar datos de rutina existente, aquí iría la lógica.
  }

  agregarActividad(): void {
    this.actividades.push({
      id: this.actividadIdAuto++,
      nombre: '',
      hora: '08:00'
    });
  }

  eliminarActividad(id: number): void {
    this.actividades = this.actividades.filter(act => act.id !== id);
  }

  guardarRutina(): void {
    // Aquí puedes transformar 'actividades' y 'rutina' para enviarlos a tu API según tu modelo.
    const payload = {
      ...this.rutina,
      actividades: this.actividades.map(a => ({
        nombre: a.nombre,
        hora: a.hora
      }))
    };
    console.log('Rutina a guardar:', payload);
    // Lógica para guardar la rutina (API)
    this.router.navigate(['/dashboard/routine-list'], {
      queryParams: { id_nino: this.idNino },
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/routine-list'], {
      queryParams: { id_nino: this.idNino },
    });
  }
}
