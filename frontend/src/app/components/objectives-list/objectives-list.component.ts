import { Component, Input, Signal, computed, signal } from '@angular/core';
import { IObjective } from '../../shared/interfaces/iobjective.interface';
import { NgStyle, DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-objectives-list',
  templateUrl: './objectives-list.component.html',
  imports: [NgStyle, DatePipe],
})
export class ObjectivesListComponent {
  // Internal signal para almacenar los objetivos
  private _objectives = signal<IObjective[]>([]);

  // Setter del Input
  @Input({ required: true })
  set objectives(value: any) {
    if (Array.isArray(value)) {
      this._objectives.set(value);
    } else {
      console.warn('⚠️ Valor inválido recibido en <app-objectives-list>: ', value);
      this._objectives.set([]);
    }
  }

  get objectives(): IObjective[] {
    return this._objectives();
  }

  // Computed: objetivos activos
  activeObjectives: Signal<IObjective[]> = computed(() =>
    this._objectives().filter(obj => !obj.fecha_fin || new Date(obj.fecha_fin) > new Date())
  );

  // Computed: objetivos completados
  completedObjectives: Signal<IObjective[]> = computed(() =>
    this._objectives().filter(obj => obj.fecha_fin && new Date(obj.fecha_fin) <= new Date())
  );
}