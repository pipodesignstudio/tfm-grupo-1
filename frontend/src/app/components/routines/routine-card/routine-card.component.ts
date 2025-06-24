import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRoutine } from '../../../interfaces/iroutine.interface';

@Component({
  selector: 'app-routine-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routine-card.component.html',
})
export class RoutineCardComponent {
  @Input() routine!: IRoutine;
}
