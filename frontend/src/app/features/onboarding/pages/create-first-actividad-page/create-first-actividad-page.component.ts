import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivityService, FamiliesStore, UsersService } from '../../../../shared/services';
import { catchError, finalize, from, of, take } from 'rxjs';
import { ActivityDto } from '../../../../shared/interfaces';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-first-actividad-page',
  imports: [ReactiveFormsModule, SkeletonModule, ToastModule, ButtonModule, DatePickerModule, ColorPickerModule, TextareaModule, InputTextModule, MessageModule],
  providers: [MessageService],  
  templateUrl: './create-first-actividad-page.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFirstActividadPageComponent implements OnInit { 

  private fb = inject(FormBuilder);
  private activityService = inject(ActivityService);
  private familiesStore = inject(FamiliesStore);
  private usersService = inject(UsersService);
  private ms = inject(MessageService);
  private router = inject(Router);

  private nino_id = computed(() => this.familiesStore.currentKidId());
  private objetivo_id = computed(() => this.familiesStore.currentObjetivoId());

  public iaSuggestions: {titulo:string,descripcion:string, color:string}[] = [];

  public isRetrievingSuggestions = signal<boolean>(true);

  public selectedIaSuggestion:number | null = null;

  public isLoading = false;

  minDate = new Date();

  public actividadForm = this.fb.group({
    titulo: ['', [Validators.required]],
    descripcion: [null as string | null],
    color: ['#FFD500'],
    fecha_realizacion: [new Date()],
    hora_inicio: [new Date(), [Validators.required]],
    hora_fin: [new Date(Date.now() + 60 * 60 * 1_000), [Validators.required]],
    completado: [false],
    tipo: ['Objetivo'],
  });

  ngOnInit(): void {
    from(this.activityService.buildActivitiesSuggestions()).pipe(
      finalize(() => this.isRetrievingSuggestions.set(false)),
      take(1),
      catchError(() => {
        console.log('Error al obtener sugerencias');
        return of([]);
      })
    ).subscribe((suggestions) => {
      console.log('suggestions', suggestions);
      this.iaSuggestions = suggestions;
    })
  }

  onIaSuggestionSelected(index: number) {
    if (this.selectedIaSuggestion === index) {
      this.actividadForm.get('titulo')?.reset();
      this.actividadForm.get('descripcion')?.reset();
      this.actividadForm.get('color')?.setValue('#FFD500');
      this.selectedIaSuggestion = null;
      return;
    }
    this.selectedIaSuggestion = index;
    this.actividadForm.get('titulo')?.setValue(this.iaSuggestions[index].titulo);
    this.actividadForm.get('descripcion')?.setValue(this.iaSuggestions[index].descripcion);
    this.actividadForm.get('color')?.setValue(this.iaSuggestions[index].color);
  }


  async onSubmit() {
    this.isLoading = true;
    const dto: ActivityDto = {
      titulo: this.actividadForm.value.titulo!,
      descripcion: this.actividadForm.value.descripcion ?? null,
      fecha_realizacion: this.actividadForm.value.fecha_realizacion!,
      hora_inicio: this.actividadForm.value.hora_inicio!,
      hora_fin: this.actividadForm.value.hora_fin!,
      objetivo_id: this.objetivo_id(),
      completado: this.actividadForm.value.completado!,
      color: this.actividadForm.value.color ?? '#FFD500',
      tipo: 'Objetivo'
    };
    const resp = await this.activityService.postMinimalActivity(dto, this.nino_id()!);
    if (resp) {
      this.isLoading = false;
      this.router.navigate(['onboarding/complete']);
    } else {
      this.isLoading = false;
      this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la actividad' });
    }
  }

}
