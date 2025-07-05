import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoutineService } from '../../../../../shared/services/routine.service';
import { IRoutine, IActivity } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-routine-form-page',
  standalone: true,
  templateUrl: './routine-form-page.component.html',
  imports: [FormsModule],
})
export class RoutineFormPageComponent implements OnInit {
  private routineService = inject(RoutineService);
  private cdr = inject(ChangeDetectorRef);

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
  cargando = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
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

    if (this.editando && this.rutinaId) {
      this.cargando = true;
      this.cdr.detectChanges(); // <-- fuerza actualización
      try {
        const rutinas: IRoutine[] = await this.routineService.getAllRoutines(this.idNino);
        console.log('Rutinas obtenidas:', rutinas);
        console.log('Tipo de rutinaId:', typeof this.rutinaId, this.rutinaId);
        console.log('IDs de rutinas:', rutinas.map(r => r.id));
        const rutina = rutinas.find(r => Number(r.id) === Number(this.rutinaId));
        console.log('Rutina encontrada:', rutina);

        if (!rutina) throw new Error('Rutina no encontrada');

        this.rutina.nombre = rutina.nombre;
        this.rutina.descripcion = rutina.descripcion;
        this.rutina.frecuencia = {
          lunes: !!rutina.frecuencia?.lunes,
          martes: !!rutina.frecuencia?.martes,
          miercoles: !!rutina.frecuencia?.miercoles,
          jueves: !!rutina.frecuencia?.jueves,
          viernes: !!rutina.frecuencia?.viernes,
          sabado: !!rutina.frecuencia?.sabado,
          domingo: !!rutina.frecuencia?.domingo,
        };

        this.actividades = (rutina.actividades || []).map((act: IActivity, idx: number) => ({
          id: idx + 1,
          nombre: act.titulo,
          hora: act.hora_inicio
            ? new Date(act.hora_inicio).toISOString().slice(11, 16)
            : '08:00',
        }));
        this.actividadIdAuto = this.actividades.length + 1;
        this.cargando = false;
        this.cdr.detectChanges(); // <-- fuerza actualización
      } catch (error) {
        this.cargando = false;
        this.cdr.detectChanges(); // <-- fuerza actualización
        console.error('Error capturado al cargar rutina:', error);
        alert('No se pudo cargar la rutina para editar');
        this.router.navigate(['/dashboard/routine-list'], {
          queryParams: { id_nino: this.idNino },
        });
      }
    }
  }

  agregarActividad(): void {
    this.actividades.push({
      id: this.actividadIdAuto++,
      nombre: '',
      hora: '08:00',
    });
  }

  eliminarActividad(id: number): void {
    this.actividades = this.actividades.filter((act) => act.id !== id);
  }

  async guardarRutina(): Promise<void> {
    const payload = {
      ...this.rutina,
      actividades: this.actividades.map((a) => ({
        titulo: a.nombre,
        hora_inicio: a.hora,
      })),
    };

    try {
      if (this.editando && this.rutinaId) {
        await this.routineService.updateRoutine(this.idNino, this.rutinaId, payload);
      } else {
        await this.routineService.crearRutina(this.idNino, payload);
      }
      this.router.navigate(['/dashboard/routine-list'], {
        queryParams: { id_nino: this.idNino },
      });
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
      alert('Hubo un error al guardar la rutina');
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/routine-list'], {
      queryParams: { id_nino: this.idNino },
    });
  }
}
