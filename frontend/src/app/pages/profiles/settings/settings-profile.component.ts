import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../service/theme.service';


interface SettingItem {
  icon: string;
  label: string;
  hasArrow?: boolean;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.css'],
  imports: [FormsModule, InputSwitchModule]
})
export class SettingsComponent {

  private themeService = inject(ThemeService);
  isDarkMode = this.themeService.darkTheme;

  darkMode = false;
  sounds = true;
  vacationMode = false;

  constructor(private router: Router) {}

  logout() {
    console.log('Logging out...');
    this.router.navigate(['/']);
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  settingsItems: SettingItem[] = [
    {
      icon: 'pi pi-user',
      label: 'Account',
      hasArrow: true,
      onClick: () => console.log('Navigate to General settings'),
    },
    {
      icon: 'pi pi-moon',
      label: 'Dark Mode',
      hasToggle: true,
      toggleValue: this.darkMode,
      onToggle: () => this.toggleDarkMode(),
    },
    {
      icon: 'pi pi-shield',
      label: 'Security',
      hasArrow: true,
      onClick: () => console.log('Navigate to Security settings'),
    },
    {
      icon: 'pi pi-bell',
      label: 'Notifications',
      hasArrow: true,
      onClick: () => console.log('Navigate to Notifications settings'),
    }
  ];

  aboutItems: SettingItem[] = [
    {
      icon: 'pi pi-star',
      label: 'Rate Nido',
      hasArrow: true,
      onClick: () => console.log('Navigate to Rate app'),
    },
    {
      icon: 'pi pi-share-alt',
      label: 'Share with Friends',
      hasArrow: true,
      onClick: () => console.log('Share app'),
    },
    {
      icon: 'pi pi-info-circle',
      label: 'About Us',
      hasArrow: true,
      onClick: () => console.log('Navigate to About Us'),
    },
    {
      icon: 'pi pi-question-circle',
      label: 'Support',
      hasArrow: true,
      onClick: () => console.log('Navigate to Support'),
    },
  ];
}