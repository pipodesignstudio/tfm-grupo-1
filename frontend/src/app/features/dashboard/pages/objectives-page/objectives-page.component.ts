import { Component, ChangeDetectorRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { IChild } from '../../../../shared/interfaces/ichild.interface';
import { IObjetivo } from '../../../../shared/interfaces/iobjective.interface';
import { IActivity } from '../../../../shared/interfaces/iactivity.interface';
import { ChildService } from '../../../../shared/services/child.service';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';
import { ObjectivesService } from '../../../../shared/services/objectives.service';
import { ActivityService } from '../../../../shared/services/activity.service';
import { ObjectivesFormComponent } from '../../components/objectives-form/objectives-form.component';
import { ActivityFormComponent } from '../../../../components/activity/activity-form.component';
import { ObjetivosHasActivitiesService } from '../../../../shared/services/objetivo-has-actividades.service';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-objectives-page',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    ObjectivesFormComponent,
    ActivityFormComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './objectives-page.component.html',
})
export class ObjectivesPageComponent {
  private familiesStore = inject(FamiliesStore);
  private childService = inject(ChildService);
  private objectivesService = inject(ObjectivesService);
  private activityService = inject(ActivityService);
  private objetivosHasActivitiesService = inject(ObjetivosHasActivitiesService)
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  children: IChild[] = [];
  childrenOptions: { label: string; value: number }[] = [];
  selectedChildId: number | null = null;

  objetivos: IObjetivo[] = [];
  objetivosActivos: IObjetivo[] = [];
  objetivosCompletados: IObjetivo[] = [];

  activitiesMap: Map<number, IActivity> = new Map();

  showForm = false;
  objectiveToEdit: IObjetivo | null = null;

  mostrarActivityModal = false;
  actividadInfo: IActivity | null = null;
  objetivoParaNuevaActividad: IObjetivo | null = null;

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

        this.objetivosActivos = this.objetivos.filter(o => this.getProgreso(o) < 100);
        this.objetivosCompletados = this.objetivos.filter(o => this.getProgreso(o) === 100);

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
    this.activitiesMap.set(actividadId, { ...actividad, completado: nuevoEstado });
    this.cdr.detectChanges();

    try {
      await this.activityService.updateActivityCompleted(actividadId, nuevoEstado, actividad.ninos_id);

      this.objetivosActivos = this.objetivos.filter(o => this.getProgreso(o) < 100);
      this.objetivosCompletados = this.objetivos.filter(o => this.getProgreso(o) === 100);
      this.cdr.detectChanges();
    } catch (error) {
      this.activitiesMap.set(actividadId, { ...actividad });
      this.cdr.detectChanges();
    }
  }

  openNewObjectiveForm(): void {
    if (!this.selectedChildId) return;
    this.objectiveToEdit = null;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  openEditObjectiveForm(obj: IObjetivo): void {
    this.objectiveToEdit = obj;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  onCerrarFormulario(idNino?: number) {
    if (typeof idNino === 'number') {
      this.selectedChildId = idNino;
      this.loadObjectives(idNino);
    }
    this.closeForm();
  }

  closeForm(): void {
    this.showForm = false;
    this.objectiveToEdit = null;
  }

  async onGuardarObjetivo({ idNino, data }: { idNino: number; data: any }): Promise<void> {
    try {
      const dataConTipoCorrecto = { ...data, tipo: 'Objetivo' };
      await this.objectivesService.createObjective(dataConTipoCorrecto, idNino);
      this.messageService.add({
        severity: 'success',
        summary: '¡Objetivo creado!',
        detail: 'El objetivo se ha creado correctamente.',
        life: 2500,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al crear',
        detail: 'No se pudo crear el objetivo.',
        life: 3000,
      });
    }
  }

  async onEditarObjetivo({ idNino, idObjetivo, data }: { idNino: number; idObjetivo: number; data: any }): Promise<void> {
    try {
      await this.objectivesService.updateObjective(idNino, idObjetivo, data);
      this.loadObjectives(idNino);
      this.closeForm();
      this.messageService.add({
        severity: 'success',
        summary: '¡Objetivo actualizado!',
        detail: 'El objetivo se ha actualizado correctamente.',
        life: 2500,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al actualizar',
        detail: 'No se pudo actualizar el objetivo.',
        life: 3000,
      });
    }
  }

  confirmDeleteObjective(obj: IObjetivo): void {
    this.confirmationService.confirm({
      message: `¿Seguro que quieres eliminar el objetivo "${obj.nombre}" y todas sus actividades asociadas?`,
      header: 'Eliminar objetivo',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteObjectiveConfirmed(obj),
    });
  }

  async deleteObjectiveConfirmed(obj: IObjetivo): Promise<void> {
    if (!obj) return;
    const idNino = this.selectedChildId!;
    const idObjetivo = obj.id;

    try {
      const actividades = obj.objetivos_has_actividades ?? [];
      for (const act of actividades) {
        try {
          await this.activityService.deleteActivity(act.actividad_id, idNino);
        } catch (e) {
          console.error(`Error al borrar la actividad ${act.actividad_id}:`, e);
        }
      }

      await this.objectivesService.deleteObjective(idNino, idObjetivo);

      this.loadObjectives(idNino);
      this.messageService.add({
        severity: 'success',
        summary: '¡Objetivo eliminado!',
        detail: 'El objetivo y sus actividades han sido eliminados.',
        life: 2500,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: 'No se pudo eliminar el objetivo o sus actividades.',
        life: 3000,
      });
    }
  }

  cerrarActivityModal(): void {
    this.mostrarActivityModal = false;
    this.actividadInfo = null;
    this.objetivoParaNuevaActividad = null;
  }

  onAddActivity(obj: IObjetivo): void {
    this.actividadInfo = null;
    this.objetivoParaNuevaActividad = obj;
    this.mostrarActivityModal = true;
  }

  get selectedChildObj(): IChild | null {
    return this.children.find(c => c.id === this.selectedChildId) || null;
  }

  async guardarNuevaActividad(nuevaActividad: Partial<IActivity>) {
    if (!this.objetivoParaNuevaActividad || !this.selectedChildId) return;

    try {
      const actividadAEnviar: IActivity = {
        ...nuevaActividad,
        tipo: 'Objetivo',
        ninos_id: this.selectedChildId,
      } as IActivity;

      const actividadCreada = await this.activityService.createActivity(actividadAEnviar);

      await this.objetivosHasActivitiesService.addActivityToObjective({
        objetivoId: this.objetivoParaNuevaActividad.id,
        actividadId: actividadCreada.id
      });

      this.loadObjectives(this.selectedChildId);
    } catch (error) {
      // Manejo de error
    } finally {
      this.cerrarActivityModal();
    }
  }
}
