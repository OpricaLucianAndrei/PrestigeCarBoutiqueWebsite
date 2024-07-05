import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthData } from 'src/app/interfaces/auth-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user!: AuthData | null;

  constructor(private authSrv: AuthService, private router: Router) { }

  login(form:NgForm){
    try {
      this.authSrv.login(form.value).subscribe();
      this.router.navigate(['/'])
    } catch (error) {
      console.error(error)
      return
    }
  }
}
