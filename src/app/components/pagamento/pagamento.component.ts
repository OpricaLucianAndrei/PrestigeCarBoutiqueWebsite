import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { Auto } from 'src/app/interfaces/auto';
import { AutoService } from 'src/app/services/auto.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {
  autoId!: number;
  auto!: Auto;
  user!: AuthData | null;
  sessionId!: string;
  userEmail!: string;
  userNome!: string;
  userCognome!: string;
  userToken!: string;
  colori: string[] = [];
  elements!: StripeElements;
  card!: StripeCardElement;
  clientSecret!: string;
  handler:any = null;
  selectedImageUrl: string = '';
  constructor(private route: ActivatedRoute,
    private router: Router, private autoSrv: AutoService, private http: HttpClient, private authSrv: AuthService, private modalSrv: ModalService) { }

  ngOnInit(): void {
    this.authSrv.getCurrentUser().subscribe(
      (user: any) => {
        this.user = user;
        this.userEmail = user.email;
        this.userNome =user.nome; 
        this.userCognome = user.cognome;
        console.log('User details:', this.user);
      },
      error => {
        console.error('Failed to fetch current user:', error);
      }
    );

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.autoId = +id; 
      this.getCar(this.autoId);

      this.initializeStripe();
    }
  }

  async initializeStripe() {
    // const stripe = await this.stripeService.getStripe();
    // if (!stripe) {
    //   console.error('Stripe failed to load');
    //   return;
    // }

    // this.elements = stripe.elements();
    // this.card = this.elements.create('card');
    // this.card.mount('#card-element');
    // const token = this.getToken();
    // try {
    //   this.clientSecret = await this.stripeService.createPaymentIntent(this.auto.prezzo.prezzoTotale, 'EUR', token); // Cambia amount e currency secondo le tue necessità
    // } catch (error) {
    //   console.error('Failed to create payment intent:', error);
    // }
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51PP9KiC3vTlO7HpvKttP6YXkahHTb6Zw0OKVXiapgimMasbcOfMZfPpH9fj7f2rRra9t933C2tYEQAuzbmUUAslO00KNLklRqA',
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token)
            alert('Payment Success!!');
          }
        });
      }
       
      window.document.body.appendChild(s);
    }
  }

  getCar(id: number): void {
    this.autoSrv.getAutoById(id).subscribe(
      (data: Auto) => {
        this.auto = data;
        this.colori = this.auto.specifiche.esterni.opzioniColori;
        console.log(this.auto);
      },
      (error: any) => {
        console.error('Errore nel recuperare i dettagli dell\'auto', error);
      }
    );
  }

  pay(amount: any) {    
 
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51PP9KiC3vTlO7HpvKttP6YXkahHTb6Zw0OKVXiapgimMasbcOfMZfPpH9fj7f2rRra9t933C2tYEQAuzbmUUAslO00KNLklRqA',
      locale: 'auto',
      token:  (token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token)
        this.processPayment(token.id, amount);
      },
      closed: () => {
        // Optional callback when checkout window is closed
        console.log('Checkout window closed');
      }
    });
    handler.open({
      name: 'Prestige Car Boutique',
      description: `${this.auto.marca} ${this.auto.modello}`,
      amount: amount * 100,
      currency: 'EUR',
      image: 'https://i.imgur.com/P4ciDP1.png'
    });
 
  }
  

  processPayment(tokenId: string, amount: number) {
    // Example: Send the token ID and amount to your backend API for payment processing
    // You can use Angular HttpClient to make a POST request to your backend
    const payload = { amount, "currency": "EUR"};
    this.http.post<any>('https://probable-harrietta-luciancodes-b4e8ebe2.koyeb.app/api/prestigecarboutique/pagamenti/payment-intent', payload)
      .subscribe(response => {
        console.log('Payment processed successfully:', response);
        this.modalSrv.showAlert('Pagamento effettuato!!');
        this.router.navigate(['/car-details', this.autoId]);
      }, error => {
        console.error('Payment failed:', error);
        this.modalSrv.showAlert('Pagamento fallito. Controlla la console per dettagli.');
      });
  }

  onColorChange(event: Event): void {
    const selectedColor = (event.target as HTMLSelectElement).value;
    const imageUrl = this.auto.immagini.find(img => img.opzioneColore === selectedColor)?.url[0];
    this.selectedImageUrl = imageUrl || '';
  }






  getToken(): string {
    return JSON.parse(localStorage.getItem('user') || '').token;;
  }
}
