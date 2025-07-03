import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoutine, IActivity, IChild } from '../../../../../shared/interfaces';
import { RoutineService } from '../../../../../shared/services/routine.service'; 
import { ActivityService } from '../../../../../shared/services';
import { ChildService } from '../../../../../shared/services/child.service';
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
  children: IChild[] = [];
  selectedChildId: number | null = null;
  rutinas: IRoutineConActividades[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private activityService: ActivityService,
    private childService: ChildService
  ) {}

  async ngOnInit(): Promise<void> {
    const id_familia = localStorage.getItem('familia_id') || '1';

    try {
      this.children = await this.childService.getChildrenByFamily(id_familia);

      const id_nino = Number(this.route.snapshot.queryParamMap.get('id_nino'));
      if (id_nino && this.children.some(c => c.id === id_nino)) {
        this.selectedChildId = id_nino;
      } else if (this.children.length > 0) {
        this.selectedChildId = this.children[0].id;
      }

      await this.cargarRutinas();
    } catch (error) {
      console.error('Error al cargar niños o rutinas:', error);
    }
  }

  async cargarRutinas(): Promise<void> {
    if (!this.selectedChildId) return;

    try {
      const data: IRoutine[] = await this.routineService.getAllRoutines(this.selectedChildId);
      this.rutinas = data.map((rutina) => ({
        ...rutina,
        actividades: rutina.actividades || [],
        fecha_creacion: rutina.fecha_creacion ?? new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error cargando rutinas', error);
    }
  }

  async onChildChange(event: any): Promise<void> {
    this.selectedChildId = event.value;
    this.router.navigate([], {
      queryParams: { id_nino: this.selectedChildId },
      queryParamsHandling: 'merge'
    });
    await this.cargarRutinas();
  }

  nuevaRutina(): void {
    if (!this.selectedChildId) return;

    this.router.navigate(['/dashboard/routine-form'], {
      queryParams: { id_nino: this.selectedChildId }
    });
  }

  editarRutina(id: number): void {
    if (!this.selectedChildId) return;

    this.router.navigate(['/dashboard/routine-form'], {
      queryParams: { id: id, id_nino: this.selectedChildId }
    });
  }

  async eliminarRutina(id: number): Promise<void> {
    try {
      if (!this.selectedChildId) return;
      await this.routineService.deleteRoutine(this.selectedChildId, id);
      this.rutinas = this.rutinas.filter(r => r.id !== id);
    } catch (error) {
      console.error('Error al eliminar la rutina', error);
    }
  }

  getHora(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatearFrecuencia(frec: any): string {
    if (!frec || typeof frec !== 'object') return '';
    return Object.entries(frec)
      .filter(([_, v]) => v)
      .map(([dia]) => dia.charAt(0).toUpperCase() + dia.slice(1))
      .join(', ');
  }

  getSelectedChild(): IChild | undefined {
    return this.children.find(c => c.id === this.selectedChildId);
  }
}

interface IRoutineConActividades extends IRoutine {
  actividades: IActivity[];
}
