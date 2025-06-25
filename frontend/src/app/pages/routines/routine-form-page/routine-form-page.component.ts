import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IRoutine } from '../../../interfaces/iroutine.interface';
import { RoutineService } from '../../../service/routine.service';
import { ActivityService } from '../../../service/activity.service';

type ActivityForm = {
  titulo: string;
  descripcion?: string;
  fecha_realizacion: string; // 'YYYY-MM-DD'
  hora_inicio: string;       // 'HH:mm'
  hora_fin: string;          // 'HH:mm'
  color?: string;
  tipo: 'Objetivo' | 'Rutina' | 'Evento';
  ubicacion?: string;
  completado?: boolean;
};

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
  actividades: ActivityForm[] = [{
    titulo: '',
    descripcion: '',
    fecha_realizacion: '',
    hora_inicio: '',
    hora_fin: '',
    color: '',
    tipo: 'Rutina',
    ubicacion: '',
    completado: false
  }];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  ninoId = 1; // Ajustar según usuario
  usuarioResponsable = 1;

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

      const actividadesApi = await this.activityService.getActivitiesByRoutine(this.rutinaId);
      this.actividades = Array.isArray(actividadesApi) && actividadesApi.length > 0
        ? actividadesApi.map(a => ({
            titulo: a.titulo ?? '',
            descripcion: a.descripcion ?? '',
            fecha_realizacion: a.fecha_realizacion ? this.formatDate(a.fecha_realizacion) : '',
            hora_inicio: a.hora_inicio ? this.formatTime(a.hora_inicio) : '',
            hora_fin: a.hora_fin ? this.formatTime(a.hora_fin) : '',
            color: a.color ?? '',
            tipo: (a.tipo as 'Objetivo' | 'Rutina' | 'Evento') ?? 'Rutina',
            ubicacion: a.ubicacion && typeof a.ubicacion === 'object' && 'address' in a.ubicacion
              ? (a.ubicacion as any).address
              : '',
            completado: a.completado ?? false
          }))
        : [this.actividades[0]];
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
    this.actividades.push({
      titulo: '',
      descripcion: '',
      fecha_realizacion: '',
      hora_inicio: '',
      hora_fin: '',
      color: '',
      tipo: 'Rutina',
      ubicacion: '',
      completado: false
    });
  }

  eliminarActividad(index: number) {
    if (this.actividades.length > 1) {
      this.actividades.splice(index, 1);
    }
  }

  async guardarRutina() {
    const rutina: IRoutine = {
      id: this.rutinaId || Date.now(),
      ninosId: this.ninoId,
      nombre: this.nombreRutina,
      descripcion: this.descripcionRutina,
      fechaCreacion: new Date().toISOString(),
      frecuencia: this.diasSeleccionados.join(', ')
    };

    let rutinaCreada: IRoutine;

    if (this.rutinaId) {
      await this.routineService.updateRoutine(this.rutinaId, rutina);
      rutinaCreada = rutina;
    } else {
      rutinaCreada = await this.routineService.createRoutine(rutina);
    }

    for (const actividad of this.actividades) {
      if (
        actividad.titulo.trim() &&
        actividad.fecha_realizacion &&
        actividad.hora_inicio &&
        actividad.hora_fin
      ) {
        const actividadDto: any = {
          nino_id: this.ninoId,
          rutina_id: rutinaCreada.id,
          titulo: actividad.titulo,
          fecha_realizacion: this.parseDateTime(actividad.fecha_realizacion, '00:00'),
          hora_inicio: this.parseDateTime(actividad.fecha_realizacion, actividad.hora_inicio),
          hora_fin: this.parseDateTime(actividad.fecha_realizacion, actividad.hora_fin),
          color: actividad.color || undefined,
          ubicacion: actividad.ubicacion
            ? { address: actividad.ubicacion, lat: 0, lon: 0 }
            : undefined,
          usuario_responsable: this.usuarioResponsable,
          completado: actividad.completado ?? false,
          tipo: actividad.tipo
        };

        if (actividad.descripcion) {
          actividadDto.descripcion = actividad.descripcion;
        }

        await this.activityService.createActivity(actividadDto);
      }
    }

    this.router.navigate(['/routines']);
  }

  cancelar() {
    this.router.navigate(['/routines']);
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

  private formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().substring(11, 16);
  }

  private parseDateTime(date: string, time: string): Date {
    return new Date(`${date}T${time}:00`);
  }
}
