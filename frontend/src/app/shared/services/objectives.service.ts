import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Activity {
  id: number;
  titulo: string;
  descripcion?: string;
  dia_semana?: number;
  hora_inicio?: string;
  hora_fin?: string;
  color?: string;
  tipo?: string;
  ubicacion?: string;
  usuario_responsable?: number;
  completado: boolean;
  fechas_realizacion?: string[];
}

export interface Objective {
  id: number;
  ninos_id: number;
  nombre: string;
  color: string;
  tipo: 'Salud' | 'Educación' | 'Alimentación' | 'Social' | 'Actividades' | 'Cuidado Diario' | 'Otros';
  fecha_inicio: Date;
  fecha_fin: Date;
  activities: Activity[];
  completado: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ObjectivesService {
  private objectivesSubject = new BehaviorSubject<Objective[]>([]);
  public objectives$: Observable<Objective[]> = this.objectivesSubject.asObservable();

  private nextObjectiveId = 1;
  private nextActivityId = 1;

  constructor() {
    const storedObjectives = localStorage.getItem('objectives');
    if (storedObjectives) {
      const objectives = JSON.parse(storedObjectives);
      this.objectivesSubject.next(objectives);
      if (objectives.length > 0) {
        this.nextObjectiveId = Math.max(...objectives.map((o: Objective) => o.id)) + 1;
        const maxActivityId = Math.max(...objectives.flatMap((o: Objective) => 
          o.activities.map((a: Activity) => a.id)
        ));
        this.nextActivityId = maxActivityId + 1;
      }
    }
  }

  getObjectivesByChild(childId: number): Objective[] {
    return this.objectivesSubject.getValue().filter(obj => obj.ninos_id === childId);
  }

  getActiveObjectives(childId: number): Objective[] {
    return this.getObjectivesByChild(childId).filter(obj => !obj.completado);
  }

  getInactiveObjectives(childId: number): Objective[] {
    return this.getObjectivesByChild(childId).filter(obj => obj.completado);
  }

  addObjective(objective: Omit<Objective, 'id'>): void {
    const newObjective: Objective = {
      ...objective,
      id: this.nextObjectiveId++,
    };
    const currentObjectives = this.objectivesSubject.getValue();
    const updatedObjectives = [...currentObjectives, newObjective];
    this.objectivesSubject.next(updatedObjectives);
    this.saveObjectivesToLocalStorage(updatedObjectives);
  }

  updateObjective(objective: Objective): void {
    const currentObjectives = this.objectivesSubject.getValue();
    const index = currentObjectives.findIndex(obj => obj.id === objective.id);
    if (index !== -1) {
      currentObjectives[index] = objective;
      this.objectivesSubject.next(currentObjectives);
      this.saveObjectivesToLocalStorage(currentObjectives);
    }
  }

  deleteObjective(objectiveId: number): void {
    const currentObjectives = this.objectivesSubject.getValue();
    const updatedObjectives = currentObjectives.filter(obj => obj.id !== objectiveId);
    this.objectivesSubject.next(updatedObjectives);
    this.saveObjectivesToLocalStorage(updatedObjectives);
  }

  addActivityToObjective(objectiveId: number, activity: Omit<Activity, 'id'>): void {
    const currentObjectives = this.objectivesSubject.getValue();
    const objective = currentObjectives.find(obj => obj.id === objectiveId);
    if (objective) {
      const newActivity: Activity = {
        ...activity,
        id: this.nextActivityId++,
      };
      objective.activities.push(newActivity);
      this.updateObjective(objective);
    }
  }

  toggleActivityCompletion(objectiveId: number, activityId: number): void {
    const currentObjectives = this.objectivesSubject.getValue();
    const objective = currentObjectives.find(obj => obj.id === objectiveId);
    if (objective) {
      const activity = objective.activities.find(act => act.id === activityId);
      if (activity) {
        activity.completado = !activity.completado;
        this.updateObjectiveProgress(objective);
        this.updateObjective(objective);
      }
    }
  }

  private updateObjectiveProgress(objective: Objective): void {
    const completedActivities = objective.activities.filter(act => act.completado).length;
    const totalActivities = objective.activities.length;
    objective.completado = totalActivities > 0 && completedActivities === totalActivities;
  }

  getObjectiveProgress(objective: Objective): number {
    if (objective.activities.length === 0) return 0;
    const completedActivities = objective.activities.filter(act => act.completado).length;
    return Math.round((completedActivities / objective.activities.length) * 100);
  }

  private saveObjectivesToLocalStorage(objectives: Objective[]): void {
    localStorage.setItem('objectives', JSON.stringify(objectives));
  }
}
