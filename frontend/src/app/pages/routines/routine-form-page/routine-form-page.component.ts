// routine-form-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IRoutine } from '../../../interfaces/iroutine.interface';
import { RoutineService } from '../../../service/routine.service';
import { ActivityService } from '../../../service/activity.service';

@Component({
  selector: 'app-routine-form-page',
  standalone: true,
  templateUrl: './routine-form-page.component.html',
  imports: [CommonModule, FormsModule]
})
export class RoutineFormPageComponent implements OnInit {
  rutinaId?: number;
  nombreRutina = '';
  descripcionRutina = '';
  diasSeleccionados: string[] = [];
  actividades: any[] = [{ titulo: '', hora_inicio: '' }];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private activityService: ActivityService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.rutinaId = +id;
      const rutina = await this.routineService.getRoutineById(this.rutinaId);
      this.nombreRutina = rutina.nombre;
      this.descripcionRutina = rutina.descripcion ?? '';
      this.diasSeleccionados = rutina.frecuencia?.split(', ') || [];

      // Cargar actividades
      const actividadesApi = await this.activityService.getActivitiesByRoutine(this.rutinaId);
      this.actividades = actividadesApi.map(a => ({
        titulo: a.titulo ?? '',
        hora_inicio: a.hora_inicio ? this.formatTime(a.hora_inicio) : ''
      }));

      if (this.actividades.length === 0) {
        this.actividades = [{ titulo: '', hora_inicio: '' }];
      }
    }
  }

  toggleDia(dia: string) {
    const index = this.diasSeleccionados.indexOf(dia);
    if (index >= 0) {
      this.diasSeleccionados.splice(index, 1);
    } else {
      this.diasSeleccionados.push(dia);
    }
  }

  agregarActividad() {
    this.actividades.push({ titulo: '', hora_inicio: '' });
  }

  eliminarActividad(index: number) {
    if (this.actividades.length > 1) {
      this.actividades.splice(index, 1);
    }
  }

  async guardarRutina() {
    const rutina: IRoutine = {
      id: this.rutinaId || Date.now(),
      nombre: this.nombreRutina,
      descripcion: this.descripcionRutina,
      fechaCreacion: new Date().toISOString(),
      frecuencia: this.diasSeleccionados.join(', ')
    };

    if (this.rutinaId) {
      await this.routineService.updateRoutine(this.rutinaId, rutina);
    } else {
      await this.routineService.createRoutine(rutina);
    }

    // Guardar actividades
    for (const actividad of this.actividades) {
      if (actividad.titulo.trim()) {
        await this.activityService.createActivity({
          parseTime(time: string): string {
            // Si solo necesitas el string "HH:mm"
            return time;
          }
        });
      }
    }

    this.router.navigate(['/routines']);
  }

  cancelar() {
    this.router.navigate(['/routines']);
  }

  private formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().substring(11, 16);
  }

  private parseTime(time: string): Date {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
  }
}
