import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { AuthData } from '../interfaces/auth-data';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignUp } from '../interfaces/sign-up';
import { ModalService } from '../services/modal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 

  apiURL = "https://probable-harrietta-luciancodes-b4e8ebe2.koyeb.app/auth/"
  apiUrl= "https://probable-harrietta-luciancodes-b4e8ebe2.koyeb.app/api/prestigecarboutique/"
  jwtHelper = new JwtHelperService();
  private authSub = new BehaviorSubject<AuthData | null>(null)
  user$ = this.authSub.asObservable();
  timeout: any;

  constructor(private http: HttpClient, private router: Router, private modalService: ModalService) { }


  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}currentuser`);
  }
  signup(data: SignUp) {
    return this.http.post(`${this.apiURL}signup`, data, {responseType:'text'}).pipe(catchError(this.errors));
  }

  login(data: { email: string, password: string }) {
    console.log("prova service")
    return this.http.post<AuthData>(`${this.apiURL}login`, data).pipe(
      tap((data) => {
        this.modalService.showAlert('Login effettuato.');
        console.log('auth data: ', data)
      }),
      tap((data) => {
        this.authSub.next(data);
        localStorage.setItem('user', JSON.stringify(data));
        this.autologout(data)
      }), catchError(this.errors)
    )
  }
  private errors(err: any) {
    console.log(err.error)
    switch (err.error) {
      case 'Email already exists':
        return throwError('utente già presente');
        break;
      case 'Incorrect password':
        return throwError('password errata');
        break;
      case 'Cannot find user':
        return throwError('utente inesistente')
      default:
        return throwError('errore generico')
    }
  }

  logout() {
    this.authSub.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login'])
  }

  restore() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return
    } else {
      const user: AuthData = JSON.parse(userJson)
      this.authSub.next(user);
      this.autologout(user)
    }
  }

  autologout(user: AuthData) {
    const dateExpiration = this.jwtHelper.getTokenExpirationDate(user.token) as Date;
    const millisecondsExp = dateExpiration.getTime() - new Date().getTime();
    this.timeout = setTimeout(() => {
      this.logout();
    }, millisecondsExp);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}users`).pipe(
        catchError(this.errors)
    );
}

}
