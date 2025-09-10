import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';


// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     const token = localStorage.getItem('token');
//     if (token) {
//       return true;
//     }

//     this.router.navigate(['']);
//     return false;
//   }
// }


export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isExpired()) return true;

  tokenService.clearToken();
  router.navigateByUrl('/login');
  return false;
};