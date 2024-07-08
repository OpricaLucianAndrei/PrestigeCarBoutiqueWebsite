import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auto } from '../interfaces/auto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  apiUrl = 'https://probable-harrietta-luciancodes-b4e8ebe2.koyeb.app/api/prestigecarboutique'

  constructor(private http: HttpClient) { }


  getAuto() {
    const url = `${this.apiUrl}/allauto`;
    return this.http.get<Auto[]>(url);
  }

  getAutoById(id: number) {
    const url = `${this.apiUrl}/auto/${id}`;
    return this.http.get<Auto>(url);
  }



  getAutoByMarca(marca: string) {
    const url = `${this.apiUrl}/marca/${marca}`;
    return this.http.get<Auto[]>(url);
  }

  getAutoByMarcaEModello(marca: string, modello: string) {
    const url = `${this.apiUrl}/marcaemodello/${marca}/${modello}`;
    return this.http.get<Auto[]>(url);
  }

  getAutoByMarcaModelloEAnno(marca: string, modello: string, anno: number) {
    const url = `${this.apiUrl}/marcamodelloeanno/${marca}/${modello}/${anno}`;
    return this.http.get<Auto[]>(url);
  }

  addAuto(auto: Auto): Observable<any> {
    const url = `${this.apiUrl}/auto`
    return this.http.post(url, auto);
  }


  deleteAuto(id: number, token: string) {
    const url = `${this.apiUrl}/auto/${id}`;
    return this.http.delete<Auto>(url);
  }
}
