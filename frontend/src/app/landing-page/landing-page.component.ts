import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, ButtonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  continueToLogin(): void {
    this.router.navigate(['/login']);
  }
}
