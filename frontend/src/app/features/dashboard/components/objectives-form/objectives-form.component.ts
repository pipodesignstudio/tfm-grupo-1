import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IChild } from '../../../../shared/interfaces/ichild.interface';
import { IObjective } from '../../../../shared/interfaces/iobjective.interface';
import { IActivity } from '../../../../shared/interfaces/iactivity.interface';
import { ChildService } from '../../../../shared/services/child.service';
import { ObjectivesService } from '../../../../shared/services/objectives.service';

// PrimeNG modules (solo para imports en el decorador standalone)
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';

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

  children: IChild[] = [];
  activities: Partial<IActivity>[] = [];

  showAddActivityDialog = false;
  isEditMode = false;
  currentObjectiveId: number | null = null;
  selectedColor = '#FFD700';

  categories = [
    { label: 'Salud', value: 'Salud' },
    { label: 'Educación', value: 'Educación' },
    { label: 'Alimentación', value: 'Alimentación' },
    { label: 'Social', value: 'Social' },
    { label: 'Actividades', value: 'Actividades' },
    { label: 'Cuidado Diario', value: 'Cuidado Diario' },
    { label: 'Otros', value: 'Otros' }
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
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadChildren();
    this.checkRouteParams();
  }

  private initForms(): void {
    this.objectiveForm = this.fb.group({
      ninos_id: [null, Validators.required],
      nombre: ['', Validators.required],
      fecha_fin: [null, Validators.required],
      tipo: ['', Validators.required],
      color: [this.selectedColor]
    });

    this.activityForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      hora_inicio: [null]
    });
  }

  private loadChildren(): void {
    // Suponiendo que tienes un método que devuelve Promise<IChild[]>
    this.childService.getChildren().then(children => {
      this.children = children;
    }).catch(err => {
      console.error('Error cargando niños', err);
    });
  }

  private checkRouteParams(): void {
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

  private async loadObjectiveForEdit(): Promise<void> {
    if (!this.currentObjectiveId || !this.objectiveForm.value.ninos_id) return;
    try {
      const objectives = await this.objectivesService.getObjectivesByChild(String(this.objectiveForm.value.ninos_id));
      const objective = objectives.find(obj => obj.id === this.currentObjectiveId);
      if (!objective) return;

      this.objectiveForm.patchValue({
        ninos_id: objective.ninos_id,
        nombre: objective.nombre,
        fecha_fin: objective.fecha_fin ? new Date(objective.fecha_fin) : null,
        tipo: objective.tipo,
        color: objective.color ?? this.selectedColor
      });
      this.selectedColor = objective.color ?? this.selectedColor;
      // Si tienes activities completas en el objetivo
      this.activities = (objective.activities ?? []).map(activity => ({
        ...activity
      }));
    } catch (error) {
      console.error('Error cargando objetivo para editar', error);
    }
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.objectiveForm.patchValue({ color });
  }

  addActivity(): void {
    if (this.activityForm.valid) {
      const newActivity: Partial<IActivity> = {
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

  async onSubmit(): Promise<void> {
    if (this.objectiveForm.invalid) return;

    // Prepara el objetivo para enviar al backend
    const { ninos_id, nombre, fecha_fin, tipo, color } = this.objectiveForm.value;
    const activitiesToSend = this.activities.map(activity => ({
      titulo: activity.titulo || '',
      descripcion: activity.descripcion || '',
      hora_inicio: activity.hora_inicio || null,
      completado: activity.completado ?? false
    }));

    // El backend espera activities, no activities_ids
    const objectiveData: Omit<IObjective, 'id'> = {
      ninos_id,
      nombre,
      fecha_fin,
      tipo,
      color,
      activities: activitiesToSend
    };

    try {
      if (this.isEditMode && this.currentObjectiveId) {
        await this.objectivesService.updateObjective({
          ...objectiveData,
          id: this.currentObjectiveId
        } as IObjective);
      } else {
        await this.objectivesService.createObjective(objectiveData);
      }
      this.router.navigate(['/dashboard/objectives']);
    } catch (error) {
      console.error('Error guardando objetivo', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/objectives']);
  }
}
