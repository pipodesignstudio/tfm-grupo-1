import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChildService, ChildProfile } from '../../../service/child.service';

@Component({
  selector: 'app-my-family',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './my-family.component.html',
  styleUrl: './my-family.component.css',
})
export class MyFamilyComponent implements OnInit {
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
    this.router.navigate(['/create-family']);
  }

  continueToNextStep(): void {
    if (this.children.length === 0) {
      alert('Por favor, añade al menos un niño para continuar.');
      return;
    }
    this.router.navigate(['/select-routine']);
  }

  // LIMPIAR DATOS - TEST
  clearAllChildren(): void {
    this.childService.clearChildren();
  }
}
