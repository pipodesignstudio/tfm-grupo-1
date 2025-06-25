import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRoutine } from '../../../interfaces/iroutine.interface';
import { RoutineService } from '../../../service/routine.service';
import { ActivityService } from '../../../service/activity.service';
import { IActivity } from '../../../interfaces/iactivity.interface';
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
  rutinas: IRoutine[] = [];
  allRutinas: IRoutine[] = []; // sin filtro, para reutilizar
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
      const data = await this.routineService.getAllRoutines();

      // Asegura actividades y transforma fechas
      this.allRutinas = data.map(rutina => ({
        ...rutina,
        actividades: rutina.actividades || [],
        fechaCreacion: rutina.fechaCreacion || new Date().toISOString()
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
      await this.routineService.deleteRoutine(id);
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
