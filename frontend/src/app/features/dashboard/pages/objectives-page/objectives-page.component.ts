import { Component, ChangeDetectorRef, inject, effect } from '@angular/core';
import { ChildService } from '../../../../shared/services/child.service'
import { FamiliesStore } from '../../../../shared/services/familiesStore.service'
import { IChild } from '../../../../shared/interfaces/ichild.interface'
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-objectives-page',
  imports: [
    DropdownModule,
    FormsModule,
    ButtonModule,
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

  // Variables para el desplegable
  children: IChild[] = [];
  filtroOpciones: { label: string; value: number | null }[] = [];
  selectedChild: number | null = null;

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
    // Aquí puedes cargar los objetivos del niño seleccionado
    // this.loadObjectives();
  }

  createObjective(): void {
    this.router.navigate(['/dashboard/objectives-form'], {
      queryParams: { childId: this.selectedChild, mode: 'create' }
    });
  }
}
