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
import { RoutineService } from '../../../../shared/services/routine.service';
import { IChild, IRoutine } from '../../../../shared/interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true, // Standalone component!
  imports: [
    RouterModule, // Importa RouterModule aquí para routerLink
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent {
  // INYECCIONES
  private familiesStore = inject(FamiliesStore);
  private usersService = inject(UsersService);
  private childService = inject(ChildService);
  private routineService = inject(RoutineService);
  private changeDetector = inject(ChangeDetectorRef);

  // PROPIEDADES
  user = this.usersService.user; // signal reactiva
  userName = '';
  date = new Date();

  children: IChild[] = [];
  activeChild = 0;
  routines: IRoutine[] = [];
  loading = signal(true);

  links = [
    { url: '/dashboard/routine-list', icon: 'pi pi-list', label: 'Rutinas' },
    { url: '/dashboard/objectives', icon: 'pi pi-star', label: 'Objetivos' },
    { url: '/dashboard/calendar', icon: 'pi pi-calendar', label: 'Calendario' },
    { url: '/dashboard', icon: 'pi pi-pencil', label: 'Notas' },
  ];

  underlineIn = false;

  constructor() {
    // Efecto reactivo: cada vez que cambia la familia seleccionada, recarga los niños y rutinas
    effect(async () => {
      const familia = this.familiesStore.familiaSeleccionada();
      if (!familia) return;

      this.loading.set(true);

      // 1. Cargar usuario
      this.userName = this.user()?.nombre || this.user()?.nick || 'usuario';

      // 2. Cargar niños
      this.children = await this.childService.getChildrenByFamily(
        String(familia.id)
      );
      this.activeChild = 0;

      // 3. Cargar rutinas del primer niño
      await this.loadRoutineForActiveChild();

      this.loading.set(false);
      this.changeDetector.detectChanges();
    });
  }

  async loadRoutineForActiveChild() {
    if (this.children.length > 0) {
      const childId = this.children[this.activeChild].id;
      this.routines = await firstValueFrom(
        this.routineService.getAllRoutines(childId)
      );
    } else {
      this.routines = [];
    }
  }

  async nextChild() {
    if (this.children.length > 1) {
      this.activeChild = (this.activeChild + 1) % this.children.length;
      await this.loadRoutineForActiveChild();
      this.changeDetector.detectChanges();
    }
  }

  async previousChild() {
    if (this.children.length > 1) {
      this.activeChild =
        (this.activeChild - 1 + this.children.length) % this.children.length;
      await this.loadRoutineForActiveChild();
      this.changeDetector.detectChanges();
    }
  }

  getTaskColorClass(type: string): string {
    switch (type) {
      case 'meal':
        return 'border-yellow-200';
      case 'school':
        return 'border-blue-200';
      case 'homework':
        return 'border-green-200';
      case 'play':
        return 'border-pink-200';
      default:
        return 'border-gray-200';
    }
  }

  ngOnInit() {
    setTimeout(() => (this.underlineIn = true), 100);
  }
}
