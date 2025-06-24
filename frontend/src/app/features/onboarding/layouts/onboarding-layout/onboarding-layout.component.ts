import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardHeaderComponent } from "../../../auth/components/card-header/card-header.component";

@Component({
  selector: 'app-onboarding-layout',
  imports: [RouterModule, CardHeaderComponent],
  templateUrl: './onboarding-layout.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingLayoutComponent { }
