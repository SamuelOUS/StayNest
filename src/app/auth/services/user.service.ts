import { Injectable, signal } from '@angular/core';
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

  register(user: User): SignUpResponse{
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

  private setUser(user:User){
    localStorage.setItem('userLogged', JSON.stringify(user))
    this.currentUser.set(user)
  }

  getUser() {
    if (!this.currentUser().username){
      const userStr = localStorage.getItem('userLogged')
      if (userStr){
        const userLogged = JSON.parse(userStr)
        this.currentUser.set(userLogged)
      }
    } 
    return this.currentUser() 
  }
}
