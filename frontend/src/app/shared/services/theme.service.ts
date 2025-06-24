import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _sk = 'darkTheme';
  darkTheme = signal<boolean>(this.loadTheme()); 

  constructor() {
    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.darkTheme.set(!this.darkTheme()); 
    localStorage.setItem(this._sk, JSON.stringify(this.darkTheme()));
    this.applyTheme();
  }

  private loadTheme(): boolean {
    return JSON.parse(localStorage.getItem(this._sk) || 'false');
  }

  public applyTheme(): void {
    const element = document.documentElement; 
    this.darkTheme() ? element.classList.add('dark') : element.classList.remove('dark');
  }
}
