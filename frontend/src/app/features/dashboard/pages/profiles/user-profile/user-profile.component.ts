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
import { SelectModule } from 'primeng/select';
import { IActivity } from '../../../../../shared/interfaces/iactivity.interface';
import { IUserFromBackend } from '../../../../../shared/interfaces/iuser-from-backend.interface';

@Component({
  selector: 'app-user-profile',
  imports: [AvatarModule, NgClass, ChildFormComponent, FamilyFormComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  userAs = {
    name: 'Juan',
    surname: 'Pérez',
    nick: 'jperez',
    rol: 'Administrador',
    email: 'Juanan@gmail.com',
    createdAt: '2023-10-01',
    avatar:
      'https://www.primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
  };

  childrenArray = [
    {
      id: 1,
      name: 'Emilio',
      age: '2 años, 8 meses',
      fecha_nacimiento: '2021-01-15',
      altura: 90,
      peso: 12,
      genero: 'Masculino',
      image: 'https://picsum.photos/536/354',
      descripcion:
        'Emilio es un niño muy juguetón y alegre. Le encanta correr y jugar con sus juguetes. Es muy cariñoso con su familia y amigos.',
    },
    {
      id: 2,
      name: 'Lucía',
      age: '5 años, 1 mes',
      fecha_nacimiento: '2018-09-10',
      altura: 110,
      peso: 18,
      genero: 'Femenino',
      image: 'https://picsum.photos/536/354',
      descripcion:
        'Lucía es una niña muy curiosa y activa. Le encanta explorar y aprender cosas nuevas. Es muy sociable y le gusta jugar con otros niños.',
    },
  ];

  familyMembers = [
    { name: 'María', role: 'Administrador', color: 'pink' },
    { name: 'Carlos', role: 'Cuidador', color: 'green' },
    { name: 'Lucía', role: 'Cuidador', color: 'blue' },
  ];

  childModalVisible = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {}

  familiesStore = inject(FamiliesStore);

  calendarVisible = signal(true);

  userService = inject(UsersService);
  user = this.userService.user();
  rolFamilia: 'admin' | 'cuidador' | null = null;

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
    if (familia == null) return;

    try {
      console.log(this.user, 'usuario desde el efecto');
      
      // Cargar los niños de la familia seleccionada
      this.children = await this.childService.getChildrenByFamily(
        String(familia.id)
      );

      this.selectChild(this.children[0]);

      this.usersFamily = await this.familyService.getAllUsersFamily(
        String(familia.id)
      );

      this.rolFamilia =
        this.usersFamily.find((miembro) => miembro.usuarios.email === this.user?.email)
          ?.rol || null;


      console.log(this.children);

      console.log('usuarios de la familia:', this.usersFamily);

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

  goToEditarPerfil() {
    this.router.navigate(['/dashboard/perfil/editar']);
  }

  goToNino(childId: number) {
    this.router.navigate(['/dashboard/children', childId]);
  }

  showChildModal() {
    this.childModalVisible = true;
  }

  hideChildModal() {
    this.childModalVisible = false;
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


    this.childService.addChild({
      ...child,
      perfiles_aprendizaje_id: 1, // Asignar un perfil de aprendizaje por defecto
      familia_id: this.familiesStore.familiaSeleccionada()?.id || 0,
    }).then(() => {
      console.log('Niño añadido correctamente');
      console.log(child)
      this.changeDetector.detectChanges();
      this.hideChildModal();
    }).catch(error => {
      console.error('Error al añadir niño:', error);
    });

  }
}
