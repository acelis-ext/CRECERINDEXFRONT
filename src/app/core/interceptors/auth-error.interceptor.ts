import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { catchError, throwError } from 'rxjs';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((err) => {
      if (err?.status === 401 || err?.status === 419) {
        tokenService.clearToken();
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    })
  );
}