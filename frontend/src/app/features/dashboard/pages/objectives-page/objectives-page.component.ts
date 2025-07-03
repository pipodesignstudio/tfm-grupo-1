import { Component, ChangeDetectorRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { IChild } from '../../../../shared/interfaces/ichild.interface';
import { IObjetivo } from '../../../../shared/interfaces/iobjective.interface';
import { ChildService } from '../../../../shared/services/child.service';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';
import { ObjectivesService } from '../../../../shared/services/objectives.service';
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
  private cdr = inject(ChangeDetectorRef);

  children: IChild[] = [];
  childrenOptions: { label: string; value: number }[] = [];
  selectedChildId: number | null = null;

  objetivos: IObjetivo[] = [];

  constructor() {
    // Reacción automática al cargar la familia
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

      this.objectivesService.objectives$.subscribe((objetivos) => {
        this.objetivos = Array.isArray(objetivos)
          ? objetivos
          : typeof objetivos === 'object' && 'data' in objetivos
            ? (objetivos as any).data
            : [];
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
}
