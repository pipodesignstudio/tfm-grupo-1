import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivityService } from '../../../../shared/services';
import { IActivity } from '../../../../shared/interfaces';
import { catchError, finalize, take } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NinoTableComponent } from "../../components/nino-table/nino-table.component";
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-download-activities-page',
  providers: [MessageService],
  imports: [TableModule, ToastModule, ButtonModule, CommonModule, NinoTableComponent, TagModule],
  templateUrl: './download-activities-page.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadActivitiesPageComponent implements OnInit { 
  private activitiesService = inject(ActivityService);
  public isLoading = signal<boolean>(true);
  public isExporting = false;

  private ms = inject(MessageService);

  activities: IActivity[] = [];
  selectedActivities: IActivity[] = [];

  ngOnInit(): void {
    from(this.activitiesService.getMyActivities()).pipe(
      take(1),
      catchError((error) => {
        console.error(error);
        this.isLoading.set(false);
        return of([]);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe(
      (activities) => {
        console.log(activities);
        this.activities = activities;
      },
    )
  }

  async downloadActivities() {
    const ids:number[] = this.selectedActivities.map(activity => activity.id);
    this.isExporting = true;
    console.log(ids);
    const success = await this.activitiesService.downloadActivities(ids);
    this.isExporting = false;
    if (success) {
      this.ms.add({ severity: 'success', summary: 'Exportado', detail: 'Actividades exportadas correctamente' });
    } else {
      this.ms.add({ severity: 'error', summary: 'Error', detail: 'Error al exportar actividades' });
    }
  }
}
