// routine-list-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRoutine } from '../../../interfaces/iroutine.interface';
import { RoutineService } from '../../../service/routine.service';
import { ActivityService } from '../../../service/activity.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-routine-list-page',
  imports: [CommonModule],
  templateUrl: './routine-list-page.component.html',
  styleUrls: ['./routine-list-page.component.css']
})
export class RoutineListPageComponent implements OnInit {
  rutinas: IRoutine[] = [];

  constructor(
    private router: Router,
    private routineService: RoutineService,
    private activityService: ActivityService
  ) {}

  async ngOnInit() {
    await this.cargarRutinas();
  }

  async cargarRutinas() {
    this.rutinas = await this.routineService.getAllRoutines();
    // Formatear fecha de creación si es necesario
    this.rutinas.forEach(r => {
      r.fechaCreacion = r.fechaCreacion || new Date().toISOString();
    });
  }

  nuevaRutina() {
    this.router.navigate(['/routines/new']);
  }

  editarRutina(id: number) {
    this.router.navigate(['/routines/new'], { queryParams: { id } });
  }

  async eliminarRutina(id: number) {
    await this.routineService.deleteRoutine(id);
    this.rutinas = this.rutinas.filter(r => r.id !== id);
  }
}
