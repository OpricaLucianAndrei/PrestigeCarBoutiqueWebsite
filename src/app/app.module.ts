import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { AddCarComponent } from './components/add-car/add-car.component';
import { DealerComponent } from './components/dealer/dealer.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { authGuard } from './auth/auth.guard';
import { CarouselComponent } from './components/carousel/carousel.component';
import { PrenotazioniComponent } from './components/prenotazioni/prenotazioni.component';
import { ValutazioneUsatoComponent } from './components/valutazione-usato/valutazione-usato.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PagamentoComponent } from "./components/pagamento/pagamento.component";
import { CustomAlertComponent } from './components/custom-alert/custom-alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes: Route[] = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate : [authGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate : [authGuard]
  },
  {
    path: 'car-details/:id',
    component: CarDetailsComponent
  },
  {
    path: 'dealer',
    component: DealerComponent
  },
  {
    path: 'add-car',
    component: AddCarComponent
  },
  {
    path: 'inventory',
    component: InventoryComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'prenotazioni',
    component: PrenotazioniComponent
  },
  {
    path: 'valutazione',
    component: ValutazioneUsatoComponent
  },
  {
    path: 'pagamento/:id',
    component: PagamentoComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    CarDetailsComponent,
    AddCarComponent,
    DealerComponent,
    InventoryComponent,
    ContactUsComponent,
    HeaderComponent,
    CarouselComponent,
    PrenotazioniComponent,
    ValutazioneUsatoComponent,
    PagamentoComponent,
    CustomAlertComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule, 
    RouterModule.forRoot(routes), 
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
