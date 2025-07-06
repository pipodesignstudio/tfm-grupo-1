import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoutineService } from '../../../../../shared/services/routine.service';
import { IRoutine, IActivity } from '../../../../../shared/interfaces';
import { ActivityService } from '../../../../../shared/services';

@Component({
  selector: 'app-routine-form-page',
  standalone: true,
  templateUrl: './routine-form-page.component.html',
  imports: [FormsModule],
})
export class RoutineFormPageComponent implements OnInit {
  private routineService = inject(RoutineService);
  private cdr = inject(ChangeDetectorRef);

  activityService = inject(ActivityService);

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

  diasSemana = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ];

  actividades: { id: number; nombre: string; hora: string }[] = [];
  actividadIdAuto = 1;

  idNino = 0;
  rutinaId: number | null = null;
  editando = false;
  cargando = false;

  constructor(private router: Router, private route: ActivatedRoute, private changeDetector: ChangeDetectorRef) {}

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
      this.cdr.detectChanges();
      try {
        const rutinas: IRoutine[] = await this.routineService.getAllRoutines(
          this.idNino
        );
        const rutina = rutinas.find(
          (r) => Number(r.id) === Number(this.rutinaId)
        );
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

        this.actividades = (rutina.actividades || []).map(
          (act: IActivity, idx: number) => ({
            id: idx + 1,
            nombre: act.titulo,
            hora: act.hora_inicio
              ? new Date(act.hora_inicio).toISOString().slice(11, 16)
              : '08:00',
          })
        );
        this.actividadIdAuto = this.actividades.length + 1;

        this.cargando = false;
        this.cdr.detectChanges();
      } catch (error) {
        this.cargando = false;
        this.cdr.detectChanges();
        console.error('Error capturado al cargar rutina:', error);
        alert('No se pudo cargar la rutina para editar');
        this.router.navigate(['/dashboard/routine-list'], {
          queryParams: { id_nino: this.idNino },
        });
      }
    }
  }

  agregarActividad(): void {
    console.log(this.rutinaId)
     this.activityService.createActivity({
      id: 0,
      rutina_id: this.rutinaId,
      titulo: 'Tu rutina',
      descripcion: '',
      hora_inicio: `1970-01-01T${this.actividades[0]?.hora ?? '08:00'}:00Z`,
      hora_fin: `1970-01-01T${this.actividades[0]?.hora ?? '08:00'}:00Z`,
      fecha_realizacion: new Date(),
      color: null,
      usuario_responsable: 0,
      ubicacion: null,
      completado: false,
      ninos_id: this.idNino,
      tipo: 'Rutina', // Añade aquí el valor adecuado para 'tipo', por ejemplo: 'general' o el que corresponda
    }).then((actividadCreada) => {
      console.log('Actividad creada:', actividadCreada);
      this.actividades.push({
        id: actividadCreada.id,
        nombre: '',
        hora: '08:00',
      });
      this.changeDetector.detectChanges();
    });

  }

  eliminarActividad(id: number): void {
    this.actividades = this.actividades.filter((act) => act.id !== id);
  }


  faltaNombre = false;
  faltaDescripcion = false;
  async guardarRutina(): Promise<void> {

    if (!this.rutina.nombre || this.rutina.nombre === '') {
      this.faltaNombre = true;
      return;
    }else {
      this.faltaNombre = false;
    }

    if (!this.rutina.descripcion || this.rutina.descripcion === '') {
      this.faltaDescripcion = true;
      return;
    }else {
      this.faltaDescripcion = false;
    }
    



    const payload = {
      ...this.rutina,
      actividades: this.actividades.map((a) => ({
        id: a.id, // Asegúrate de que la actividad tenga un ID
        titulo: a.nombre,
        hora_inicio: `1970-01-01T${a.hora}:00Z`,
      })),
    };

    console.log(payload, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    try {
      if (this.editando && this.rutinaId) {
        await this.routineService.updateRoutine(
          this.idNino,
          this.rutinaId,
          payload
        );

        // Actualizar actividades

        const actividadesActualizar = payload.actividades;

        for (const actividad of actividadesActualizar) {
          this.activityService
            .updateActivity({
              ...actividad,
              ninos_id: this.idNino,
              id: actividad.id, // Asegúrate de que la actividad tenga un ID
            })
            .then((actividadActualizada) => {
              console.log('Actividad actualizada:', actividadActualizada);
            });
        }
      } else {
        await this.routineService.crearRutina(this.idNino, payload);

        // Crear actividades
        const actividadesAñadir = payload.actividades;
        console.log(actividadesAñadir);
        for (const actividad of actividadesAñadir) {
          this.activityService
            .createActivity(actividad)
            .then((actividadCreada) => {
              console.log('Actividad creada:', actividadCreada);
            });
        }
      }

      // 🔁 Forzar recarga del componente
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/dashboard/routine-list'], {
          queryParams: { id_nino: this.idNino },
        });
      });
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
      alert('Hubo un error al guardar la rutina');
    }
  }

  cancelar(): void {
    // 🔁 Forzar recarga del componente
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard/routine-list'], {
        queryParams: { id_nino: this.idNino },
      });
    });
  }
}
