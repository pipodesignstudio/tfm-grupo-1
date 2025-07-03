import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChildService } from '../../../../shared/services/child.service';
import { ButtonModule } from 'primeng/button';
import { IChild } from '../../../../shared/interfaces';

@Component({
  selector: 'app-my-family',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './my-family.component.html',
  styleUrl: './my-family.component.css',
})
export class MyFamilyComponent implements OnInit, OnDestroy {
  children: IChild[] = [];

  constructor(private router: Router, private childService: ChildService) {}

  ngOnInit(): void {
    const familia_id = localStorage.getItem('familia_id');
    if (familia_id) {
      this.childService.getChildrenByFamily(familia_id).then((children) => {
        this.children = children;
        console.log('Niños cargados en MyFamily:', this.children);
      });
    } else {
      this.children = [];
    }
  }

  ngOnDestroy(): void {
    // No necesitas unsubscribe aquí porque no usas un observable en este ejemplo
  }

  addNewChild(): void {
    this.router.navigate(['/onboarding/create-family']);
  }

  continueToNextStep(): void {
    if (this.children.length === 0) {
      alert('Por favor, añade al menos un niño para continuar.');
      return;
    }
    this.router.navigate(['/onboarding/complete']);
  }

  async clearAllChildren(): Promise<void> {
    const familia_id = localStorage.getItem('familia_id');
    if (familia_id) {
      try {
        await this.childService.deleteAllChildrenByFamily(familia_id);
        this.children = [];
        alert('Todos los niños han sido borrados (Solo desarrollo).');
      } catch (error) {
        alert('Error al borrar los niños.');
      }
    }
  }
}
