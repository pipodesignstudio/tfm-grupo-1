import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../../../shared/services/users.service';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';
import { ChildService } from '../../../../shared/services/child.service';
import { ActivityService } from '../../../../shared/services/activity.service';
import { IChild } from '../../../../shared/interfaces';
import { IActivity } from '../../../../shared/interfaces/iactivity.interface';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent {
  // INYECCIONES
  private familiesStore = inject(FamiliesStore);
  private usersService = inject(UsersService);
  private childService = inject(ChildService);
  private activityService = inject(ActivityService);
  private changeDetector = inject(ChangeDetectorRef);

  // PROPIEDADES
  user = this.usersService.user; // signal reactiva
  userName = '';
  date = new Date();

  children: IChild[] = [];
  activeChild = 0;
  activities: IActivity[] = [];
  loading = signal(true);

  links = [
    { url: '/dashboard/routine-list', icon: 'pi pi-list', label: 'Rutinas' },
    { url: '/dashboard/objectives', icon: 'pi pi-star', label: 'Objetivos' },
    { url: '/dashboard/calendar', icon: 'pi pi-calendar', label: 'Calendario' },
    { url: '/dashboard', icon: 'pi pi-pencil', label: 'Notas' },
  ];

  underlineIn = false;

  constructor() {
    effect(async () => {
      try {
        const familia = this.familiesStore.familiaSeleccionada();
        if (!familia) return;

        this.loading.set(true);

        this.userName = this.user()?.nombre || this.user()?.nick || 'usuario';

        this.children = await this.childService.getChildrenByFamily(
          String(familia.id)
        );

        this.activeChild = 0;
        await this.loadActivitiesForActiveChild();

        this.loading.set(false);
        this.changeDetector.detectChanges();
      } catch (e) {
        console.error('Error en efecto dashboard:', e);
        this.loading.set(false);
      }
    });
  }

  // NO BORRAR DE MOMENTO
  // Carga las actividades del niño activo filtrando por tipo "Evento" y ordenando por hora_inicio
  //
  // async loadActivitiesForActiveChild() {
  //   if (this.children.length > 0) {
  //     const childId = this.children[this.activeChild].id;
  //     const allActivities = await this.activityService.getActivitiesNino(
  //       childId.toString()
  //     );
  //     // Filtra solo las de tipo "Evento"
  //     this.activities = allActivities.filter(
  //       (a) => a.tipo && a.tipo.toLowerCase() === 'evento'
  //     );
  //   } else {
  //     this.activities = [];
  //   }
  // }

  //  Filtra las actividades del día actual y ordena por hora_inicio

  async loadActivitiesForActiveChild() {
    if (this.children.length > 0) {
      const childId = this.children[this.activeChild].id;
      const allActivities = await this.activityService.getActivitiesNino(
        childId.toString()
      );
      const today = new Date();
      // Filtra solo "Evento" del día actual y ordena por hora_inicio
      this.activities = allActivities
        .filter(
          (a) =>
            a.tipo &&
            a.tipo.toLowerCase() === 'evento' &&
            a.fecha_realizacion &&
            new Date(a.fecha_realizacion).toDateString() ===
              today.toDateString()
        )
        .sort(
          (a, b) =>
            new Date(a.hora_inicio).getTime() -
            new Date(b.hora_inicio).getTime()
        );
    } else {
      this.activities = [];
    }
  }

  async nextChild() {
    if (this.children.length > 1) {
      this.activeChild = (this.activeChild + 1) % this.children.length;
      await this.loadActivitiesForActiveChild();
      this.changeDetector.detectChanges();
    }
  }

  async previousChild() {
    if (this.children.length > 1) {
      this.activeChild =
        (this.activeChild - 1 + this.children.length) % this.children.length;
      await this.loadActivitiesForActiveChild();
      this.changeDetector.detectChanges();
    }
  }

  getTaskColorClass(tipo: string): string {
    // Puedes personalizar colores según el tipo de evento
    switch ((tipo || '').toLowerCase()) {
      case 'evento':
        return 'border-blue-400';
      case 'rutina':
        return 'border-yellow-200';
      default:
        return 'border-gray-200';
    }
  }

  ngOnInit() {
    setTimeout(() => (this.underlineIn = true), 100);
  }
}
