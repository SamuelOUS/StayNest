import { Injectable, signal, PLATFORM_ID, WritableSignal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { LogInResponse, SignUpResponse } from '../interfaces/login-response.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = signal<User>({username: '', password: ''});

  logIn(username:string, password:string): LogInResponse{
    const userStr = localStorage.getItem(username.toLowerCase())
    if (!userStr){
      return {
        success: false,
        message:'Usuario no registrado'
      }
    }
    const user:User = JSON.parse(userStr);
    if (user.password !== password){
      return {
        success: false,
        message:'Usuario o contraseña incorrecta'
      }
    }
    this.setUser(user)
    return {
      success: true
    }
  }

  logout(){
    localStorage.removeItem('loggedUser');
    this.currentUser.set({username:'', password:'', email:''});
  }

  register(user: User): SignUpResponse{
    //Añadir validaciones extras.
    
    if (localStorage.getItem(user.username.trim().toLowerCase())){
      return {
        success: false,
        message:'El usuario ya está registrado'
      }
    }
    const userStr = JSON.stringify(user)
    localStorage.setItem(user.username.trim().toLowerCase(), userStr)
    this.setUser(user)
    return {
      success: true
    }
  }

  private setUser(user:User):void {
    localStorage.setItem('userLogged', JSON.stringify(user))
    this.currentUser.set(user)
  }

  getUser(): WritableSignal<User> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userSrt = localStorage.getItem('loggedUser');
      if (userSrt) {
        const user = JSON.parse(userSrt);
        this.currentUser.set(user);
      }
    }
    return this.currentUser;
  }
}
