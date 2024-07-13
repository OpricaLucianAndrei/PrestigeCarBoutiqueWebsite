import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { Auto } from 'src/app/interfaces/auto';
import { AutoService } from 'src/app/services/auto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user!: AuthData | null;
  autos: Auto[] = [];
  isLoading = false;



  constructor(private autoSrv: AutoService, private authSrv: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading=true;
    this.authSrv.user$.subscribe((user) =>
      this.user = user)
    this.fetchAutos();
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  
  }

  private fetchAutos(): void {
    this.autoSrv.getAuto().subscribe(
      (data) => {
        this.autos = data;
        this.isLoading=false;
        console.log('Auto loaded:', this.autos);
      },
      (error) => {
        this.isLoading=false;
        console.error('Error fetching autos:', error);
       
      }
    );
  }

  

  showCustomAlert() {
    let customAlert = document.getElementById('customAlert');
    customAlert!.style.display = 'block';
  }
  
  // Close the custom alert
  closeCustomAlert() {
    let customAlert = document.getElementById('customAlert');
    customAlert!.style.display = 'none';
  }

}