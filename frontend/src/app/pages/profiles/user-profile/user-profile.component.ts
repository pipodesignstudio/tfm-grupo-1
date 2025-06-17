import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user-profile',
  imports: [AvatarModule, NgClass],
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
      id: 1,
      name: 'Emilio',
      age: '2 años, 8 meses',
      height: 90,
      weight: 12,
      image: 'https://picsum.photos/536/354'
    },
    {
      id: 2,
      name: 'Lucía',
      age: '5 años, 1 mes',
      height: 110,
      weight: 18,
      image: 'https://picsum.photos/536/354'
    }
  ];

  familyMembers = [
  { name: 'María', role: 'Administrador', color: 'pink' },
  { name: 'Carlos', role: 'Cuidador', color: 'green' },
  { name: 'Lucía', role: 'Cuidador', color: 'blue' }
];

getBgColor(member: any) {
  switch (member.color) {
    case 'pink':
      return 'bg-pink-100';
    case 'green':
      return 'bg-green-100';
    case 'blue':
      return 'bg-blue-100';
    default:
      return 'bg-gray-100';
  }
}


  selectedChild = this.children[0]; // selecciona por defecto el primero

  selectChild(child: any) {
    this.selectedChild = child;
  }
}