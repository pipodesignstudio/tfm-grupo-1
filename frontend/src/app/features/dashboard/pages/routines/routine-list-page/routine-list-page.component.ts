import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRoutine, IActivity } from '../../../../../shared/interfaces';
import { RoutineService } from '../../../../../shared/services/routine.service'; 
import { ActivityService } from '../../../../../shared/services';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routine-list-page',
  standalone: true,
  templateUrl: './routine-list-page.component.html',
  styleUrls: ['./routine-list-page.component.css'],
  imports: [CommonModule, DropdownModule, ButtonModule, FormsModule]
})
export class RoutineListPageComponent implements OnInit {
  // ✅ Interfaz extendida localmente para permitir 'actividades'
  rutinas: IRoutineConActividades[] = [];
  allRutinas: IRoutineConActividades[] = [];
  selectedChild: any = null;

  children = [
    { id: 1, nombre: 'Max' },
    { id: 2, nombre: 'Luna' }
  ];

  constructor(
    private router: Router,
    private routineService: RoutineService,
    private activityService: ActivityService
  ) {}

  async ngOnInit() {
    await this.cargarRutinas();
  }

  async cargarRutinas() {
    try {
      if (!this.selectedChild) return;

      const data = await this.routineService.getAllRoutines(this.selectedChild.id);

      this.allRutinas = (data as IRoutine[]).map((rutina: IRoutine) => ({
        ...rutina,
        actividades: [], // 🟠 Por ahora vacías, o rellena si ya las devuelve el backend
        fechaCreacion: rutina.fechaCreacion ?? new Date().toISOString()
      }));

      this.filtrarRutinasPorNino();
    } catch (error) {
      console.error('Error cargando rutinas', error);
    }
  }

  filtrarRutinasPorNino() {
    if (!this.selectedChild) {
      this.rutinas = this.allRutinas;
    } else {
      this.rutinas = this.allRutinas.filter(r => r.ninosId === this.selectedChild.id);
    }
  }

  cargarRutinasPorNino() {
    this.filtrarRutinasPorNino();
  }

  nuevaRutina() {
    this.router.navigate(['/routines/new']);
  }

  editarRutina(id: number) {
    this.router.navigate(['/routines/new'], { queryParams: { id } });
  }

  async eliminarRutina(id: number) {
    try {
      const ninoId = this.selectedChild?.id;
      if (!ninoId) return;
  
      await this.routineService.deleteRoutine(ninoId, id);
      this.allRutinas = this.allRutinas.filter(r => r.id !== id);
      this.filtrarRutinasPorNino();
    } catch (error) {
      console.error('Error al eliminar la rutina', error);
    }
  }
  getHora(fecha: Date): string {
    const d = new Date(fecha);
    const horas = d.getHours().toString().padStart(2, '0');
    const minutos = d.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }
}

// ✅ Extensión local de IRoutine para incluir actividades
interface IRoutineConActividades extends IRoutine {
  actividades: IActivity[];
}
