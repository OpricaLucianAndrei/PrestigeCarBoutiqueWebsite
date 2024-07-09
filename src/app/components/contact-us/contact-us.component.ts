import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { EmailRequest } from 'src/app/interfaces/email-request';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  user!: AuthData | null;
  emailRequest: EmailRequest = {
    subject: '',
    message: ''
  };
  userEmail!: string;

  constructor(private emailService: EmailService, private authSrv: AuthService) { }

  ngOnInit(): void {
    this.authSrv.getCurrentUser().subscribe(
      (user: any) => {
        this.user = user;
        this.userEmail = user.email;
        console.log('User details:', this.user);
      },
      error => {
        console.error('Failed to fetch current user:', error);
      }
    );
  }

  onSubmit() {
    if (this.user) {
      this.emailRequest.subject = `${this.emailRequest.subject} - from: ${this.userEmail}`;
      
      // Log del contenuto della richiesta
      //console.log('Dati della richiesta email:', this.emailRequest);

      this.emailService.sendEmail(this.emailRequest, this.userEmail)
        .subscribe(response => {
          console.log('Email inviata con successo!', response);
        }, error => {
          console.error('Errore durante l\'invio dell\'email', error);
          if (error.error) {
            console.error('Dettagli dell\'errore:', error.error);
          }
        });
    } else {
      console.error('Impossibile ottenere l\'email dell\'utente o struttura dati non valida.');
    }
  }

}
