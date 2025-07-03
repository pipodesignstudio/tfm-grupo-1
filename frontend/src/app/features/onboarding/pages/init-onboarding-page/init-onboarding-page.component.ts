import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UsersService } from '../../../../shared/services';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-init-onboarding-page',
  imports: [ButtonModule, RouterModule],
  templateUrl: './init-onboarding-page.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitOnboardingPageComponent {
  private userService = inject(UsersService);
  private router = inject(Router);

  public currentUser$ = computed(() => this.userService.user());

  onContinue() {
    this.router.navigate(['onboarding', 'create-family']);
  }

 }
