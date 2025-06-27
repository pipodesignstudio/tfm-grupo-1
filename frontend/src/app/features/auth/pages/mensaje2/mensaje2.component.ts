import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mensaje2',
  imports: [ButtonModule],
  templateUrl: './mensaje2.component.html',
  styleUrl: './mensaje2.component.css',
})
export class Mensaje2Component {
  constructor(private router: Router) {}

  continueToCreateRoutine(): void {
    this.router.navigate(['/auth/create-routine']);
  }
}
