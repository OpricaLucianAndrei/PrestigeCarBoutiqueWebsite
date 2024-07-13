import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { Auto } from 'src/app/interfaces/auto';
import { AutoService } from 'src/app/services/auto.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent  implements OnInit {
  user!: AuthData | null;
  selectedMarca: string | null = null;
  selectedModello: string | null = null;
  selectedAnno: string | null = null;
  selectedColore: string | null = null;
  selectedCarburante: string | null = null;
  selectedTopSpeed: number | null = null;
  selectedPrezzoMax: number | null = null;

  uniqueMarcas: string[] = [];
  uniqueModelli: string[] = [];
  uniqueAnni: string[] = [];
  uniqueColori: string[] = [];
  uniqueCarburanti: string[] = [];

  autos: any[] = [];
  filteredAutos: any[] = [];
  isCollapsed = true;
  isLoading =false;

  constructor(private autoService: AutoService, private authSrv: AuthService) {}

  ngOnInit() {
    this.isLoading=true;
    this.authSrv.user$.subscribe((user) =>
      this.user = user)
    this.loadAutos();
  }



  // Metodo per cambiare lo stato del collapse
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  loadAutos() {
    this.autoService.getAuto().subscribe(data => {
      this.autos = data;
      this.filteredAutos = data;
      this.uniqueMarcas = [...new Set(data.map(auto => auto.marca))];
      this.uniqueColori = [...new Set(data.map(auto => auto.specifiche.esterni.opzioniColori).flat())];
      this.uniqueCarburanti = [...new Set(data.map(auto => auto.specifiche.performance.motore.tipo))];
    });
    this.isLoading=false;
  }

  onMarcaChange() {
    this.uniqueModelli = [...new Set(this.autos.filter(auto => auto.marca === this.selectedMarca).map(auto => auto.modello))];
    this.selectedModello = null;
    this.selectedAnno = null;
    this.filterAutos();
  }

  onModelloChange() {
    this.uniqueAnni = [...new Set(this.autos.filter(auto => auto.modello === this.selectedModello).map(auto => auto.anno))];
    this.selectedAnno = null;
    this.filterAutos();
  }

  onSubmit() {
    this.filterAutos();
  }

  filterAutos() {
    this.filteredAutos = this.autos.filter(auto => 
      (!this.selectedMarca || auto.marca === this.selectedMarca) &&
      (!this.selectedModello || auto.modello === this.selectedModello) &&
      (!this.selectedAnno || auto.anno === this.selectedAnno) &&
      (!this.selectedColore || auto.specifiche.esterni.opzioniColori.includes(this.selectedColore)) &&
      (!this.selectedCarburante || auto.specifiche.performance.motore.tipo === this.selectedCarburante) &&
      (!this.selectedTopSpeed || +auto.specifiche.performance.topSpeed >= this.selectedTopSpeed) &&
      (!this.selectedPrezzoMax || +auto.prezzo.prezzoBase <= this.selectedPrezzoMax)
    );
  }


  deleteAuto(id: number) {
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = user.token;
    
    if (token) {
      this.autoService.deleteAuto(id, token).subscribe(
        () => {
          console.log('Auto deleted successfully');
        },
        error => {
          console.error('Error deleting auto', error);
        }
      );
    } else {
      console.error('Token not found');
    }
    this.loadAutos();
  }
}
