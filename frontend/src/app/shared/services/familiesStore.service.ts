import { computed, Injectable, signal } from '@angular/core';
import { IUsersFamilies } from '../interfaces/iusers-families.interface';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class FamiliesStore {
  private readonly _familias = signal<IUsersFamilies[] | null>(null);
  private readonly _familiaSeleccionada = signal<IUsersFamilies | null>(null);
  public readonly familias = computed(() => this._familias());
  public readonly familiaSeleccionada = computed(() => this._familiaSeleccionada());

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
  public seleccionarFamilia(id: number): void {
  const familia = this._familias()?.find(f => f.id === id) ?? null;
  this._familiaSeleccionada.set(familia);

  if (familia) {
    localStorage.setItem('familiaSeleccionadaId', String(familia.id));
  } else {
    localStorage.removeItem('familiaSeleccionadaId');
  }
}

}
