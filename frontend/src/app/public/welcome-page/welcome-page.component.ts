import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-welcome-page',
  imports: [ButtonModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css',
})
export class WelcomePageComponent {
  constructor(private router: Router) {}

  continueToLogin(): void {
    this.router.navigate(['/login']);
  }
}
