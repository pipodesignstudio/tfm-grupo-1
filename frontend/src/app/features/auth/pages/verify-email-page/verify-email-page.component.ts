import { ChangeDetectionStrategy, Component, inject, Input, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, TokenService } from '../../services';
import { catchError, finalize, from, of, take } from 'rxjs';
import { UsersService } from '../../../../shared/services';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { LoginFormPopupComponent } from "../../components/login-form-popup/login-form-popup.component";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-verify-email-page',
  imports: [ProgressBarModule, ButtonModule, DialogModule, LoginFormPopupComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './verify-email-page.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent {
  @ViewChild('dialog') dialog!: Dialog;
  @Input() email?: string;

  public router = inject(Router);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private tokenService = inject(TokenService);
  private messageService = inject(MessageService);

  private token = this.tokenService.token();
  public needLogin = signal<boolean>(!this.token);
  public isLoading = signal<boolean>(true);
  public emailVerified = signal<boolean>(false);

  public isPosting = false;

  ngOnInit(): void {  
    if (!this.email || !this.isValidEmail(this.email)) {
      console.error('No se proporcionó un ID');
      this.router.navigate(['auth/login']);
    }
    this.checkEmailVerification();

  }

  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }

  handleNewToken(token: string) {
    this.tokenService.setToken(token);
    this.dialog.close;
    this.visible = false;
    this.needLogin.set(false);
    this.checkEmailVerification();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async verifyEmail() {
    this.isPosting = true;
    const response = await this.usersService.verifyEmail(this.email!);
    this.isPosting = false;
    if (response?.success) {
      this.messageService.add({ severity: 'success', summary: 'Gracias por verificar tu email', detail: 'Email verificado correctamente' });
      this.emailVerified.set(true);
    }
  }

  private checkEmailVerification() {
    from(this.usersService.checkIfEmailNeedsToBeVerified(this.email!)).pipe(
      take(1),
      finalize(() => this.isLoading.set(false)),
      catchError(err => {
        this.needLogin.set(true);
        return of(null);
      })
    ).subscribe(res => {
      if (res?.status === 'VERIFIED') {
        this.emailVerified.set(true);
      }else {
        this.emailVerified.set(false);
      }
    })
  }

}


