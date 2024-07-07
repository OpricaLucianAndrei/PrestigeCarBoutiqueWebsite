import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auto } from 'src/app/interfaces/auto';
import { AutoService } from 'src/app/services/auto.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent {
  autoForm!: FormGroup;

  constructor(private fb: FormBuilder, private autoService: AutoService, private modalSrv: ModalService) { }

  ngOnInit() {
    this.autoForm = this.fb.group({
      marca: ['', Validators.required],
      modello: ['', Validators.required],
      anno: ['', Validators.required],
      chilometraggio: ['', Validators.required],
      descrizione: ['', Validators.required],
      statoVeicolo: ['', Validators.required],
      specifiche: this.fb.group({
        performance: this.fb.group({
          topSpeed: [''],
          accelerazione0a100Kmh: [''],
          motore: this.fb.group({
            tipo: [''],
            cilindrata: [''],
            cavalli: [''],
            coppia: [''],
            trasmissione: [''],
            trazione: [''],
          }),
          consumoCarburante: this.fb.group({
            città: [''],
            autostrada: [''],
            combinato: ['']
          }),
          emissioni: ['']
        }),
        dimensioni: this.fb.group({
          lunghezza: [''],
          larghezza: [''],
          altezza: [''],
          passo: [''],
          pesoAVuoto: [''],
          capacitaSerbatoio: ['']
        }),
        interni: this.fb.group({
          posti: [''],
          tappezzeria: [''],
          caratteristiche: this.fb.array([])
        }),
        esterni: this.fb.group({
          opzioniColori: this.fb.array([]),
          caratteristiche: this.fb.array([])
        }),
        sicurezza: this.fb.group({
          assistenzaAllaGuida: this.fb.array([]),
          sicurezza: this.fb.array([]),
          airbags: this.fb.group({
            anteriore: [false],
            laterale: [false],
            tendina: [false],
            ginocchia: [false]
          })
        })
      }),
      prezzo: this.fb.group({
        prezzoBase: ['', Validators.required],
        tasse: ['', Validators.required],
        optional: ['', Validators.required],
        prezzoTotale: ['', Validators.required]
      }),
      optionalFeatures: this.fb.array([]),
      immagini: this.fb.array([])
    });


  }



  get immagini(): FormArray {
    return this.autoForm.get('immagini') as FormArray;
  }

  getUrls(i: number): FormArray {
    return this.immagini.at(i).get('url') as FormArray;
  }

  addImmagine(): void {
    const immagineGroup = this.fb.group({
      opzioneColore: [''],
      url: this.fb.array([this.fb.control('')])
    });
    this.immagini.push(immagineGroup);
  }

  aggiungiUrl(i: number): void {
    const urlArray = this.getUrls(i);
    urlArray.push(this.fb.control(''));
  }







  get optionalFeatures(): FormArray {
    return this.autoForm.get('optionalFeatures') as FormArray;
  }


  addOptionalFeature() {
    const optionalFeatureForm = this.fb.group({
      nome: [''],
      prezzo: ['']
    });

    this.optionalFeatures.push(optionalFeatureForm);
  }





  get opzioniColori(): FormArray {
    return this.autoForm.get('specifiche.esterni.opzioniColori') as FormArray;
  }

  aggiungiOpzioneColoreEsterni() {
    this.opzioniColori.push(this.fb.control(''));
  }

  rimuoviOpzioneColore(index: number) {
    this.opzioniColori.removeAt(index);
  }




  get caratteristicheEsterni(): FormArray {
    return this.autoForm.get('specifiche.esterni.caratteristiche') as FormArray;
  }

  aggiungiCaratteristicaEsterni(): void {
    this.caratteristicheEsterni.push(this.fb.control(''));
  }

  rimuoviCaratteristicaEsterni(index: number): void {
    this.caratteristicheEsterni.removeAt(index);
  }





  get caratteristicheInterni(): FormArray {
    return this.autoForm.get('specifiche.interni.caratteristiche') as FormArray;
  }

  aggiungiCaratteristicainterni(): void {
    this.caratteristicheInterni.push(this.fb.control(''));
  }

  rimuoviCaratteristicainterni(index: number): void {
    this.caratteristicheInterni.removeAt(index);
  }






  get assistenzaAllaGuida(): FormArray {
    return this.autoForm.get('specifiche.sicurezza.assistenzaAllaGuida') as FormArray;
  }

  get sicurezza(): FormArray {
    return this.autoForm.get('specifiche.sicurezza.sicurezza') as FormArray;
  }

  get airbags(): FormGroup {
    return this.autoForm.get('specifiche.sicurezza.airbags') as FormGroup;
  }

  // Metodi per gestire l'aggiunta e la rimozione di opzioni Assistenza alla Guida

  aggiungiAssistenzaAllaGuida(): void {
    this.assistenzaAllaGuida.push(this.fb.control(''));
    console.log(this.assistenzaAllaGuida.value);

  }

  rimuoviAssistenzaAllaGuida(index: number): void {
    this.assistenzaAllaGuida.removeAt(index);
  }

  // Metodi per gestire l'aggiunta e la rimozione di opzioni Sicurezza

  aggiungiSicurezza(): void {
    this.sicurezza.push(this.fb.control(''));
    console.log(this.sicurezza.value);

  }

  rimuoviSicurezza(index: number): void {
    this.sicurezza.removeAt(index);
  }






  submitForm() {
    if (this.autoForm.valid) {
      const auto: Auto = this.autoForm.value;
      console.log(auto);

      const token = this.getToken(); // Implementa questo metodo per ottenere il token
      console.log(token);

      this.autoService.addAuto(auto).subscribe(
        response => {
          console.log('Auto added successfully:', response);
        },
        error => {
          console.error('Error adding auto:', error);
        }
      );
    } else {
      console.log('Form is invalid', this.autoForm.value);
    }
  }
  getToken(): string {
    return JSON.parse(localStorage.getItem('user') || '').token;;
  }
}
