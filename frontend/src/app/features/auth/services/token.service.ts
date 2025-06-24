// token.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly STORAGE_KEY = 'auth_token';
  private readonly _token = signal<string | null>(this.getTokenFromStorage());

  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  public readonly token = computed(() => this._token());

  public setToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
    this._token.set(token);
  }

  public clearToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._token.set(null);
  }

  public isAuthenticated(): boolean {
    return !!this._token();
  }
}
