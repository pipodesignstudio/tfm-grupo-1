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

  children = [
    { name: 'Emilio', value: '1', selected: true },
    { name: 'Ramon', value: '2' },
  ];

  user = {
    nick: 'Maxito',
    name: 'Max',
    surname: 'Mustermann',
    avatar: 'https://gravatar.com/avatar/7156d0abbfcc494cf10e4adab6a8884d?s=400&d=robohash&r=x',
    rol: 'admin',
  };
}