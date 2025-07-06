import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutUsPageComponent } from '../../pages/about-us-page/about-us-page.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FamiliesStore } from '../../../../shared/services/familiesStore.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterModule, HeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private familiesStore = inject(FamiliesStore);

  constructor() {
    this.familiesStore.loadFamilias();
  }
}
