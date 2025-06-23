import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Router, NavigationEnd } from '@angular/router';

import { ThemeService } from "./service/theme.service";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Nido';

  private themeService = inject(ThemeService);

  ngOnInit() {
  this.themeService.applyTheme();}

  showLayoutHeader = true;
  showLayoutFooter = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const hiddenRoutesHeader = ['/', '/login', '/register'];
      const hiddenRoutesFooter = ['/','/login', '/register'];
      this.showLayoutHeader = !hiddenRoutesHeader.includes(event.urlAfterRedirects);
      this.showLayoutFooter = !hiddenRoutesFooter.includes(event.urlAfterRedirects);
    });
  }
}