import { IInvitation } from './../../../../../shared/interfaces/iinvitation.interface';
import { UsersService } from '../../../../../shared/services/users.service';
import { NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ChildFormComponent } from '../../../../../components/child/child-form/child-form.component';
import { FamilyFormComponent } from '../../../../../components/family/family-form/family-form.component';
import { FamiliesStore } from '../../../../../shared/services/familiesStore.service';
import { ChildService } from './../../../../../shared/services/child.service';
import { FamilyService } from './../../../../../shared/services/family.service';
import { IChild, IUser } from '../../../../../shared/interfaces';
import { IFamiliaUsuario } from '../../../../../shared/interfaces/ifamily-users.interface';
import { IActivity } from '../../../../../shared/interfaces/iactivity.interface';
import { FamiliaUsuariosService } from '../../../../../shared/services/familia-usuarios.service';
import { MessageModalComponent } from '../../../../../components/message-modal/message-modal.component';
import { UserFormComponent } from '../../../../../components/user-form/user-form.component';
import { InvitationsService } from '../../../../../shared/services/invitations.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  imports: [
    AvatarModule,
    NgClass,
    ChildFormComponent,
    FamilyFormComponent,
    MessageModalComponent,
    UserFormComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  childModalVisible = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  familiesStore = inject(FamiliesStore);

  calendarVisible = signal(true);

  familiaUsuariosService = inject(FamiliaUsuariosService);

  invitationsService = inject(InvitationsService);

  userService = inject(UsersService);
  user = this.userService.user();
  userImage: SafeUrl | null = null;

  rolFamilia: 'admin' | 'cuidador' | null = null;
  descripcionFamilia: string | null = null;

  childService = inject(ChildService);
  children: IChild[] = [];

  familyService = inject(FamilyService);
  usersFamily: IFamiliaUsuario[] = [];

  allEvents: IActivity[] = [];

  filtroOpciones: { label: string; value: number | null }[] = [];

  mostrarActivityModal = false;
  actividadInfo: IActivity | null = null;

  clickedDate: string = new Date().toISOString().slice(0, 10);

  private familiaEffect = effect(async () => {
    const familia = this.familiesStore.familiaSeleccionada();
    if (familia == null || this.user == null) return;

    try {
      console.log('familia seleccionada:', this.user);
      // Cargar los niños de la familia seleccionada
      this.children = await this.childService.getChildrenByFamily(
        String(familia.id)
      );

      this.selectChild(this.children[0]);

      this.usersFamily = await this.familyService.getAllUsersFamily(
        String(familia.id)
      );

      const usuarioLogeado = this.usersFamily.find(
        (miembro) => miembro.usuarios.email === this.user?.email
      );

      this.rolFamilia = usuarioLogeado?.rol || null;
      this.descripcionFamilia = familia.descripcion || null;

      if (usuarioLogeado) {
        this.usersFamily = this.usersFamily.filter(
          (miembro) => miembro.usuarios.email !== this.user?.email
        );
        this.usersFamily.push(usuarioLogeado);
      }

      this.filtroOpciones = this.children.map((child) => ({
        label: child.nombre,
        value: Number(child.id),
      }));
      this.changeDetector.detectChanges();

      // Cargar los eventos de la familia seleccionada
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  });

  formatImgPerfil(img: string | Uint8Array | null | undefined): SafeUrl | null {
    console.log("firstaaaaaaaa", img);
    if (!img) return null;

    const byteArray = Object.values(img) as number[];
    const uint8Array = new Uint8Array(byteArray);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    const imageUrl = `data:image/jpeg;base64,${base64String}`;
    console.log("secondaaaaaaaa", imageUrl);
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }


  processImageFromPrisma(imgData: any) {
    try {
      const keys = Object.keys(imgData)
        .filter(key => !isNaN(parseInt(key)))
        .map(key => parseInt(key))
        .sort((a, b) => a - b);
      
      const byteArray = keys.map(key => imgData[key]);
      
      let base64String = btoa(String.fromCharCode(...byteArray));
      
      const jpegStart = base64String.indexOf('/9j/');
      if (jpegStart > 0) {
        base64String = base64String.substring(jpegStart);
      }
      
      const imageUrl = `data:image/jpeg;base64,${base64String}`;

      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);

    } catch (error) {
      console.error('Error procesando imagen:', error);
      return null;
    }
  }


  formatearFecha(fecha: string): string {
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(
      new Date(fecha)
    );
    return fechaFormateada;
  }

  getEdad(fechaNacimiento: string): string {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();

    let anios = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();

    if (meses < 0) {
      anios--;
      meses += 12;
    }

    return `${anios} años y ${meses} meses`;
  }

  goToNino(childId: number) {
    this.router.navigate(['dashboard', 'child-profile', childId]);
  }

  showChildModal() {
    this.childModalVisible = true;
  }

  hideChildModal() {
    this.childModalVisible = false;
    this.changeDetector.detectChanges();
  }

  familyModalVisible = false;

  showFamilyModal() {
    this.familyModalVisible = true;
  }

  hideFamilyModal() {
    this.familyModalVisible = false;
  }

  getBgColor(member: any) {
    switch (member.color) {
      case 'orange':
        return 'bg-[#ff7f50] ';
      case 'green':
        return 'bg-green-100';
      case 'blue':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  }

  selectedChild = this.children[0]; // selecciona por defecto el primero

  selectChild(child: any) {
    this.selectedChild = child;
  }

  addChild(child: Partial<IChild>) {
    console.log('Añadiendo niño:', child);

    this.childService
      .addChild({
        ...child,
        perfiles_aprendizaje_id: 1, // Asignar un perfil de aprendizaje por defecto
        familia_id: this.familiesStore.familiaSeleccionada()?.id || 0,
      })
      .then(() => {
        console.log('Niño añadido correctamente');
        console.log(child);
        // Actualizar la lista de niños
        this.children.push({
          ...child,
          id: this.children.length + 1, // Asignar un ID temporal
          fecha_nacimiento: child.fecha_nacimiento || new Date().toISOString(),
        } as IChild);
        this.hideChildModal();
        this.changeDetector.detectChanges();
      })
      .catch((error) => {
        console.error('Error al añadir niño:', error);
      });
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
      })
      .catch((error: any) => {
        console.error('Error al enviar invitación:', error);
      });
  }

  modalEliminarVisible = false;
  familiarAEliminarEditar: IFamiliaUsuario | null = null;

  showEditFamilyModal(familiar: IFamiliaUsuario) {
    console.log('Editando familiar:', familiar);
    this.familiarAEliminarEditar = familiar;
    this.familyModalVisible = true;
  }

  hideEditFamilyModal() {
    this.familyModalVisible = false;
    this.familiarAEliminarEditar = null;
  }

  editarFamiliar(editForm: IFamiliaUsuario) {
    console.log('Editando familiar:', editForm);

    this.familiaUsuariosService
      .editarUsuarioFamilia(
        this.familiesStore.familiaSeleccionada()?.id || 0,
        this.familiarAEliminarEditar?.usuarios_id || 0,
        editForm.rol || 'cuidador'
      )
      .then(() => {
        console.log('Familiar editado correctamente');
        // Actualizar el usuario editado en la lista de familiares
        const index = this.usersFamily.findIndex(
          (member) =>
            member.usuarios_id === this.familiarAEliminarEditar?.usuarios_id
        );
        if (index !== -1) {
          this.usersFamily[index] = { ...this.usersFamily[index], ...editForm };
        }

        this.hideEditFamilyModal();

        this.changeDetector.detectChanges();
      })
      .catch((error) => {
        console.error('Error al editar familiar:', error);
      });
  }

  showModalEliminarFamiliar(familiar: IFamiliaUsuario) {
    this.familiarAEliminarEditar = familiar;
    this.modalEliminarVisible = true;
  }

  hideModalEliminarFamiliar() {
    this.modalEliminarVisible = false;
    this.familiarAEliminarEditar = null;
    this.changeDetector.detectChanges();
  }

  eliminarFamiliar(familiar: IFamiliaUsuario | null) {
    if (!familiar) {
      console.error('No se ha seleccionado un familiar para eliminar');
      return;
    }
    console.log('Eliminando familiar con ID:', familiar);

    this.familiaUsuariosService
      .eliminarUsuarioFamilia(
        this.familiesStore.familiaSeleccionada()?.id || 0,
        familiar.usuarios_id
      )
      .then(() => {
        console.log('Familiar eliminado correctamente');
        this.familiarAEliminarEditar = null;
        this.modalEliminarVisible = false;
        // Actualizar la lista de familiares
        this.usersFamily = this.usersFamily.filter(
          (member) => member.usuarios_id !== familiar.usuarios_id
        );
        this.changeDetector.detectChanges();
      })
      .catch((error) => {
        console.error('Error al eliminar familiar:', error);
      });
  }

  showUserFormModal = false;

  openUserFormModal() {
    this.showUserFormModal = true;
  }

  closeUserFormModal() {
    this.showUserFormModal = false;
  }

  editarUsuario(userData: Partial<IUser>) {
    console.log('Usuario editado:', userData);
    this.userService.editUser(userData).then((result) => {
      if (result?.success) {
        console.log('Usuario editado con éxito', result);
        console.log(this.user); // Actualizar la información del usuario
        const img_usuario_editado = userData.img_perfil;
        if (this.user) {
          this.user = {
            ...this.user,
            nick: userData.nick ?? this.user.nick,
            nombre: userData.nombre ?? this.user.nombre,
            apellido: userData.apellido ?? this.user.apellido,
            img_perfil:
              typeof img_usuario_editado === 'string'
                ? this.base64ToUint8Array(img_usuario_editado)
                : img_usuario_editado ?? this.user.img_perfil,
          };
        }
        //Actualizar el usuario editado en la lista de familiares
        const copyUserFamily = this.usersFamily.find(
          (member) => member.usuarios.email === this.user?.email
        );

        this.usersFamily = this.usersFamily.filter(
          (member) => member.usuarios.email !== this.user?.email
        );

        this.usersFamily = [
          ...this.usersFamily,
          {
            familia_id: copyUserFamily?.familia_id || 0,
            usuarios_id: copyUserFamily?.usuarios_id || 0,
            rol: copyUserFamily?.rol || 'cuidador',
            usuarios: {
              id: copyUserFamily?.usuarios.id || 0,
              apellido: copyUserFamily?.usuarios?.apellido || null,
              nombre: copyUserFamily?.usuarios?.nombre || null,
              nick: copyUserFamily?.usuarios?.nick || '',
              img_perfil:
                typeof img_usuario_editado === 'string'
                  ? this.base64ToUint8Array(img_usuario_editado)
                  : img_usuario_editado ?? this.user?.img_perfil,
              email: copyUserFamily?.usuarios?.email || '',
              contrasena: copyUserFamily?.usuarios?.contrasena || '',
              primeraSesion: copyUserFamily?.usuarios?.primeraSesion || false,
              fechaCreacion:
                copyUserFamily?.usuarios?.fechaCreacion ||
                new Date().toISOString(),
              borrado: copyUserFamily?.usuarios?.borrado || false,
              emailVerificado:
                copyUserFamily?.usuarios?.emailVerificado || false,
              ...this.user, // Asegurarse de que se actualicen los datos del usuario
            },
          },
        ];

        this.closeUserFormModal(); // Cerrar el modal después de editar
        this.changeDetector.detectChanges();
      } else {
        console.error('Error al editar el usuario:', result?.message);
      }
    });
  }

  private base64ToUint8Array(data: string): Uint8Array {
    if (!data) return new Uint8Array();
    // Si viene como "data:image/jpeg;base64,....", quita el prefijo
    const base64 = data.includes(',') ? data.split(',')[1] : data;

    const binary = atob(base64); // decodifica Base‑64
    return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  }
}
