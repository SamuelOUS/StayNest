import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import {
  LogInResponse,
  SignUpResponse,
} from '../interfaces/login-response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import {
  UserLogInResponse,
  UserSignUpResponse,
} from '../interfaces/user-login-response.interface';

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
        tap((data) => {
          sessionStorage.setItem('token', data.token);
          this.setUser({
            name: data.name,
            username: data.username,
            profilePicture: data.profilePicture,
            isOwner: data.isOwner,
            token: data.token,
          });
        }),
        map(() => {
          return { success: true };
        }),
        catchError((eer) => throwError(() => eer.error.message))
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
        tap((data) => {
          sessionStorage.setItem('token', data.token);
          this.setUser({
            name: data.name,
            username: data.username,
            profilePicture: data.profilePicture,
            isOwner: data.isOwner,
            token: data.token,
          });
        }),
        map(() => {
          return { success: true };
        }),
        catchError((eer) => throwError(() => eer.error.message))
      );
  }

  setUser(user: User): void {
    localStorage.setItem('userLogged', JSON.stringify(user));
    this.currentUser.set(user);
  }

  getUser(): WritableSignal<User> {
    if (this.currentUser().username) return this.currentUser;

    if (typeof window !== 'undefined' && window.localStorage) {
      const userSrt = localStorage.getItem('userLogged');
      if (userSrt) this.currentUser.set(JSON.parse(userSrt));
    }
    return this.currentUser;
  }

  editUser(updatedUser: User) {
    const newUser = { ...this.currentUser(), ...updatedUser };
    this.currentUser.set(newUser);
    this.setUser(newUser);

    const {token, ...updateUser} = newUser 

    return this.http.patch(
      `http://localhost:3000/api/users`, updateUser, this.getHeaders()
    );
  }

  private getHeaders(){
    const token = sessionStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
      })
    }
  }
}
