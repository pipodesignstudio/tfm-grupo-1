import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {  Router, RouterModule, UrlSegment } from '@angular/router';
import { CardHeaderComponent } from "../../components/card-header/card-header.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterModule, CardHeaderComponent],
  templateUrl: './auth-layout.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent { 
  private router = inject(Router);
  showDismissable = true;

  ngOnInit(): void {
    const path = this.router.url;
    const segments = path.split('/');
    if (segments.includes('verificar')) {
      this.showDismissable = false;
    }
  }

}
