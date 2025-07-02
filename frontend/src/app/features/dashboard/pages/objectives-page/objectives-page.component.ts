import { Component, ChangeDetectorRef, inject, effect } from '@angular/core';
import { ChildService } from '../../../../shared/services/child.service'
import { FamiliesStore } from '../../../../shared/services/familiesStore.service'
import { IChild } from '../../../../shared/interfaces/ichild.interface'
import { Router } from '@angular/router';

import { Objective } from '../../../../shared/services';
import { ObjectivesService } from '../../../../shared/services/objectives.service';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-objectives-page',
  imports: [
    DropdownModule,
    FormsModule,
    ButtonModule,
    CommonModule,
    TagModule,
    ProgressBarModule,
    CheckboxModule,
    DialogModule,
  ],
  templateUrl: './objectives-page.component.html',
  styleUrls: ['./objectives-page.component.css'],
})
export class ObjectivesPageComponent {

  constructor(private router: Router) {}
  // Inyección de servicios 
  childService = inject(ChildService);
  familiesStore = inject(FamiliesStore);
  private cdr = inject(ChangeDetectorRef);
  objectivesService = inject(ObjectivesService);

  // Variables para el desplegable
  children: IChild[] = [];
  filtroOpciones: { label: string; value: number | null }[] = [];
  selectedChild: number | null = null;

  activeObjectives: Objective[] = [];
  inactiveObjectives: Objective[] = [];

  objectiveToDelete: Objective | null = null;
  showDeleteDialog = false;

  // Efecto reactivo para cargar los niños cuando cambia la familia seleccionada
  private familiaEffect = effect(async () => {
    const familia = this.familiesStore.familiaSeleccionada();
    if (!familia) return;
    try {
      // Cargar los niños de la familia seleccionada
      this.children = await this.childService.getChildrenByFamily(String(familia.id));
      // Opciones para el dropdown (igual que tu compañero)
      this.filtroOpciones = this.children.map(child => ({
        label: child.nombre,
        value: Number(child.id),
      }));
      // Selecciona por defecto el primero si existe
      if (this.children.length > 0) {
        this.selectedChild = this.children[0].id;
        // Aquí puedes cargar los objetivos del niño seleccionado
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar los niños:', error);
    }
  });

  // Método para manejar el cambio de selección en el dropdown
  onChildChange(event: any): void {
    this.selectedChild = event.value;
    this.loadObjectives();
  }

  loadObjectives(): void {
    if (!this.selectedChild) return;
    this.activeObjectives = this.objectivesService.getActiveObjectives(this.selectedChild);
    this.inactiveObjectives = this.objectivesService.getInactiveObjectives(this.selectedChild);
  }

  createObjective(): void {
    this.router.navigate(['/dashboard/objectives-form'], {
      queryParams: { childId: this.selectedChild, mode: 'create' }
    });
  }

  getObjectiveStyles(obj: Objective): { [key: string]: string } {
    const base = obj.color;
    // Lógica para aclarar el color si lo necesitas
    return {
      'border': `2px solid ${base}`,
      'background-color': base + '20', // Ejemplo: color con opacidad
    };
  }
  
  editObjective(obj: Objective): void {
    this.router.navigate(['/dashboard/objectives-form'], {
      queryParams: {
        childId: this.selectedChild,
        objectiveId: obj.id,
        mode: 'edit'
      }
    });
  }

  getObjectiveProgress(obj: Objective): number {
    if (!obj.activities || obj.activities.length === 0) return 0;
    const completed = obj.activities.filter(a => a.completado).length;
    return Math.round((completed / obj.activities.length) * 100);
  }

  confirmDeleteObjective(obj: Objective): void {
    // Aquí puedes abrir un diálogo de confirmación o marcar el objetivo para borrar
    // Ejemplo simple:
    this.objectiveToDelete = obj;
    this.showDeleteDialog = true;
  }
  
  onActivityToggle(completed: boolean, objectiveId: number, activityId: number): void {
    // Llama a tu servicio para actualizar el estado de la actividad
    this.objectivesService.toggleActivityCompletion(objectiveId, activityId);
    // Recarga los objetivos para reflejar los cambios
    this.loadObjectives();
  }
  
  
  
}
