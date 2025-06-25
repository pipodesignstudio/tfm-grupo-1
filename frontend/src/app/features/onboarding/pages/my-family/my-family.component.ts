import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  ChildService,
  ChildProfile,
} from '../../../../shared/services/child.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-my-family',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './my-family.component.html',
  styleUrl: './my-family.component.css',
})
export class MyFamilyComponent implements OnInit, OnDestroy {
  children: ChildProfile[] = [];
  private childrenSubscription!: Subscription;

  constructor(
    private router: Router,
    @Inject(ChildService) private childService: ChildService
  ) {}

  ngOnInit(): void {
    this.childrenSubscription = this.childService.children$.subscribe(
      (children: ChildProfile[]) => {
        this.children = children;
        console.log('Niños cargados en MyFamily:', this.children);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.childrenSubscription) {
      this.childrenSubscription.unsubscribe();
    }
  }

  addNewChild(): void {
    this.router.navigate(['/dashboard/create-family']);
  }

  continueToNextStep(): void {
    if (this.children.length === 0) {
      alert('Por favor, añade al menos un niño para continuar.');
      return;
    }
    this.router.navigate(['/message2']);
  }

  clearAllChildren(): void {
    this.childService.clearChildren();
    alert('Todos los niños han sido borrados (Solo desarrollo).');
  }
}
