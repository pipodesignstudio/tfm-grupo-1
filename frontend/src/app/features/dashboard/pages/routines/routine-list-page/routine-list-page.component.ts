import { Response } from 'express';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoutine, IActivity, IChild } from '../../../../../shared/interfaces';
import { RoutineService } from '../../../../../shared/services/routine.service';
import { ActivityService, FamiliesStore } from '../../../../../shared/services';
import { ChildService } from '../../../../../shared/services/child.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { IUsersFamilies } from '../../../../../shared/interfaces/iusers-families.interface';

@Component({
  selector: 'app-routine-list-page',
  standalone: true,
  templateUrl: './routine-list-page.component.html',
  styleUrls: ['./routine-list-page.component.css'],
  imports: [CommonModule, DropdownModule, ButtonModule, FormsModule],
})
export class RoutineListPageComponent {
  children: IChild[] = [];
  selectedChildId: number | null = null;
  rutinas: IRoutineConActividades[] = [];

  familiesStore = inject(FamiliesStore);
  userFamilia: IUsersFamilies | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private activityService: ActivityService,
    private childService: ChildService,
    private cdr: ChangeDetectorRef
  ) {}

  private familiaEffect = effect(async () => {
    this.userFamilia = this.familiesStore.familiaSeleccionada();
    if (this.userFamilia == null) return;
    console.log(this.userFamilia);

    try {
      // Cargar los niños de la familia seleccionada
      this.children = await this.childService.getChildrenByFamily(
        String(this.userFamilia.id)
      );

      this.route.queryParams.subscribe(async (params) => {
        const id_nino = Number(params['id_nino']);

        if (id_nino && this.children.some((c) => c.id === id_nino)) {
          this.selectedChildId = id_nino;
        } else if (this.children.length > 0) {
          this.selectedChildId = this.children[0].id;
          this.router.navigate([], {
            queryParams: { id_nino: this.selectedChildId },
            queryParamsHandling: 'merge',
          });
        }

        if (this.selectedChildId) {
          await this.cargarRutinas();
        }

        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  });

  /*   async ngOnInit(): Promise<void> {
    const id_familia = localStorage.getItem('familia_id') || '1';

    try {
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar niños o rutinas:', error);
    }
  } */

  async cargarRutinas(): Promise<void> {
    if (!this.selectedChildId) return;

    try {
      const data: IRoutine[] = await this.routineService.getAllRoutines(
        this.selectedChildId
      );
      this.rutinas = data.map((rutina) => ({
        ...rutina,
        actividades: (rutina.actividades || []).map((act: IActivity) => ({
          titulo: act.titulo || act.descripcion || 'Actividad sin título',
          hora_inicio: act.hora_inicio
            ? new Date(act.hora_inicio).toISOString().slice(11, 16)
            : '08:00',
        })),
        fecha_creacion: rutina.fecha_creacion ?? new Date().toISOString(),
      }));

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando rutinas', error);
    }
  }

  async onChildChange(event: any): Promise<void> {
    this.selectedChildId = event.value;
    this.router.navigate([], {
      queryParams: { id_nino: this.selectedChildId },
      queryParamsHandling: 'merge',
    });
  }

  nuevaRutina(): void {
    if (!this.selectedChildId) return;

    //Crear una nueva rutina
    this.routineService
      .crearRutina(this.selectedChildId, {
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
      })
      .then((response) => {
        console.log('Nueva rutina creada', response);
        this.router.navigate(['/dashboard/routine-form'], {
          queryParams: { id: response.id, id_nino: this.selectedChildId },
        });
      });
  }

  editarRutina(id: number): void {
    if (!this.selectedChildId) return;
    this.router.navigate(['/dashboard/routine-form'], {
      queryParams: { id: id, id_nino: this.selectedChildId },
    });
  }

  async eliminarRutina(id: number): Promise<void> {
    try {
      if (!this.selectedChildId) return;
      await this.routineService.deleteRoutine(this.selectedChildId, id);
      this.rutinas = this.rutinas.filter((r) => r.id !== id);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al eliminar la rutina', error);
    }
  }

  formatearFrecuencia(frec: any): string {
    if (!frec || typeof frec !== 'object') return '';
    return Object.entries(frec)
      .filter(([_, v]) => v)
      .map(([dia]) => dia.charAt(0).toUpperCase() + dia.slice(1))
      .join(', ');
  }

  getSelectedChild(): IChild | undefined {
    return this.children.find((c) => c.id === this.selectedChildId);
  }

  // ⛔ Este método ya no se usa si usamos el string directo
  // getHora(hora: string): string {
  //   return hora?.length >= 5 ? hora.slice(0, 5) : '00:00';
  // }
}

// ✅ Interfaces auxiliares
interface IActividadVista {
  titulo: string;
  hora_inicio: string;
}

interface IRoutineConActividades extends Omit<IRoutine, 'actividades'> {
  actividades: IActividadVista[];
}
