// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { TokenService } from '../services/token.service';
// import { catchError, throwError } from 'rxjs';

// export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);
//   const tokenService = inject(TokenService);

//   return next(req).pipe(
//     catchError((err) => {
//       if (err?.status === 401 || err?.status === 419) {
//         tokenService.clearToken();
//         router.navigateByUrl('/login');
//       }
//       return throwError(() => err);
//     })
//   );


  
// }


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
      // 401/419: token inválido/expirado → forzar login
      if (err?.status === 401 || err?.status === 419) {
        tokenService.clearToken();
        router.navigateByUrl('/login');
        return throwError(() => err);
      }

      // 403: bloqueado por política (FDID/CORS o ruta no permitida)
      if (err?.status === 403) {
        const uiMessage = 'Acceso bloqueado por política de seguridad (FD/CORS).';
        // Adjuntamos un mensaje para la UI
        const enriched = { ...err, uiMessage };
        // (Opcional) mostrar en consola para dev
        console.warn(uiMessage, err);
        return throwError(() => enriched);
      }

      return throwError(() => err);
    })
  );
};
