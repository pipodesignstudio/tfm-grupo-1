import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChildService, FamiliesStore } from '../../../../shared/services';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CreateNinoDto } from '../../../../shared/interfaces';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create-nino-page',
  providers: [MessageService],
  imports: [FormsModule, ToastModule, ReactiveFormsModule, ButtonModule, MessageModule, InputTextModule, InputNumberModule, TextareaModule, SelectModule, DatePickerModule],
  templateUrl: './create-nino-page.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNinoPageComponent { 

  private fb = inject(FormBuilder);
  private familyStore = inject(FamiliesStore);
  private cdf = inject(ChangeDetectorRef);
  private childService = inject(ChildService);
  private router = inject(Router);
  private ms = inject(MessageService);

  public picture: File | null = null;

  public genres = ['Masculino', 'Femenino', 'No especificar'];

  private familyId = this.familyStore.currentFamilyId();

  public isLoading = false;

  async onFileChange(evt: Event): Promise<void> {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file || !file.type.startsWith('image/')) return;          
  
    const base64 = await this.fileToBase64(file);
    this.ninoForm.patchValue({ imgPerfil: base64 });
    this.cdf.detectChanges();
  }
  
  private fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error leyendo imagen'));
      reader.readAsDataURL(file);
    });
  }
  public ninoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellido: ['', [Validators.required, Validators.minLength(3)]],
    fecha_nacimiento: ['', [Validators.required]],
    descripcion: [null as string | null],
    genero: ['', [Validators.required]],
    peso: [null as number | null],
    altura: [null as number | null],
    imgPerfil: [null as string | null],
  });

  async onSubmit() { 
    this.isLoading = true;
    console.log(this.familyId)
    const {nombre, apellido, fecha_nacimiento, descripcion, genero, peso, altura, imgPerfil} = this.ninoForm.value;
    const childDto:Omit<CreateNinoDto, 'perfiles_aprendizaje_id'> = {
      nombre: nombre!,
      apellido: apellido!,
      fecha_nacimiento: fecha_nacimiento!,
      descripcion: descripcion || null,
      genero: genero!,
      peso: peso || null,
      altura: altura || null,
      img_perfil: imgPerfil || null,
      familia_id: this.familyId!,
    };
    const child = await this.childService.createChild(childDto);
    if (!child) {
      this.isLoading = false;
      this.ms.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al crear el niño',
      });
      return;
    }
    this.familyStore.seleccionarNiño(child.id);
    this.isLoading = false;
    this.router.navigate(['/onboarding/crear-nino']);
  }

}
