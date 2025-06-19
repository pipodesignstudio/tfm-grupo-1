import { Component, inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  isDarkMode = this.themeService.darkTheme;

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
