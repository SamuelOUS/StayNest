import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from '../../../auth/components/register/register.component';
import { LogInComponent } from '../../../auth/components/log-in/log-in.component';
import { UserService } from '../../../auth/services/user.service';
import Swal from 'sweetalert2';
import { ModalService } from '../../../services/modal.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  //Inyección de servicios
  private readonly userService = inject(UserService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  user;
  constructor(){
    this.user = this.userService.getUser()
  }

  logout(){
    this.userService.logout();
    this.user = this.userService.getUser();
    this.router.navigateByUrl('');
    Swal.fire({
      text: 'Sesión cerrada',
      icon: 'success',
    })
  }
  
  //Funciones para abrir los modales
  openRegister = (): void => {
    this.modalService.openModal<RegisterComponent, null>(RegisterComponent);
  }

  public openLogIn = ():void => {
    this.modalService.openModal<LogInComponent, null>(LogInComponent);
  }
}
