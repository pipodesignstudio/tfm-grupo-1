import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';

import { ChildService, ChildProfile } from '../../../service/child.service';
import { ObjectivesService, Objective, Activity } from '../../../service/objectives.service';

@Component({
  selector: 'app-objectives-form',
  templateUrl: './objectives-form.component.html',
  styleUrls: ['./objectives-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    TextareaModule,
    DialogModule
  ]
})
export class ObjectivesFormComponent implements OnInit {
  objectiveForm!: FormGroup;
  activityForm!: FormGroup;
  children: ChildProfile[] = [];
  activities: Partial<Activity>[] = [];
  showAddActivityDialog = false;
  isEditMode = false;
  currentObjectiveId: number | null = null;
  selectedColor = '#FFD700';

  categories = [
    'Salud',
    'Educación', 
    'Alimentación',
    'Social',
    'Actividades',
    'Cuidado Diario',
    'Otros'
  ];

  colors = [
    { name: 'Amarillo', value: '#FFD700' },
    { name: 'Verde', value: '#22C55E' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Morado', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Turquesa', value: '#14B8A6' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private childService: ChildService,
    private objectivesService: ObjectivesService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadChildren();
    this.checkRouteParams();
  }

  initializeForms(): void {
    this.objectiveForm = this.fb.group({
      ninos_id: ['', Validators.required],
      nombre: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      tipo: ['', Validators.required],
      color: [this.selectedColor]
    });

    this.activityForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      hora_inicio: ['']
    });
  }

  loadChildren(): void {
    this.childService.children$.subscribe(children => {
      this.children = children;
    });
  }

  checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['childId']) {
        this.objectiveForm.patchValue({ ninos_id: Number(params['childId']) });
      }
      
      if (params['mode'] === 'edit' && params['objectiveId']) {
        this.isEditMode = true;
        this.currentObjectiveId = Number(params['objectiveId']);
        this.loadObjectiveForEdit();
      }
    });
  }

  loadObjectiveForEdit(): void {
    if (this.currentObjectiveId) {
      const objectives = this.objectivesService.getObjectivesByChild(
        this.objectiveForm.value.ninos_id
      );
      const objective = objectives.find(obj => obj.id === this.currentObjectiveId);
      
      if (objective) {
        this.objectiveForm.patchValue({
          ninos_id: objective.ninos_id,
          nombre: objective.nombre,
          fecha_fin: objective.fecha_fin,
          tipo: objective.tipo,
          color: objective.color
        });
        this.selectedColor = objective.color;
        this.activities = objective.activities.map(activity => ({
          titulo: activity.titulo,
          descripcion: activity.descripcion,
          hora_inicio: activity.hora_inicio
        }));
      }
    }
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.objectiveForm.patchValue({ color });
  }

  addActivity(): void {
    if (this.activityForm.valid) {
      const newActivity: Partial<Activity> = {
        titulo: this.activityForm.value.titulo,
        descripcion: this.activityForm.value.descripcion,
        hora_inicio: this.activityForm.value.hora_inicio,
        completado: false
      };
      
      this.activities.push(newActivity);
      this.activityForm.reset();
      this.showAddActivityDialog = false;
    }
  }

  removeActivity(index: number): void {
    this.activities.splice(index, 1);
  }

  cancelAddActivity(): void {
    this.activityForm.reset();
    this.showAddActivityDialog = false;
  }

  onSubmit(): void {
    if (this.objectiveForm.valid) {
      const objectiveData: Omit<Objective, 'id'> = {
        ninos_id: this.objectiveForm.value.ninos_id,
        nombre: this.objectiveForm.value.nombre,
        color: this.selectedColor,
        tipo: this.objectiveForm.value.tipo,
        fecha_inicio: new Date(),
        fecha_fin: this.objectiveForm.value.fecha_fin,
        activities: this.activities.map((activity, index) => ({
          id: index + 1,
          titulo: activity.titulo || '',
          descripcion: activity.descripcion,
          hora_inicio: activity.hora_inicio,
          completado: activity.completado || false
        })) as Activity[],
        completado: false
      };

      if (this.isEditMode && this.currentObjectiveId) {
        const updatedObjective: Objective = {
          ...objectiveData,
          id: this.currentObjectiveId
        };
        this.objectivesService.updateObjective(updatedObjective);
      } else {
        this.objectivesService.addObjective(objectiveData);
      }

      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
