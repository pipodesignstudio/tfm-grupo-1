import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FamiliesStore, ObjectivesService } from '../../../../shared/services';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { ObjetivoDto } from '../../../../shared/interfaces';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create-first-objetivo-page',
  providers: [MessageService],
  imports: [ReactiveFormsModule, ToastModule, FormsModule, InputTextModule, ButtonModule, DatePickerModule, MessageModule, SelectModule, ColorPickerModule],
  templateUrl: './create-first-objetivo-page.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFirstObjetivoPageComponent {
  private familyStore = inject(FamiliesStore);
  private fb = inject(FormBuilder);
  private objectiveService = inject(ObjectivesService);
  private router = inject(Router);
  private ms = inject(MessageService);

  public tipos = ['Salud', 'Educación', 'Alimentación', 'Social', 'Actividades', 'Cuidado Diario', 'Otros'];

  public minDate = new Date();

  public objetivoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    color: ['#FFD500'],
    tipo: [''],
    fecha_fin: [''],
  });

  public isLoading = false;

  public kidName = computed(() => this.familyStore.currentKidName());
  private kidId = computed(() => this.familyStore.currentKidId());

  async onSubmit() {
    this.isLoading = true;
    const dto: ObjetivoDto = {
      nombre: this.objetivoForm.value.nombre!,
      color: this.objetivoForm.value.color ?? '#FFD500',
      tipo: this.objetivoForm.value.tipo ?? 'Otros',
      fecha_fin: this.objetivoForm.value.fecha_fin ?? null
    };
    const objetivoId = await this.objectiveService.createObjective(dto, this.kidId()!);
    if (objetivoId) {
      this.familyStore.setCurrentObjetivoId(objetivoId);
      this.isLoading = false;
      this.router.navigate(['onboarding/create-actividad']);
    } else {
      this.isLoading = false;
      this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el objetivo' });
    }
  }

 }
