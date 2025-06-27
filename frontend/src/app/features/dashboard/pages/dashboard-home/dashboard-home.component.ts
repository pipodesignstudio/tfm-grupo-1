import { Component, OnInit } from '@angular/core';

interface Child {
  name: string;
  routine: string[];
}

@Component({
  selector: 'app-dashboard-home',
  imports: [],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit {
  userName: string = 'Paula';
  date = new Date();

  children: Child[] = [
    { name: 'Mateo', routine: ['Desayuno', 'Colegio', 'Deberes', 'Cena'] },
    { name: 'Julia', routine: ['Desayuno', 'Guardería', 'Jugar', 'Cena'] },
  ];

  activeChild = 0;

  constructor() {}
  ngOnInit(): void {}

  nextChild() {
    this.activeChild = (this.activeChild + 1) % this.children.length;
  }

  previousChild() {
    this.activeChild =
      (this.activeChild - 1 + this.children.length) % this.children.length;
  }
}
