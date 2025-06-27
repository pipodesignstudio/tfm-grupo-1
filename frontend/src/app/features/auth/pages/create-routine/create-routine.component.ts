// src/app/pages/public/create-routine/create-routine.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-routine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-routine.component.html',
  styleUrl: './create-routine.component.css',
})
export class CreateRoutineComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  createFromScratch(): void {
    console.log('Navegar a: Crear rutina desde cero (RoutineForm)');
    // Redirige al RoutineFormComponent
    this.router.navigate(['/dashboard/routine-form']);
  }

  choosePredefined(): void {
    console.log('Navegar a: Elegir rutina predefinida (RoutineList)');
    // Redirige al RoutineListComponent
    this.router.navigate(['/routine-list']);
  }

  passTest(): void {
    console.log('Navegar a: Pasar el test de rutina');
    // Esta opción aún no tiene una ruta específica, se mantiene el console.log
    // Por ejemplo: this.router.navigate(['/routine-test']);
  }
}
