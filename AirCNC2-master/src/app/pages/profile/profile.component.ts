import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private auth: AuthService) { }
  currentUser: User | null = null;
  isUserActive: boolean = false; 

  ngOnInit() {
    this.loadUserProfile();
  }
  
  loadUserProfile() {
    this.currentUser = this.auth.getCurrentUser();
    this.isUserActive = this.currentUser !== null; // Establecer verdadero si hay un usuario activo
  }

  async openUpdateProfileModal() {
    const { value: formValues } = await Swal.fire({
      title: 'Actualizar Perfil',
      html: `
       <input id="email" class="swal2-input" placeholder="Email" value="${this.currentUser?.email || ''}">
        <input id="username" class="swal2-input" placeholder="Nombre de usuario" value="${this.currentUser?.username||''}">
        <input id="profilePicture" class="swal2-input" placeholder="URL de la foto de perfil" value="${this.currentUser?.profilePicture||''}">
        <textarea id="biography" class="swal2-textarea" placeholder="Biografía">${this.currentUser?.biography||''}</textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          username: (document.getElementById('username') as HTMLInputElement).value,
          profilePicture: (document.getElementById('profilePicture') as HTMLInputElement).value,
          biography: (document.getElementById('biography') as HTMLTextAreaElement).value,
          email:(document.getElementById('email') as HTMLTextAreaElement).value,
        };
      },
      showCancelButton: true,
    });
  
    if (formValues) {
      const oldUsername = this.currentUser?.username;
      // Crear un nuevo objeto de usuario
      const updatedUser: User = {
        ...this.currentUser!,
        username: formValues.username,
        profilePicture: formValues.profilePicture,
        biography: formValues.biography,
        email:formValues.email,
      };
      // Si el username ha cambiado
      if (formValues.username !== oldUsername) {
        // Eliminar el usuario antiguo de localStorage
        localStorage.removeItem(oldUsername!); // Eliminar con el antiguo username
      }
      // Guardar el usuario actualizado en localStorage
      localStorage.setItem(updatedUser.username, JSON.stringify(updatedUser));
  
      // Actualizar el usuario en el servicio
      this.auth.updateUser(this.currentUser,updatedUser);
  
      Swal.fire('¡Éxito!', 'Perfil actualizado con éxito.', 'success');
    }
  }
} 