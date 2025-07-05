// token.service.ts
import { Injectable, signal, computed } from '@angular/core';

type EpochMs = number;

export interface AuthSession {
  token: string;
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly EXP_KEY   = 'auth_exp_ms';

  private readonly _token = signal<string | null>(localStorage.getItem(TokenService.TOKEN_KEY));
  private readonly _expMs = signal<EpochMs | null>(this.readExpMs());

  private readExpMs(): EpochMs | null {
    const raw = localStorage.getItem(TokenService.EXP_KEY);
    const ms  = raw ? Number(raw) : NaN;
    return isFinite(ms) ? ms : null;
  }

  readonly token   = computed(() => this._token());
  readonly expMs   = computed(() => this._expMs());
  readonly expired = computed(() => {
    const exp = this._expMs();
    return exp !== null && Date.now() >= exp;
  });
  readonly isAuth  = computed(() => !!this._token() && !this.expired());

  setSession({ token, expiresIn }: AuthSession): void {
    const exp = Date.now() + expiresIn * 1000;
    localStorage.setItem(TokenService.TOKEN_KEY, token);
    localStorage.setItem(TokenService.EXP_KEY, exp.toString());
    this._token.set(token);
    this._expMs.set(exp);
  }

  clear(): void {
    localStorage.removeItem(TokenService.TOKEN_KEY);
    localStorage.removeItem(TokenService.EXP_KEY);
    this._token.set(null);

    this._expMs.set(null);
  }
}