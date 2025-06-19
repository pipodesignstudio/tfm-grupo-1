import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

import { ChildService, ChildProfile } from '../../../service/child.service';
import { ObjectivesService, Objective } from '../../../service/objectives.service';

@Component({
  selector: 'app-objectives-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    TagModule,
    ProgressBarModule,
    CheckboxModule,
    DialogModule
  ],
  templateUrl: './objectives-page.component.html',
  styleUrls: ['./objectives-page.component.css']
})
export class ObjectivesPageComponent implements OnInit {
  children: ChildProfile[] = [];
  selectedChild: number | null = null;
  activeObjectives: Objective[] = [];
  inactiveObjectives: Objective[] = [];
  showDeleteDialog = false;
  objectiveToDelete: Objective | null = null;

  constructor(
    private router: Router,
    private location: Location,
    private childService: ChildService,
    private objectivesService: ObjectivesService
  ) {}

  ngOnInit(): void {
    this.childService.children$.subscribe(children => {
      this.children = children;
      if (children.length && !this.selectedChild) {
        this.selectedChild = children[0].id;
        this.loadObjectives();
      }
    });
  }

  onChildChange(event: any): void {
    this.selectedChild = event.value;
    this.loadObjectives();
  }

  private loadObjectives(): void {
    if (!this.selectedChild) return;
    this.activeObjectives = this.objectivesService.getActiveObjectives(this.selectedChild);
    this.inactiveObjectives = this.objectivesService.getInactiveObjectives(this.selectedChild);
  }

  goBack(): void {
    this.location.back();
  }

  createObjective(): void {
    this.router.navigate(['/objectives-form'], {
      queryParams: { childId: this.selectedChild, mode: 'create' }
    });
  }

  editObjective(obj: Objective): void {
    this.router.navigate(['/objectives-form'], {
      queryParams: {
        childId: this.selectedChild,
        objectiveId: obj.id,
        mode: 'edit'
      }
    });
  }

  confirmDeleteObjective(obj: Objective): void {
    this.objectiveToDelete = obj;
    this.showDeleteDialog = true;
  }

  deleteObjective(): void {
    if (!this.objectiveToDelete) return;
    this.objectivesService.deleteObjective(this.objectiveToDelete.id);
    this.loadObjectives();
    this.objectiveToDelete = null;
    this.showDeleteDialog = false;
  }

  onActivityToggle(_: boolean, objId: number, actId: number): void {
    this.objectivesService.toggleActivityCompletion(objId, actId);
    this.loadObjectives();
  }

  isObjectiveExpired(obj: Objective): boolean {
    const today = new Date(), end = new Date(obj.fecha_fin);
    return end < today && !obj.completado;
  }

  isObjectiveExpiringSoon(obj: Objective): boolean {
    const today = new Date(), end = new Date(obj.fecha_fin);
    const days = Math.ceil((end.getTime() - today.getTime()) / 86400000);
    return days > 0 && days <= 7 && !obj.completado;
  }

  getDaysRemaining(obj: Objective): number {
    const today = new Date(), end = new Date(obj.fecha_fin);
    return Math.ceil((end.getTime() - today.getTime()) / 86400000);
  }

  getObjectiveProgress(obj: Objective): number {
    return this.objectivesService.getObjectiveProgress(obj);
  }

  // Estilos dinámicos por color de objetivo
  getObjectiveStyles(obj: Objective): { [key: string]: string } {
    const base = obj.color;
    const lightBg = this.lightenColor(base, 0.8);
    return {
      'border': `2px solid ${base}`,
      'background-color': lightBg,
      '--progressbar-value': base,
      '--checkbox-color': base,
    };
  }

  getObjectiveColor(obj: Objective): string {
    return obj.color;
  }

  private lightenColor(hex: string, luminosity = 0.5): string {
    hex = hex.replace('#', '');
    const rgb = hex.match(/.{2}/g)?.map(h => parseInt(h, 16)) || [0,0,0];
    const newRgb = rgb.map(c => Math.min(255, c + (255 - c) * luminosity));
    return `rgb(${newRgb.join(',')})`;
  }
}

