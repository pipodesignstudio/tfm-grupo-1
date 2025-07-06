import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LogoIconComponent } from "../../../../shared/components/logo-icon/logo-icon.component";

@Component({
  selector: 'app-card-header',
  imports: [ButtonModule, RouterModule, LogoIconComponent],
  templateUrl: './card-header.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeaderComponent { 
  @Input() showDismissable: boolean = true;
  private router = inject(Router);

  onGoBack(): void {
    this.router.navigate(['']);
  }


}

