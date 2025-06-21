import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-landing-page',
  imports: [Button],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  continueToLogin(): void {
    this.router.navigate(['/login']);
  }
}
