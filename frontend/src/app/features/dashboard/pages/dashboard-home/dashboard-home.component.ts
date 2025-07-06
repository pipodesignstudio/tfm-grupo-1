import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../../../shared/services/users.service';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';
import { ChildService } from '../../../../shared/services/child.service';
import { ActivityService } from '../../../../shared/services/activity.service';
import { IChild } from '../../../../shared/interfaces';
import { IActivity } from '../../../../shared/interfaces/iactivity.interface';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterModule, DatePipe, ButtonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  // INYECCIONES
  private familiesStore = inject(FamiliesStore);
  private usersService = inject(UsersService);
  private childService = inject(ChildService);
  private sanitizer = inject(DomSanitizer);

  private activityService = inject(ActivityService);

  // PROPIEDADES
  user = this.usersService.user;
  userName = '';
  date = new Date();

  children: IChild[] = [];
  activeChild = 0;
  activities: IActivity[] = [];
  loading = signal(true);
  underlineIn = signal(false);

  private activitiesCache: { [childId: string]: IActivity[] } = {};

  links = [
    { url: '/dashboard/routine-list', icon: 'pi pi-list', label: 'Rutinas' },
    { url: '/dashboard/objectives', icon: 'pi pi-star', label: 'Objetivos' },
    { url: '/dashboard/calendar', icon: 'pi pi-calendar', label: 'Calendario' },
    { url: '/dashboard/notes', icon: 'pi pi-pencil', label: 'Notas' },
  ];

  ngOnInit() {
    this.underlineIn.set(false);

    this.familiesStore.loadFamilias().then(() => {
      this.initDashboard().then(() => {
        setTimeout(() => {
          this.underlineIn.set(true);
        }, 100);
      });
    });
  }

  async initDashboard() {
    try {
      const familia = this.familiesStore.familiaSeleccionada();
      if (!familia) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);

      this.userName = this.user()?.nombre || this.user()?.nick || 'usuario';

      this.children = await this.childService.getChildrenByFamily(
        String(familia.id)
      );
      this.activeChild = 0;
      await this.loadActivitiesForActiveChild();

      this.loading.set(false);
    } catch (e) {
      console.error('Error en dashboard:', e);
      this.loading.set(false);
    }
  }

  async loadActivitiesForActiveChild() {
    if (this.children.length > 0) {
      const childId = this.children[this.activeChild].id.toString();

      let allActivities = this.activitiesCache[childId];
      if (!allActivities) {
        allActivities = await this.activityService.getActivitiesNino(childId);
        this.activitiesCache[childId] = allActivities;
      }

      if (!allActivities) {
        allActivities = [];
        this.activitiesCache[childId] = allActivities;
      }

      this.activities = allActivities
        .filter(
          (a) =>
            a.tipo &&
            a.tipo.toLowerCase() === 'evento' &&
            a.fecha_realizacion
        )
        .sort(
          (a, b) =>
            new Date(a.hora_inicio).getTime() -
            new Date(b.hora_inicio).getTime()
        );
        console.log(this.activities);
    } else {
      this.activities = [];
    }
  }

  async nextChild() {
    if (this.children.length > 1) {
      this.activeChild = (this.activeChild + 1) % this.children.length;
      await this.loadActivitiesForActiveChild();
    }
  }

  async previousChild() {
    if (this.children.length > 1) {
      this.activeChild =
        (this.activeChild - 1 + this.children.length) % this.children.length;
      await this.loadActivitiesForActiveChild();
    }
  }

  getTaskColorClass(tipo: string): string {
    switch ((tipo || '').toLowerCase()) {
      case 'evento':
        return 'border-blue-400';
      case 'rutina':
        return 'border-yellow-200';
      default:
        return 'border-gray-200';
    }
  }

  isSameUTCDate(dateA: string, dateB: Date): boolean {
    const dA = new Date(dateA);
    return (
      dA.getUTCFullYear() === dateB.getUTCFullYear() &&
      dA.getUTCMonth() === dateB.getUTCMonth() &&
      dA.getUTCDate() === dateB.getUTCDate()
    );
  }

  processImageFromPrisma(imgData: any):SafeUrl | null {
    try {
      const keys = Object.keys(imgData)
        .filter(key => !isNaN(parseInt(key)))
        .map(key => parseInt(key))
        .sort((a, b) => a - b);
      
      const byteArray = keys.map(key => imgData[key]);
      
      let base64String = btoa(String.fromCharCode(...byteArray));
      
      const jpegStart = base64String.indexOf('/9j/');
      if (jpegStart > 0) {
        base64String = base64String.substring(jpegStart);
      }
      
      const imageUrl = `data:image/jpeg;base64,${base64String}`;
      
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      
    } catch (error) {
      console.error('Error procesando imagen:', error);
      return null;
    }
  }

}
