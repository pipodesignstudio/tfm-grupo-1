import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService } from '../../../../../shared/services/routine.service';
import { ActivityService } from '../../../../../shared/services/activity.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IActivity, IRoutine } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-routine-form-page',
  standalone: true,
  templateUrl: './routine-form-page.component.html',
  imports: [FormsModule, HttpClientModule],
})
export class RoutineFormPageComponent implements OnInit {
  rutina: Partial<IRoutine> = {
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
    actividades: [],
  };

  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  actividadesDisponibles: IActivity[] = [];
  actividadesSeleccionadas: number[] = [];
  horasActividades: { [id: number]: string } = {};

  idNino = 0;
  rutinaId: number | null = null;
  editando = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    const paramIdNino = this.route.snapshot.queryParamMap.get('id_nino');
    const paramRutinaId = this.route.snapshot.queryParamMap.get('id');

    if (!paramIdNino) {
      console.error('ID del niño faltante');
      return;
    }
    this.idNino = Number(paramIdNino);
    ;
    this.rutinaId = paramRutinaId ? Number(paramRutinaId) : null;
    this.editando = !!this.rutinaId;

    this.cargarActividades().then(() => {
      if (this.editando) {
        this.routineService.getRoutine(this.idNino, this.rutinaId!).subscribe({
          next: (res) => {
            const rutinaData = res.data as IRoutine;
            this.rutina = {
              ...rutinaData,
              frecuencia: rutinaData.frecuencia ?? {},
              actividades: rutinaData.actividades ?? [],
            };

            this.actividadesSeleccionadas = [];
            this.horasActividades = {};

            rutinaData.actividades?.forEach((act) => {
              this.actividadesSeleccionadas.push(act.id);

              let hora = '08:00';
              try {
                const fecha = new Date(act.hora_inicio);
                if (!isNaN(fecha.getTime())) {
                  hora = fecha.toISOString().slice(11, 16);
                }
              } catch {
                console.warn(`Hora inválida para actividad ID ${act.id}`);
              }

              this.horasActividades[act.id] = hora;
            });
          },
          error: (err) => console.error('Error cargando rutina', err),
        });
      }
    });
  }

  async cargarActividades(): Promise<void> {
    try {
      this.actividadesDisponibles = await this.activityService.getActivitiesNino(String(this.idNino));
    } catch (error) {
      console.error('Error cargando actividades', error);
    }
  }

  agregarActividad(): void {
    const nueva = this.actividadesDisponibles.find(
      act => !this.actividadesSeleccionadas.includes(act.id)
    );
    if (nueva) {
      this.actividadesSeleccionadas.push(nueva.id);
      this.horasActividades[nueva.id] = '08:00';
    }
  }

  eliminarActividad(id: number): void {
    this.actividadesSeleccionadas = this.actividadesSeleccionadas.filter(actId => actId !== id);
    delete this.horasActividades[id];
  }

  guardarRutina(): void {
    const payload = {
      nombre: this.rutina.nombre,
      descripcion: this.rutina.descripcion,
      frecuencia: this.rutina.frecuencia,
      fecha_fin: this.rutina.fecha_fin,
      actividades_ids: this.actividadesSeleccionadas, // Solo IDs, como espera el backend
    };

    const callback = () => {
      this.router.navigate(['/dashboard/routine-list'], {
        queryParams: { id_nino: this.idNino },
      });
    };

    if (this.editando) {
      this.routineService.updateRoutine(this.idNino, this.rutinaId!, payload).subscribe({
        next: callback,
        error: (err) => console.error('Error al actualizar rutina', err),
      });
    } else {
      this.routineService.crearRutina(this.idNino, payload).subscribe({
        next: callback,
        error: (err) => console.error('Error al crear rutina', err),
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/routine-list'], {
      queryParams: { id_nino: this.idNino },
    });
  }

  getActividadById(id: number): IActivity | undefined {
    return this.actividadesDisponibles.find(a => a.id === id);
  }

  // Propiedad computada para evitar errores en el template
  get actividadesSeleccionadasConDatos(): IActivity[] {
    return this.actividadesSeleccionadas
      .map(id => this.getActividadById(id))
      .filter((act): act is IActivity => !!act);
  }
}
