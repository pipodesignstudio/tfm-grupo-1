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
    // Por defecto seleccionás la primera
    if (data && data.length > 0) {
      this._familiaSeleccionada.set(data[0]);
    }
  }

  public seleccionarFamilia(id: number): void {
    const familia = this._familias()?.find(f => f.id === id) ?? null;
    this._familiaSeleccionada.set(familia);
  }
}
