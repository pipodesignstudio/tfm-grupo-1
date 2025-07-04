import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FamiliesStore } from '../../../../../shared/services/familiesStore.service';
import { InvitationsService } from '../../../../../shared/services/invitations.service';
import { ButtonModule } from 'primeng/button';
import { IUsersFamilies } from '../../../../../shared/interfaces/iusers-families.interface';
import {
  IInvitacion,
  IInvitacionesResponse,
  IInvitation,
} from '../../../../../shared/interfaces/iinvitation.interface';

import { MessageModalComponent } from '../../../../../components/message-modal/message-modal.component';

import { FamilyFormComponent } from '../../../../../components/family/family-form/family-form.component';
import { FamiliaUsuariosService } from '../../../../../shared/services/familia-usuarios.service';

@Component({
  selector: 'app-settings-family',
  templateUrl: './settings-family.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MessageModalComponent,
    FamilyFormComponent,
  ],
})
export class SettingsFamilyComponent {
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);
  private familiesStore = inject(FamiliesStore);
  private invitationsService = inject(InvitationsService);
  private familiaUsuariosService = inject(FamiliaUsuariosService);

  showInvitacionModal = false;

  familiaActual: IUsersFamilies | null = null;
  familiasUsuario: IUsersFamilies[] | null = [];

  invitacionesRecibidas: IInvitacion[] | null = [];
  invitacionesEnviadas: IInvitacion[] | null = [];

  private familiaEffect = effect(() => {
    this.familiaActual = this.familiesStore.familiaSeleccionada();
    this.familiasUsuario = this.familiesStore.familias();
    console.log('familiasUsuario', this.familiasUsuario);

    this.loadInvitacionesAsync();

    this.changeDetector.detectChanges();
  });

  private async loadInvitacionesAsync() {
    try {
      const recibidasResponse: IInvitacionesResponse =
        await this.invitationsService.getReceivedInvitations();
      const enviadasResponse: IInvitacionesResponse =
        await this.invitationsService.getSentInvitations();

      this.invitacionesRecibidas = recibidasResponse.invitations ?? [];
      this.invitacionesEnviadas = enviadasResponse.invitations ?? [];

      console.log('Invitaciones enviadas:', this.invitacionesEnviadas);
      console.log('Invitaciones recibidas:', this.invitacionesRecibidas);
      this.changeDetector.detectChanges();
    } catch (error) {
      console.error('Error al cargar invitaciones:', error);
    }
  }

  openInvitacionModal() {
    this.showInvitacionModal = true;
  }

  closeInvitacionModal() {
    this.showInvitacionModal = false;
  }

  aceptarInvitacion(id: number) {
    console.log('Aceptar invitación', id);
    // Lógica real aquí
    this.invitationsService.respondInvitation(id, true).then(() => {
      this.loadInvitacionesAsync();
    });
  }

  rechazarInvitacion(id: number) {
    console.log('Rechazar invitación', id);
    // Lógica real aquí
    this.invitationsService.respondInvitation(id, false).then(() => {
      this.loadInvitacionesAsync();
    });
  }

  cambiarAFamilia(familiaId: number) {
    console.log('Cambiar a familia', familiaId);
    this.familiesStore.seleccionarFamilia(familiaId);
    this.familiaActual = this.familiesStore.familiaSeleccionada();
    this.changeDetector.detectChanges();
  }

  salirDeFamilia(familiaId: number) {
    console.log('Salir de familia', familiaId, this.familiaActual);

    this.familiaUsuariosService.salirDeFamilia(familiaId).then(() => {
      // Lógica adicional después de eliminar la familia
      this.familiesStore.eliminarFamilia(familiaId);

      if (this.familiaActual?.id === familiaId) {
        console.log('Familia actual eliminada, seleccionando null');
        this.familiesStore.seleccionarFamilia(null); // Selecciona null para no tener familia seleccionada
        this.familiaActual = this.familiesStore.familiaSeleccionada();
      }
      this.familiasUsuario = this.familiesStore.familias();


      console.log(this.familiaActual, this.familiasUsuario);

      this.messageModalVisible = false;
      this.familiaASalir = null; // Resetea la familia a salir
      this.familiaASalirDescripcion = null; // Resetea la descripción de la familia a salir

      this.changeDetector.detectChanges();
    });
  }

  messageModalVisible = false;
  familiaASalir: number | null = null;
  familiaASalirDescripcion: string | null = null;

  showMessageModal(familia: IUsersFamilies | null) {
    this.familiaASalir = familia?.id || null;
    this.familiaASalirDescripcion = familia?.descripcion || null;
    this.messageModalVisible = true;
  }

  closeMessageModal() {
    this.messageModalVisible = false;
    this.familiaASalir = null;
    this.changeDetector.detectChanges();
  }

  enviarInvitacion(familiar: Partial<IInvitation>) {
    console.log('Enviando invitación a familiar:', familiar);
    // Solo permitir roles válidos: 'admin' o 'cuidador'
    const allowedRoles: Array<'admin' | 'cuidador'> = ['admin', 'cuidador'];
    const rol: 'admin' | 'cuidador' = allowedRoles.includes(familiar.rol as any)
      ? (familiar.rol as 'admin' | 'cuidador')
      : 'cuidador';

    // Verificar que el emailDestinatario esté definido
    if (!familiar.emailDestinatario) {
      console.error(
        'El emailDestinatario es obligatorio para enviar la invitación'
      );
      return;
    }

    this.invitationsService
      .sendInvitationUser({
        id_familia: this.familiesStore.familiaSeleccionada()?.id || 0,
        emailDestinatario: familiar.emailDestinatario,
        rol, // Solo pasa roles permitidos
      })
      .then(() => {
        console.log('Invitación enviada correctamente');
        //actualizar la lista de invitaciones
        this.loadInvitacionesAsync();
        this.closeInvitacionModal();
        this.changeDetector.detectChanges();
      })
      .catch((error: any) => {
        console.error('Error al enviar invitación:', error);
      });
  }
}
