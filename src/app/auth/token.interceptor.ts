import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable} from 'rxjs';
import { AuthService } from './auth.service';

import { take, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authSrv: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("prova1");
    return this.authSrv.user$.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          console.log("prova")
          const newReq = request.clone({
            headers: request.headers.append('Authorization', "Bearer " + user.token)
          })
          // console.log(newReq);
          return next.handle(newReq);
        }
        else {
          return next.handle(request)
        }
      })
    )
  }
}
