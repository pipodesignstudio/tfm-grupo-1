import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../../../shared/services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-complete-onboarding',
  imports: [ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './complete-onboarding.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteOnboardingComponent {
  private router = inject(Router);
  private userService = inject(UsersService);
  private messageService = inject(MessageService);

  public isLoading: boolean = false;

  async onContinue(): Promise<void> {
    this.isLoading = true;
    const response = await this.userService.completeOnboarding();
    this.isLoading = false;
    if (!response || !response.success) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response?.message ?? 'Error al completar el onboarding',
      });
      return;
    }
    this.router.navigate(['dashboard']);
  }
}
