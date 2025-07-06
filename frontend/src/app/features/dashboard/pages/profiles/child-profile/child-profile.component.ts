import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChildService } from '../../../../../shared/services/child.service';
import { HealthService, Alergia, Enfermedad, Vacuna } from '../../../../../shared/services/Health.service';
import { IChild } from '../../../../../shared/interfaces';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-child-profile',
  templateUrl: './child-profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    InputTextModule
  ]
})
export class ChildProfileComponent implements OnInit {
  child: IChild | null = null;
  edadCalculada = '';
  loading = true;
  error = '';
  saving = signal<boolean>(false);
  imgFileUrl = signal<string | null>(null);

  editProfile = false;
  editDescription = false;
  editHealth = false;

  generos = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
  ];

  alergias: Alergia[] = [];
  enfermedades: Enfermedad[] = [];
  vacunas: Vacuna[] = [];

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private childService: ChildService,
    private sanitizer: DomSanitizer,
    private healthService: HealthService
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || isNaN(id) || id <= 0) {
      this.error = 'ID de niño inválido.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      this.child = await this.childService.getChildById(id);
      if (!this.child) {
        this.error = 'No se encontró el niño.';
        return;
      }

      if (this.child.fecha_nacimiento) {
        this.edadCalculada = this.calcularEdad(new Date(this.child.fecha_nacimiento));
      }

      const [alergias, enfermedades, vacunas] = await Promise.all([
        this.healthService.getAlergias(id),
        this.healthService.getEnfermedades(id),
        this.healthService.getVacunas(id),
      ]);

      this.alergias = alergias;
      this.enfermedades = enfermedades;
      this.vacunas = vacunas;

      if (this.child.img_perfil) {
        this.processImageFromPrisma(this.child.img_perfil);
      }
    } catch (e: any) {
      console.error('❌ Error al cargar perfil del niño:', e);
      this.error = e?.error?.message || e?.message || 'No se pudo cargar el perfil.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  calcularEdad(fecha: Date): string {
    if (!fecha || isNaN(fecha.getTime())) return '';
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) edad--;
    return `${edad} años`;
  }

  async saveProfile(): Promise<void> {
    if (!this.child) return;
    this.saving.set(true);
    this.error = '';

    try {
      if (!this.child.nombre || !this.child.apellido || !this.child.fecha_nacimiento) {
        throw new Error('Faltan datos obligatorios');
      }

      const d = new Date(this.child.fecha_nacimiento);
      if (isNaN(d.getTime())) {
        throw new Error('Fecha de nacimiento inválida');
      }

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      this.child.fecha_nacimiento = `${yyyy}-${mm}-${dd}`;

      const updated = await this.childService.updateChild(this.child.id, this.child);
      console.log('✅ Perfil actualizado:', updated);

      if (!updated || !updated.fecha_nacimiento) {
        this.error = 'No se pudo actualizar el perfil.';
        this.saving.set(false);
        return;
      }

      this.child = updated;
      this.cdr.detectChanges();
      this.edadCalculada = this.calcularEdad(new Date(this.child.fecha_nacimiento));
      this.editProfile = false;
      this.saving.set(false);
    } catch (e: any) {
      console.error('❌ Error al guardar perfil:', e);
      this.saving.set(false);

      this.error = e?.error?.message || e?.message || JSON.stringify(e) || 'No se pudo guardar el perfil.';
    } 
  }

  async saveDescription(): Promise<void> {
    if (!this.child) return;
    this.error = '';
    try {
      await this.childService.updateChild(this.child.id, this.child);
      this.editDescription = false;
      this.saving.set(false);
    } catch (e: any) {
      console.error(e);
      this.error = e?.error?.message || e?.message || JSON.stringify(e) || 'No se pudo guardar la descripción.';
    }
  }

  onFileSelected(event: Event): void {
    this.imgFileUrl.set(null);
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.child) this.child.img_perfil = reader.result as string;
        this.imgFileUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async saveHealth(): Promise<void> {
    if (!this.child) return;
    const id = this.child.id;
    this.error = '';

    try {
      for (const a of this.alergias) {
        if (!a.nombre?.trim()) continue;
        if (a.id === 0 || !a.id) await this.healthService.addAlergia(id, a);
        else await this.healthService.updateAlergia(id, a);
      }

      for (const e of this.enfermedades) {
        if (!e.nombre?.trim()) continue;
        if (e.id === 0 || !e.id) await this.healthService.addEnfermedad(id, e);
        else await this.healthService.updateEnfermedad(id, e);
      }

      for (const v of this.vacunas) {
        if (!v.nombre?.trim()) continue;

        if (typeof v.fecha === 'string') {
          const parsed = new Date(v.fecha);
          if (!isNaN(parsed.getTime())) {
            v.fecha = parsed;
          } else {
            console.warn('⚠️ Fecha inválida (string) para vacuna:', v);
            continue;
          }
        }

        if (!(v.fecha instanceof Date) || isNaN(v.fecha.getTime())) {
          console.warn('⚠️ Fecha inválida (objeto) para vacuna:', v);
          continue;
        }

        const yyyy = v.fecha.getFullYear();
        const mm = String(v.fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(v.fecha.getDate()).padStart(2, '0');
        v.fecha = `${yyyy}-${mm}-${dd}`;

        if (v.id === 0 || !v.id) {
          await this.healthService.addVacuna(id, v);
        } else {
          await this.healthService.updateVacuna(id, v.id, v);
        }
      }

      this.editHealth = false;

      [this.alergias, this.enfermedades, this.vacunas] = await Promise.all([
        this.healthService.getAlergias(id),
        this.healthService.getEnfermedades(id),
        this.healthService.getVacunas(id)
      ]);

      this.cdr.detectChanges();
    } catch (e: any) {
      console.error(e);
      this.error = e?.error?.message || e?.message || JSON.stringify(e) || 'Error al guardar salud';
    }
  }

  trackById(index: number, item: { id: number }) {
    return item.id;
  }

  onProfileButtonClick(): void {
    if (this.saving()) return;
    this.editProfile ? this.saveProfile() : this.editProfile = true;
  }

  onHealthButtonClick(): void {
    this.editHealth ? this.saveHealth() : this.editHealth = true;
  }

  onDescriptionButtonClick(): void {
    this.editDescription ? this.saveDescription() : this.editDescription = true;
  }

 processImageFromPrisma(imgData: any): SafeUrl | null {
    try {
      const keys = Object.keys(imgData)
        .filter(key => !isNaN(parseInt(key)))
        .map(key => parseInt(key))
        .sort((a, b) => a - b);
      
      const byteArray = keys.map(key => imgData[key]);
      
      let base64String = btoa(String.fromCharCode(...byteArray));
      
      const jpegStart = base64String.indexOf('/9j/');
      if (jpegStart > 0) {
        base64String = base64String.substring(jpegStart);
      }
      
      const imageUrl = `data:image/jpeg;base64,${base64String}`;
      
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      
    } catch (error) {
      console.error('Error procesando imagen:', error);
      return null;
    }
  }



  

}
