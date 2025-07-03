import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  rutinas: IRoutineConActividades[] = [];
  allRutinas: IRoutineConActividades[] = [];
  selectedChild: { id: number; nombre: string } = { id: 1, nombre: 'Max' };

  children = [
    { id: 1, nombre: 'Max' },
    { id: 2, nombre: 'Luna' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private activityService: ActivityService
  ) {}

  async ngOnInit(): Promise<void> {
    const id_nino = Number(this.route.snapshot.queryParamMap.get('id_nino'));
    if (id_nino) {
      const found = this.children.find(c => c.id === id_nino);
      if (found) this.selectedChild = found;
    }

    await this.cargarRutinas();
  }

  async cargarRutinas(): Promise<void> {
    if (!this.selectedChild) return;

    try {
      const response = await this.routineService.getAllRoutines(this.selectedChild.id);
      const data: IRoutine[] = Array.isArray(response) ? response : [];


      this.allRutinas = data.map((rutina: IRoutine) => ({
        ...rutina,
        actividades: rutina.actividades || [],
        fecha_creacion: rutina.fecha_creacion ?? new Date().toISOString()
      }));

      this.filtrarRutinasPorNino();
    } catch (error) {
      console.error('Error cargando rutinas', error);
    }
  }

  filtrarRutinasPorNino(): void {
    this.rutinas = this.allRutinas.filter(r => r?.ninosId === this.selectedChild.id);

    while (this.rutinas.length < 2) {
      this.rutinas.push({
        id: 0,
        nombre: '',
        descripcion: '',
        frecuencia: {},
        fecha_creacion: new Date().toISOString(),
        fecha_fin: '',
        ninosId: this.selectedChild.id,
        actividades: Array(3).fill(null).map(() => ({
          id: 0,
          id_rutina: null,
          ninos_id: this.selectedChild.id,
          titulo: '',
          descripcion: '',
          fecha_realizacion: new Date(),
          hora_inicio: new Date(),
          hora_fin: new Date(),
          color: '',
          tipo: 'Tarea',
          ubicacion: null,
          usuario_responsable: 0,
          completado: false
        }))
      });
    }
  }

  cargarRutinasPorNino(): void {
    this.filtrarRutinasPorNino();
  }

  nuevaRutina(): void {
    this.router.navigate(['/dashboard/routine-form'], {
      queryParams: { id_nino: this.selectedChild.id }
    });
  }

  editarRutina(id: number): void {
    this.router.navigate(['/dashboard/routine-form'], {
      queryParams: { id }
    });
  }

  async eliminarRutina(id: number): Promise<void> {
    try {
      const ninoId = this.selectedChild.id;
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

  formatearFrecuencia(frec: any): string {
    if (!frec || typeof frec !== 'object') return '';
    return Object.entries(frec)
      .filter(([_, v]) => v)
      .map(([dia]) => dia.charAt(0).toUpperCase() + dia.slice(1))
      .join(', ');
  }
}

interface IRoutineConActividades extends IRoutine {
  actividades: IActivity[];
}
