import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-child-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, InputTextModule, InputNumberModule],
  templateUrl: './child-profile.component.html',
  styleUrls: ['./child-profile.component.css']
})
export class ChildProfileComponent implements OnInit {
  today: Date = new Date();

  editProfile = false;
  editDescription = false;
  editHealth = false;

  child = {
    id: 1,
    perfilesAprendizajeId: 100,
    nombre: 'Max',
    apellido: 'Gómez',
    fechaNacimiento: '2022-10-17',
    descripcion: 'Le encanta jugar al aire libre y explorar cosas nuevas.',
    genero: 'Masculino',
    peso: 12.5,
    altura: 90,
    imgPerfil: 'https://picsum.photos/150'
  };

  edadCalculada = '';

  ngOnInit(): void {
    this.edadCalculada = this.calcularEdad(this.child.fechaNacimiento);
  }

  calcularEdad(fecha: string): string {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  }

  saveProfile(): void {
    this.edadCalculada = this.calcularEdad(this.child.fechaNacimiento);
    this.editProfile = false;
  }

  saveDescription(): void {
    this.editDescription = false;
  }

  saveHealth(): void {
    this.editHealth = false;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.child.imgPerfil = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
