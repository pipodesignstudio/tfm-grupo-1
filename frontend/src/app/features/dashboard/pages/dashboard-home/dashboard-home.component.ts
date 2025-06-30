import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type TaskType = 'meal' | 'school' | 'homework' | 'play' | 'other';

interface RoutineTask {
  time: string;
  icon: string;
  label: string;
  completed: boolean;
  type: TaskType;
}

interface Child {
  name: string;
  photoUrl: string;
  routine: RoutineTask[];
}

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms', style({ opacity: 1, transform: 'none' })),
      ]),
    ]),
  ],
})
export class DashboardHomeComponent {
  userName: string = 'Paula';
  date = new Date();

  links = [
    { url: '/routines', icon: 'pi pi-list', label: 'Rutinas' },
    { url: '/goals', icon: 'pi pi-star', label: 'Objetivos' },
    { url: '/calendar', icon: 'pi pi-calendar', label: 'Calendario' },
    { url: '/notes', icon: 'pi pi-pencil', label: 'Notas' },
  ];

  children: Child[] = [
    {
      name: 'Mateo',
      photoUrl:
        'https://api.dicebear.com/9.x/dylan/svg?seed=Destiny&scale=85&backgroundColor=ffd700',
      routine: [
        {
          time: '07:30',
          icon: '🍳',
          label: 'Desayuno',
          completed: false,
          type: 'meal',
        },
        {
          time: '08:15',
          icon: '🎒',
          label: 'Colegio',
          completed: false,
          type: 'school',
        },
        {
          time: '17:00',
          icon: '📚',
          label: 'Deberes',
          completed: false,
          type: 'homework',
        },
        {
          time: '20:00',
          icon: '🍽️',
          label: 'Cena',
          completed: false,
          type: 'meal',
        },
      ],
    },
    {
      name: 'Julia',
      photoUrl:
        'https://api.dicebear.com/9.x/dylan/svg?seed=Sawyer&scale=85&facialHairProbability=0&hairColor=000000,fff500,ffffff&mood=neutral,happy&skinColor=d2996c&backgroundColor=ffd700',
      routine: [
        {
          time: '07:45',
          icon: '🍳',
          label: 'Desayuno',
          completed: false,
          type: 'meal',
        },
        {
          time: '09:00',
          icon: '🎒',
          label: 'Guardería',
          completed: false,
          type: 'school',
        },
        {
          time: '17:30',
          icon: '🪁',
          label: 'Jugar',
          completed: false,
          type: 'play',
        },
        {
          time: '20:00',
          icon: '🍽️',
          label: 'Cena',
          completed: false,
          type: 'meal',
        },
      ],
    },
  ];

  activeChild = 0;

  nextChild() {
    this.activeChild = (this.activeChild + 1) % this.children.length;
  }

  previousChild() {
    this.activeChild =
      (this.activeChild - 1 + this.children.length) % this.children.length;
  }

  getTaskColorClass(type: string): string {
    switch (type) {
      case 'meal':
        return 'border-yellow-200';
      case 'school':
        return 'border-blue-200';
      case 'homework':
        return 'border-green-200';
      case 'play':
        return 'border-pink-200';
      default:
        return 'border-gray-200';
    }
  }

  toggleTaskComplete(task: RoutineTask) {
    task.completed = !task.completed;
  }
}
