import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailRequest } from '../interfaces/email-request';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://probable-harrietta-luciancodes-b4e8ebe2.koyeb.app/api/prestigecarboutique/send-email';

  constructor(private http: HttpClient) { }

  sendEmail(emailRequest: EmailRequest, userEmail: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('senderEmail', userEmail);
    const body = JSON.stringify(emailRequest);

   // console.log('Corpo della richiesta inviato al server:', body); // Log del corpo della richiesta

    return this.http.post<any>(this.apiUrl, body, { headers, params });
  }
}
