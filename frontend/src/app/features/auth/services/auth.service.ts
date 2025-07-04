import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { RegisterDto } from '../interfaces/dto';
import { IAuthData, IAuthResponse } from '../interfaces/api-responses/auth-correct-response';
import { TokenService } from './token.service';
import { UsersService } from '../../../shared/services';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
    
    private readonly baseUrl = environment.backendUrl;
    private readonly apiUrl = `${this.baseUrl}/api/auth`
    private readonly tokenService = inject(TokenService);
    private userService = inject(UsersService);
    private router = inject(Router);

    public async register(dto: RegisterDto): Promise<{ data?: IAuthData; message?: string } | null> {
        try {
          const response = await axios.post<IAuthResponse>(`${this.apiUrl}/register`, dto);
          const { success, data, message } = response.data;
      
          if (!success) return { message };
      
          this.tokenService.setSession({ token: data.token.token, expiresIn: data.token.expires_in });
          return { data, message };
        } catch (error: any) {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            return { message: error.response.data.message };
          }
      
          return { message: 'Error inesperado al registrar.' };
        }
      }
      

    public async login(email: string, password: string): Promise<{token?:string, expiresIn?:number, message?: string} | null> {
        try {
            const response = await axios.post<IAuthResponse>(`${this.apiUrl}/login`, { email, password });
            const { success, data, message } = response.data;
            if (!success) return {message};
            return {token:data.token.token, expiresIn:data.token.expires_in};
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                return { message: error.response.data.message };
              }
              console.error('Error logging in', error);
              return { message: 'Error inesperado al iniciar sesión.' };
        }
    }


    public async logOut() {
        this.tokenService.clear();
        this.userService.clearUser();
        this.router.navigate(['auth/login']);
    }
    
}