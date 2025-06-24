import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutUsPageComponent } from "../../pages/about-us-page/about-us-page.component";
import { HeaderComponent } from "../../../../shared/components/header/header.component";

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
export class DashboardLayoutComponent { }
