import { Component, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectivesService } from '../../../../shared/services/objectives.service';
import { IObjective } from '../../../../shared/interfaces/iobjective.interface';
import { ChildService } from '../../../../shared/services/child.service';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';
import { IChild } from '../../../../shared/interfaces';
import { ObjectivesListComponent } from '../../../../components/objectives-list/objectives-list.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-objectives-page',
  templateUrl: './objectives-page.component.html',
  styleUrls: ['./objectives-page.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ObjectivesListComponent
  ],
  providers: [MessageService, ConfirmationService]
})
export class ObjectivesPageComponent {
  /** Opciones para el selector de niños */
  childrenOptions: { label: string; value: number }[] = [];

  /** ID del niño seleccionado actualmente */
  selectedChildId: number | null = null;

  /** Lista de objetivos del niño seleccionado */
  objectives: IObjective[] = [];

  constructor(
    private childService: ChildService,
    private familiesStore: FamiliesStore,
    private objectivesService: ObjectivesService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Efecto que escucha cambios en la familia seleccionada.
   * Cuando cambia, carga la lista de niños y selecciona el primero por defecto.
   */
  private familiaEffect = effect(() => {
    const familia = this.familiesStore.familiaSeleccionada();
    if (!familia) return;

    this.childService.getChildrenByFamily(String(familia.id)).then(children => {
      this.childrenOptions = children.map((child: IChild) => ({
        label: child.nombre,
        value: Number(child.id),
      }));

      // Si hay niños, seleccionamos el primero y cargamos sus objetivos
      if (this.childrenOptions.length > 0) {
        this.selectedChildId = this.childrenOptions[0].value;
        this.loadObjectives();
      }
    });
  });

  /**
   * Al cambiar el niño manualmente desde el selector, se recargan sus objetivos
   */
  onChildChange(): void {
    this.loadObjectives();
  }

  /**
   * Carga los objetivos del niño seleccionado.
   * Usamos el getter del servicio para obtener el array actualizado desde el BehaviorSubject.
   */
  loadObjectives(): void {
    if (!this.selectedChildId) return;

    this.objectivesService.getObjectivesByChildId(this.selectedChildId)
      .then(() => {
        // ✅ Usamos el getter que siempre devuelve un array limpio
        const objetivos = this.objectivesService.getObjectives();
        this.objectives = objetivos;
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Error al obtener los objetivos:', error);
        this.objectives = [];
      });
  }

  openNewObjectiveForm(): void {
  console.log('TODO: abrir formulario de nuevo objetivo');
}
}
