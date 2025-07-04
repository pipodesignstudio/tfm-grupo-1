import { Component, ChangeDetectorRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { IChild } from '../../../../shared/interfaces/ichild.interface';
import { IObjetivo } from '../../../../shared/interfaces/iobjective.interface';
import { IActivity } from '../../../../shared/interfaces/iactivity.interface';
import { ChildService } from '../../../../shared/services/child.service';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';
import { ObjectivesService } from '../../../../shared/services/objectives.service';
import { ActivityService } from '../../../../shared/services/activity.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-objectives-page',
  standalone: true,
  imports: [CommonModule, DropdownModule, ButtonModule, FormsModule],
  templateUrl: './objectives-page.component.html',
})
export class ObjectivesPageComponent {
  private familiesStore = inject(FamiliesStore);
  private childService = inject(ChildService);
  private objectivesService = inject(ObjectivesService);
  private activityService = inject(ActivityService);
  private cdr = inject(ChangeDetectorRef);

  children: IChild[] = [];
  childrenOptions: { label: string; value: number }[] = [];
  selectedChildId: number | null = null;

  objetivos: IObjetivo[] = [];
  activitiesMap: Map<number, IActivity> = new Map();

  constructor() {
    effect(() => {
      const familia = this.familiesStore.familiaSeleccionada();
      if (!familia) return;

      this.childService.getChildrenByFamily(String(familia.id)).then((children) => {
        this.children = children;

        this.childrenOptions = children.map((child) => ({
          label: child.nombre,
          value: Number(child.id),
        }));

        if (this.childrenOptions.length > 0) {
          this.selectedChildId = this.childrenOptions[0].value;
          this.cdr.detectChanges();
          this.loadObjectives(this.selectedChildId);
        }
      });

      this.objectivesService.objectives$.subscribe(async (objetivos) => {
        this.objetivos = Array.isArray(objetivos)
          ? objetivos
          : typeof objetivos === 'object' && 'data' in objetivos
            ? (objetivos as any).data
            : [];

        const ids = this.objetivos.flatMap(obj => obj.objetivos_has_actividades?.map(a => a.actividad_id) ?? []);
        const actividades = await this.activityService.getActivitiesByIds(ids);
        this.activitiesMap = new Map(actividades.map(act => [act.id, act]));

        this.cdr.detectChanges();
      });
    });
  }

  onChangeChild(): void {
    if (this.selectedChildId != null) {
      this.loadObjectives(this.selectedChildId);
    }
  }

  private loadObjectives(idNino: number): void {
    this.objectivesService.getAllObjectives(idNino);
  }

  getColorWithOpacity(hex: string | null | undefined, opacity = 0.5): string {
    if (!hex) return `rgba(59, 130, 246, ${opacity})`;
    const match = hex.replace('#', '').match(/.{1,2}/g);
    if (!match || match.length < 3) return hex;
    const [r, g, b] = match.map((x) => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  getProgreso(obj: IObjetivo): number {
    const actividades = obj.objetivos_has_actividades
      ?.map(a => this.activitiesMap.get(a.actividad_id))
      .filter(Boolean) ?? [];
    const total = actividades.length;
    const completadas = actividades.filter(a => a?.completado).length;
    return total === 0 ? 0 : Math.round((completadas / total) * 100);
  }

  async onToggleActividad(objetivo: IObjetivo, actividadId: number): Promise<void> {
    const actividad = this.activitiesMap.get(actividadId);
    if (!actividad) return;

    const nuevoEstado = !actividad.completado;

    // Actualización optimista
    this.activitiesMap.set(actividadId, { ...actividad, completado: nuevoEstado });
    this.cdr.detectChanges();

    try {
      await this.activityService.updateActivityCompleted(actividadId, nuevoEstado, actividad.ninos_id);
    } catch (error) {
      console.error('Error al actualizar la actividad:', error);

      // Revertir si falla
      this.activitiesMap.set(actividadId, { ...actividad });
      this.cdr.detectChanges();
    }
  }

}
