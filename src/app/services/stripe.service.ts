import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripePromise = loadStripe('pk_test_51PP9KiC3vTlO7HpvKttP6YXkahHTb6Zw0OKVXiapgimMasbcOfMZfPpH9fj7f2rRra9t933C2tYEQAuzbmUUAslO00KNLklRqA');
  apiUrl = 'https://probable-harrietta-luciancodes-b4e8ebe2.koyeb.app/api/prestigecarboutique'



  // createCheckoutSession(importo: number, valuta: string, receiptEmail: string): Observable<any> {
  //   const body = {
  //     importo,
  //     valuta,
  //     receiptEmail
  //   };



  //   return this.http.post(`${this.apiUrl}/pagamenti/create-checkout-session`, body);
  // }

  // async redirectToCheckout(sessionId: string) {
  //   const stripe = await this.stripePromise;

  //   if (!stripe) {
  //     console.error('Stripe failed to load');
  //     return;
  //   }

  //   const result = await stripe.redirectToCheckout({ sessionId });
  //   if (result && result.error) {
  //     console.error('Error redirecting to checkout:', result.error.message);
  //   }
  // }


  async getStripe(): Promise<Stripe | null> {
    return await this.stripePromise;
  }

  async createPaymentIntent(importo: number, valuta: string, token: string) {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
  
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
  
    try {
      const response = await fetch(`${this.apiUrl}/pagamenti/payment-intent`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ importo, valuta })
      });
  
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
  
      const responseData = await response.json();
      console.log('Payment Intent:', responseData);
      return responseData.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
  

  async confirmPayment(clientSecret: string, paymentMethod: any) {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod
    });
  }
}
