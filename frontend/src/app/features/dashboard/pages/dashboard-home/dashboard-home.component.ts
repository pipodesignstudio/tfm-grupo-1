import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms', style({ opacity: 1, transform: 'none' })),
      ]),
    ]),
  ],
})
export class DashboardHomeComponent implements OnInit {
  userName: string = 'Paula';
  date = new Date();
  children: Child[] = [
    {
      name: 'Julia',
      photoUrl:
        'https://api.dicebear.com/9.x/dylan/svg?seed=Sawyer&scale=85&facialHairProbability=0&hairColor=000000,fff500,ffffff&mood=neutral,happy&skinColor=ffd6c0',
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
    {
      name: 'Mateo',
      photoUrl: 'https://api.dicebear.com/9.x/dylan/svg?seed=Destiny&scale=85',
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

  getTaskBgClass(type: string): string {
    switch (type) {
      case 'meal':
        return 'bg-yellow-100';
      case 'school':
        return 'bg-blue-100';
      case 'homework':
        return 'bg-green-100';
      case 'play':
        return 'bg-pink-100';
      default:
        return 'bg-gray-100';
    }
  }
  toggleTaskComplete(task: RoutineTask) {
    task.completed = !task.completed;
  }
}
