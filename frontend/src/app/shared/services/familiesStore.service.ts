import { computed, Injectable, signal } from '@angular/core';
import { IUsersFamilies } from '../interfaces/iusers-families.interface';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class FamiliesStore {
  private readonly _familias = signal<IUsersFamilies[] | null>(null);
  private readonly _familiaSeleccionada = signal<IUsersFamilies | null>(null);
  private readonly _currentKid = signal<number | null>(null);
  public readonly familias = computed(() => this._familias());
  public readonly familiaSeleccionada = computed(() => this._familiaSeleccionada());
  public readonly currentKid = computed(() => this._currentKid());
  private _currentFamilyId = signal<number | null>(null);
  public readonly currentFamilyId = computed(() => this._currentFamilyId());

  constructor(private usersService: UsersService) {}

  public async loadFamilias(): Promise<void> {
  const data = await this.usersService.getUserFamilias();
  this._familias.set(data);

  if (data && data.length > 0) {
    const savedId = Number(localStorage.getItem('familiaSeleccionadaId'));
    const familiaGuardada = data.find(f => f.id === savedId);

    if (familiaGuardada) {
      this._familiaSeleccionada.set(familiaGuardada);
    } else {
      this._familiaSeleccionada.set(data[0]);
      localStorage.setItem('familiaSeleccionadaId', String(data[0].id));
    }
  }
}
  public seleccionarFamilia(id: number | null): void {
    if(id === null){
      // Si el ID es null selecionamos la primera familia
      const primeraFamilia = this._familias()?.[0] ?? null;
      this._familiaSeleccionada.set(primeraFamilia);
      return;
    }
  const familia = this._familias()?.find(f => f.id === id) ?? null;
  this._familiaSeleccionada.set(familia);

  if (familia) {
    localStorage.setItem('familiaSeleccionadaId', String(familia.id));
  } else {
    localStorage.removeItem('familiaSeleccionadaId');
  }
}

public setFamilyFirstTime(id:number): void {
  localStorage.setItem('familiaSeleccionadaId', String(id));
  this._currentFamilyId.set(id);
}

public getFamilyFirstTime(): number | null {
  return Number(localStorage.getItem('familiaSeleccionadaId'));
}

public eliminarFamilia(id: number): void {
  const familiasActuales = this._familias();
  if (familiasActuales) {
    this._familias.set(familiasActuales.filter(f => f.id !== id));
  }

  if (this._familiaSeleccionada()?.id === id) {
    this._familiaSeleccionada.set(null);
    localStorage.removeItem('familiaSeleccionadaId');
  }

}

public seleccionarNiño(id: number | null): void {
  this._currentKid.set(id);
}

public eliminarNiño(id: number): void {
  this._currentKid.set(null);
}

}
