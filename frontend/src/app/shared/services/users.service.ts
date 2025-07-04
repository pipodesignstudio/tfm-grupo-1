import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import axios, { AxiosError } from 'axios';
import { TokenService } from '../../features/auth/services';
import { IUserFromBackend } from '../interfaces/iuser-from-backend.interface';
import { Router } from '@angular/router';
import { IUsersFamilies } from '../interfaces/iusers-families.interface';
import { IUser } from '../interfaces';

interface UserApiResponse {
  success: boolean;
  data: { user: IUserFromBackend };
  message: string;
}

export interface FamiliaApiResponse {
  success: boolean;
  message: string;
  data: {
    familias: IUsersFamilies[];
  };
  statusCode: number;
}

interface EmailApiResponse {
  success: boolean;
  data: { status: 'NEEDS_VERIFICATION' | 'VERIFIED' };
  message: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly apiUrl = `${environment.backendUrl}/api/users`;
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  private readonly _user = signal<IUserFromBackend | null>(null);
  public readonly user = computed(() => this._user());

  public async getUser(): Promise<{ user?: IUserFromBackend, message?: string } | null> {
    if (this._user()) {
      return { user: this._user()! };
    }

    try {
      const response = await axios.get<UserApiResponse>(`${this.apiUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });

      if (!response.data.success) {
        return { message: response.data.message };
      }

      this._user.set(response.data.data.user);
      return { user: response.data.data.user };
    } catch (err: unknown) {

      if (axios.isAxiosError<UserApiResponse>(err)) {
        const axiosErr = err as AxiosError<UserApiResponse>;
        const status = axiosErr.response?.status;

        if (status === 401 || status === 403) {
          this.tokenService.clear();
          this._user.set(null);
          await this.router.navigate(['/auth/login']);
          return { message: 'Sesión expirada, inicia sesión de nuevo.' };
        }

        const backendMsg = axiosErr.response?.data?.message;
        return { message: backendMsg ?? `Error ${status ?? ''} al obtener usuario` };
      }

      console.error('Network / CORS error', err);
      return { message: 'Servidor no disponible. Inténtalo más tarde.' };
    }
  }

  public clearUser(): void {
    this._user.set(null);
  }

  public async completeOnboarding(): Promise<{ success: boolean, message?: string } | null> {
    try {
      const response = await axios.patch<UserApiResponse>(`${this.apiUrl}/complete-onboarding`, null, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });

      if (!response.data.success) return { success: false, message: response.data.message };

      const refreshedUser = await this.getUserFromServer();
      if (refreshedUser) {
        this._user.set(refreshedUser);
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async verifyEmail(email: string): Promise<{ success: boolean, message?: string } | null> {
    try {
      const response = await axios.patch<UserApiResponse>(`${this.apiUrl}/verify-email/${email}`, null, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });

      if (!response.data.success) return { success: false, message: response.data.message };

      const refreshedUser = await this.getUserFromServer();
      if (refreshedUser) {
        this._user.set(refreshedUser);
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async checkIfEmailNeedsToBeVerified(email: string): Promise<{ status?: 'NEEDS_VERIFICATION' | 'VERIFIED', message?: string } | null> {
    try {
      const response = await axios.get<EmailApiResponse>(`${this.apiUrl}/verify-email/${email}`, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });

      if (!response.data.success) return { message: response.data.message };

      return { status: response.data.data.status, message: response.data.message };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async getUserFromServer(): Promise<IUserFromBackend | null> {
    try {
      const response = await axios.get<UserApiResponse>(`${this.apiUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });

      if (!response.data.success) return null;
      return response.data.data.user;
    } catch (error) {
      return null;
    }
  }


/**
 * Retrieves the list of user families from the backend API.
 *
 * Sends a GET request to the `/api/users/familias` endpoint, including the user's authentication token
 * in the request headers. If the request is successful, returns an array of `IUsersFamilies` objects.
 * If an error occurs during the request, logs the error and returns `null`.
 *
 * @returns {Promise<IUsersFamilies[] | null>} A promise that resolves to an array of user families or `null` if an error occurs.
 */
public async getUserFamilias(): Promise<IUsersFamilies[] | null> {
  try {
    const response = await axios.get<FamiliaApiResponse>(`${environment.backendUrl}/api/users/familias`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    });

    return response.data.data.familias;
  } catch (error) {
    console.error('Error al obtener las familias del usuario:', error);
    return null;
  }
}

/**
 * Updates the user information by sending a PATCH request to the backend API.
 * 
 * @param userData - A partial object containing the user fields to update.
 * @returns A promise that resolves to an object indicating the success status and a message.
 * 
 * If the update is successful, the local user state is updated with the new user data.
 * If the update fails, the local user state is cleared and refreshed.
 * Handles and logs any errors that occur during the request.
 */
public async editUser(userData: Partial<IUser>) {
  try {
    const response = await axios.patch<UserApiResponse>(`${this.apiUrl}/update`, userData, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    });

    if (!response.data.success) {
      
      // Optionally update the local user state even on failure, if needed:
      this._user.set(null);
      this.getUser(); // Refresh user data
      return { success: false, message: response.data.message };
    }

    this._user.set(response.data.data.user);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Error al editar el usuario:', error);
    return { success: false, message: 'Error al editar el usuario' };
  }
}

}
