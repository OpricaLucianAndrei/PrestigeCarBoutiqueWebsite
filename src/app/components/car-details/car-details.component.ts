import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { Auto } from 'src/app/interfaces/auto';
import { AutoService } from 'src/app/services/auto.service';
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss']
})
export class CarDetailsComponent implements OnInit {
  autoId!: number;
  auto!: Auto;
  user!: AuthData | null;
  sessionId!: string;
  userEmail!: string;
  
  isLoading =false;

  constructor(private route: ActivatedRoute, private autoSrv: AutoService, private stripeService: StripeService, private authSrv: AuthService) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.authSrv.getCurrentUser().subscribe(
      (user: any) => {
        this.user = user;
        this.userEmail = user.email;
      },
      error => {
        console.error('Failed to fetch current user:', error);
      }
    );
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.autoId = +id; 
      this.getCar(this.autoId);
      this.isLoading=false;
    }
  }

  getCar(id: number): void {
    this.autoSrv.getAutoById(id).subscribe(
      (data: Auto) => {
        this.auto = data;
        
      },
      (error: any) => {
        console.error('Errore nel recuperare i dettagli dell\'auto', error);
      }
    );
  }


  // creaSessionePagamento(importo: number, userEmail: string): void{

    

  //   this.stripeService.createCheckoutSession(importo, "EUR", userEmail)
  //   .subscribe(
  //     response => {
  //       console.log('Success:', response);
  //     },
  //     error => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }
  
}
