import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { FamilyFormComponent } from '../../../components/family/family-form/family-form.component';

import { ChildFormComponent } from '../../../components/child/child-form/child-form.component';

@Component({
  selector: 'app-user-profile',
  imports: [AvatarModule, NgClass, ChildFormComponent, FamilyFormComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  constructor(public router: Router) {}

  user = {
    name: 'Juan',
    surname: 'Pérez',
    nick: 'jperez',
    rol: 'Administrador',
    email: 'Juanan@gmail.com',
    createdAt: '2023-10-01',
    avatar:
      'https://www.primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
  };

  children = [
    {
      id: 1,
      name: 'Emilio',
      age: '2 años, 8 meses',
      fecha_nacimiento: '2021-01-15',
      altura: 90,
      peso: 12,
      genero: 'Masculino',
      image: 'https://picsum.photos/536/354',
      descripcion:
        'Emilio es un niño muy juguetón y alegre. Le encanta correr y jugar con sus juguetes. Es muy cariñoso con su familia y amigos.',
    },
    {
      id: 2,
      name: 'Lucía',
      age: '5 años, 1 mes',
      fecha_nacimiento: '2018-09-10',
      altura: 110,
      peso: 18,
      genero: 'Femenino',
      image: 'https://picsum.photos/536/354',
      descripcion:
        'Lucía es una niña muy curiosa y activa. Le encanta explorar y aprender cosas nuevas. Es muy sociable y le gusta jugar con otros niños.',
    },
  ];

  familyMembers = [
    { name: 'María', role: 'Administrador', color: 'pink' },
    { name: 'Carlos', role: 'Cuidador', color: 'green' },
    { name: 'Lucía', role: 'Cuidador', color: 'blue' },
  ];

  childModalVisible = false;

  showChildModal() {
    this.childModalVisible = true;
  }

  hideChildModal() {
    this.childModalVisible = false;
  }

  familyModalVisible = false;

  showFamilyModal() {
    this.familyModalVisible = true;
  }

  hideFamilyModal() {
    this.familyModalVisible = false;
  }

  getBgColor(member: any) {
    switch (member.color) {
      case 'orange':
        return 'bg-[#ff7f50] ';
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
