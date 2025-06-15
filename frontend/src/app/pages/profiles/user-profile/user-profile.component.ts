import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user-profile',
  imports: [AvatarModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

constructor(public router: Router) {}

  user = {
    name: 'Juan',
    surname: 'Pérez',
    nick: 'jperez',
    rol: 'Administrador',
    avatar: 'https://www.primefaces.org/cdn/primevue/images/avatar/amyelsner.png'
  };

  children = [
    {
      name: 'Emilio',
      age: '2 años, 8 meses',
      height: 90,
      weight: 12,
      image: 'https://picsum.photos/536/354'
    },
    {
      name: 'Lucía',
      age: '5 años, 1 mes',
      height: 110,
      weight: 18,
      image: 'https://picsum.photos/536/354'
    }
  ];

  selectedChild = this.children[0]; // selecciona por defecto el primero

  selectChild(child: any) {
    this.selectedChild = child;
  }
}