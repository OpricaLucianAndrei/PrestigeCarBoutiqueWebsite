import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { Auto } from 'src/app/interfaces/auto';
import { PrenotazioneDto } from 'src/app/interfaces/prenotazione-dto';
import { Prenotazione } from 'src/app/interfaces/prenotazione';
import { AutoService } from 'src/app/services/auto.service';
import { PrenotazioneService } from 'src/app/services/prenotazione.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.scss']
})
export class PrenotazioniComponent implements OnInit {
  user: AuthData | null = null;
  autos: Auto[] = [];
  prenotazioni: Prenotazione[] = [];
  loading = true;
  prenotazioneDto: PrenotazioneDto = {
    userId: 0,
    autoId: 0,
    dataPrenotazione: '',
    oraPrenotazione: ''
  };
  dataPrenotazione: string = '';
  oraPrenotazione: string = '';
  selectedAutoId: string = "";

  userNome!: string;
  userCognome!: string;

  constructor(
    private authSrv: AuthService,
    private autoSrv: AutoService,
    private prenotazioneService: PrenotazioneService,
    private modalSrv: ModalService
  ) {}

  ngOnInit(): void {
    this.authSrv.getCurrentUser().subscribe(
      (user: any) => {
        this.user = user;
        this.prenotazioneDto.userId = user.id;
        this.userNome = user.nome;
        this.userCognome = user.cognome;
        console.log('User details:', this.user);
      },
      error => {
        console.error('Failed to fetch current user:', error);
      }
    );

    this.fetchAutos();
    this.fetchPrenotazioni();
  }

  private fetchAutos(): void {
    this.autoSrv.getAuto().subscribe(
      (data) => {
        this.autos = data;
        this.loading = false;
        console.log('Auto loaded:', this.autos);
      },
      (error) => {
        console.error('Error fetching autos:', error);
        this.loading = false;
      }
    );
  }

  private fetchPrenotazioni(): void {
    this.prenotazioneService.getPrenotazioni().subscribe(
      (data) => {
        this.prenotazioni = data;
        console.log('Prenotazioni loaded:', this.prenotazioni);
      },
      (error) => {
        console.error('Error fetching prenotazioni:', error);
      }
    );
  }

  onSubmit(): void {
    // Verifica se tutti i campi necessari sono stati compilati
    if (!this.selectedAutoId || !this.dataPrenotazione || !this.oraPrenotazione) {
      console.error('Compila tutti i campi richiesti');
      return;
    }

    let dataPrenotazioneISO = new Date(this.dataPrenotazione).toISOString();
    this.prenotazioneDto.dataPrenotazione = dataPrenotazioneISO.slice(0, 10);
    this.prenotazioneDto.oraPrenotazione = this.oraPrenotazione;
    let numeroIdAuto = parseInt(this.selectedAutoId, 10);
    this.prenotazioneDto.autoId = numeroIdAuto;

    console.log('Submitting Prenotazione:', this.prenotazioneDto);

    // Verifica la disponibilità dell'auto
    if (this.checkDisponibilita(this.prenotazioneDto.autoId, this.prenotazioneDto.dataPrenotazione, this.prenotazioneDto.oraPrenotazione)) {
      this.prenotazioneService.createPrenotazione(this.prenotazioneDto).subscribe(
        (response) => {
          console.log('Prenotazione creata con successo:', response);
          this.modalSrv.showAlert('Prenotazione creata con successo')
          this.resetForm();
        },
        (error) => {
          console.error('Errore durante la creazione della prenotazione:', error);
          this.modalSrv.showAlert('Prenotazione creata con successo')
          if (error.status === 404) {
            this.modalSrv.showAlert('L\'auto non è disponibile per la data e ora specificate')
          } else {
            
          }
        }
      );
    } else {
      console.error('L\'auto non è disponibile per la data e ora specificate');
      this.modalSrv.showAlert('L\'auto non è disponibile per la data e ora specificate')
    }
  }

  private checkDisponibilita(autoId: number, data: string, ora: string): boolean {
    return !this.prenotazioni.some(prenotazione => {
      const dataPrenotazioneEsistente = prenotazione.dataPrenotazione;
      const oraPrenotazioneEsistente = prenotazione.oraPrenotazione;
      return prenotazione.auto.id === autoId &&
             dataPrenotazioneEsistente === data &&
             oraPrenotazioneEsistente === ora;
    });
  }

  private resetForm(): void {
    this.selectedAutoId = "";
    this.dataPrenotazione = '';
    this.oraPrenotazione = '';
  }
}
