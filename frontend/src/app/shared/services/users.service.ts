import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { TokenService } from '../../features/auth/services';
import { IUserFromBackend } from '../interfaces/iuser-from-backend.interface';
import { IUsersFamilies } from '../interfaces/iusers-families.interface';

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

  private readonly _user = signal<IUserFromBackend | null>(null);
  public readonly user = computed(() => this._user());

  public async getUser(): Promise<{
    user?: IUserFromBackend;
    message?: string;
  } | null> {
    if (this._user()) {
      return { user: this._user()! };
    }

    try {
      const response = await axios.get<UserApiResponse>(
        `${this.apiUrl}/profile`,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      );

      if (!response.data.success) {
        return { message: response.data.message };
      }

      this._user.set(response.data.data.user);
      return { user: response.data.data.user };
    } catch (error) {
      console.error('Error fetching user', error);
      return null;
    }
  }

  public clearUser(): void {
    this._user.set(null);
  }

  public async completeOnboarding(): Promise<{
    success: boolean;
    message?: string;
  } | null> {
    try {
      const response = await axios.patch<UserApiResponse>(
        `${this.apiUrl}/complete-onboarding`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      );

      if (!response.data.success)
        return { success: false, message: response.data.message };

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

  public async verifyEmail(
    email: string
  ): Promise<{ success: boolean; message?: string } | null> {
    try {
      const response = await axios.patch<UserApiResponse>(
        `${this.apiUrl}/verify-email/${email}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      );

      if (!response.data.success)
        return { success: false, message: response.data.message };

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

  public async checkIfEmailNeedsToBeVerified(
    email: string
  ): Promise<{
    status?: 'NEEDS_VERIFICATION' | 'VERIFIED';
    message?: string;
  } | null> {
    try {
      const response = await axios.get<EmailApiResponse>(
        `${this.apiUrl}/verify-email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      );

      if (!response.data.success) return { message: response.data.message };

      return {
        status: response.data.data.status,
        message: response.data.message,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async getUserFromServer(): Promise<IUserFromBackend | null> {
    try {
      const response = await axios.get<UserApiResponse>(
        `${this.apiUrl}/profile`,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      );

      if (!response.data.success) return null;
      return response.data.data.user;
    } catch (error) {
      return null;
    }
  }

public async getUserFamilias(): Promise<IUsersFamilies[] | null> {
  try {
    const response = await axios.get<FamiliaApiResponse>(`${environment.backendUrl}/api/users/familias`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    });

    console.log(response)

    return response.data.data.familias; // ✅ Esto es IUsersFamilies[]
  } catch (error) {
    console.error('Error al obtener las familias del usuario:', error);
    return null;
  }
}




}
