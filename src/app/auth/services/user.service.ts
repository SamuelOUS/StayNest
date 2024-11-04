import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import {
  LogInResponse,
  SignUpResponse,
} from '../interfaces/login-response.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserLogInResponse, UserSignUpResponse } from '../interfaces/user-login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  currentUser = signal<User>({ name: '', username: '', isOwner: false });

  logIn(username: string, password: string): Observable<LogInResponse> {
    const body = {
      username,
      password,
    };

    return this.http
      .post<UserLogInResponse>('http://localhost:3000/api/users/login', body)
      .pipe(
        tap(data => {
          sessionStorage.setItem('token', data.token);
          this.setUser({
            name: data.name,
            photo: data.photo,
            username: data.username,
            email: data.email,
            isOwner: data.isOwner,
          });
        }),
        map(() => {
          return { success: true };
        }),
        catchError(eer => throwError(() => eer.error.message))
      );
  }

  logout() {
    localStorage.removeItem('userLogged');
    sessionStorage.removeItem('token');
    this.currentUser.set({ name: '', username: '', isOwner: false });
  }

  register(user: User): Observable<SignUpResponse> {
    return this.http
      .post<UserSignUpResponse>('http://localhost:3000/api/users', user)
      .pipe(
        tap(data => {
          sessionStorage.setItem('token', data.token);
          this.setUser({
            name: data.name,
            photo: data.photo,
            username: data.username,
            email: data.email,
            isOwner: data.isOwner,
          });
        }),
        map(() => {
          return { success: true };
        }),
        catchError((eer) => throwError(() => eer.error.message))
      );
  }

  private setUser(user: User): void {
    localStorage.setItem('userLogged', JSON.stringify(user));
    this.currentUser.set(user);
  }

  getUser(): WritableSignal<User> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userSrt = localStorage.getItem('userLogged');
      if (userSrt) {
        const user = JSON.parse(userSrt);
        this.currentUser.set(user);
      }
    }
    return this.currentUser;
  }

  editUser(updatedUser: User) {
    //Update current user with just the new user information
    const userSrt = localStorage.getItem(this.currentUser().username);
    if (userSrt) {
      const user = JSON.parse(userSrt);
      localStorage.removeItem(user.username);
      const newUser = { ...user, ...updatedUser };
      localStorage.setItem(newUser.username, JSON.stringify(newUser));
      this.currentUser.set(newUser);
      this.setUser(newUser);
      return;
    }
    throw new Error();
  }
}
