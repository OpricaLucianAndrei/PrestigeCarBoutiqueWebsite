import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { Auto } from 'src/app/interfaces/auto';
import { AutoService } from 'src/app/services/auto.service';

@Component({
  selector: 'app-valutazione-usato',
  templateUrl: './valutazione-usato.component.html',
  styleUrls: ['./valutazione-usato.component.scss']
})
export class ValutazioneUsatoComponent implements OnInit {
  user!: AuthData | null;

  selectedMarca: string | null = null;
  selectedModello: string | null = null;
  selectedAnno: string | null = null;
  selectedChilometraggioInterval: string | null = null;

  uniqueMarcas: string[] = [];
  uniqueModelli: string[] = [];
  uniqueAnni: string[] = [];


  autos: any[] = [];
  filteredAutos: any[] = [];
  priceStats: { min: number; max: number; avg: number } | null = null;

  constructor(private autoService: AutoService, private authSrv: AuthService) { }

  ngOnInit() {
    this.authSrv.user$.subscribe(user =>
      this.user = user);
    this.loadAutos();
  }

  loadAutos() {
    this.autoService.getAuto().subscribe(data => {
      this.autos = data;
      this.filteredAutos = data;
      this.uniqueMarcas = [...new Set(data.map(auto => auto.marca))];
    });
  }

  onMarcaChange() {
    this.uniqueModelli = [...new Set(this.autos.filter(auto => auto.marca === this.selectedMarca).map(auto => auto.modello))];
    this.selectedModello = null;
    this.selectedAnno = null;
    this.uniqueAnni = [];
    this.filterAutos();
  }

  onModelloChange() {
    console.log('Modello selezionato:', this.selectedModello);
    this.uniqueAnni = [...new Set(this.autos.filter(auto => auto.modello === this.selectedModello).map(auto => auto.anno))];
    console.log(this.uniqueAnni);
    this.selectedAnno = null;
    this.filterAutos();
  }

  
  onAnnoChange() {
    console.log('Anno selezionato:', this.selectedAnno); // Verifica l'anno selezionato
    this.filterAutos();
  }
 
  onChilometraggioIntervalChange() {
    console.log('Intervallo di chilometraggio selezionato:', this.selectedChilometraggioInterval);
    this.filterAutos();
  }


  onSubmit() {
    this.filterAutos();
  }

  filterAutos() {
   this.filteredAutos = this.autos.filter(auto =>
      (!this.selectedMarca || auto.marca === this.selectedMarca) &&
      (!this.selectedModello || auto.modello === this.selectedModello) &&
      (!this.selectedAnno || auto.anno.toString() === this.selectedAnno) &&
      this.filterByChilometraggio(auto.chilometraggio)
    );
    this.calculatePriceStats();
  }


  filterByChilometraggio(chilometraggio: number): boolean {
    if (!this.selectedChilometraggioInterval) {
      return true;
    }

    const [min, max] = this.selectedChilometraggioInterval.split('-').map(val => parseInt(val, 10));

    if (isNaN(min)) {
      return chilometraggio > max;
    }

    if (isNaN(max)) {
      return chilometraggio >= min;
    }

    return chilometraggio >= min && chilometraggio <= max;
  }

  calculatePriceStats() {
    if (this.filteredAutos.length > 0) {
      const prices = this.filteredAutos.map(auto => auto.prezzo.prezzoBase);
      console.log(prices);

      const min = Math.min(...prices);
      console.log(min);

      const max = Math.max(...prices);
      console.log(max);

      const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      console.log(avg);

      this.priceStats = { min, max, avg };
    } else {
      this.priceStats = null;
    }
  }
}