import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isDarkMode = signal(false);

  toggleDarkMode() {
    this.isDarkMode.update((value) => {
      const isDark = !value;
      document.body.classList.toggle('dark', isDark);
      return isDark;
    });
  }
}
