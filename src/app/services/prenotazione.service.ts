import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prenotazione } from '../interfaces/prenotazione';
import { Observable } from 'rxjs';
import { PrenotazioneDto } from '../interfaces/prenotazione-dto';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {
  apiUrl='http://localhost:8080/api/prestigecarboutique/prenotazioni'

  constructor(private http: HttpClient) { }

  getPrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(this.apiUrl);
  }

  // Ottieni una prenotazione per ID
  getPrenotazioneById(id: number): Observable<Prenotazione> {
    return this.http.get<Prenotazione>(`${this.apiUrl}/${id}`);
  }

  // Crea una nuova prenotazione
  createPrenotazione(prenotazioneDto: PrenotazioneDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, prenotazioneDto);
  }

  // Aggiorna una prenotazione esistente
  updatePrenotazione(id: number, prenotazioneDto: PrenotazioneDto): Observable<Prenotazione> {
    return this.http.put<Prenotazione>(`${this.apiUrl}/${id}`, prenotazioneDto);
  }

  // Elimina una prenotazione
  deletePrenotazione(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}
