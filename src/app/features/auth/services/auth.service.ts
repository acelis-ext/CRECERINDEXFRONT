import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  login(usuario: string, password: string) {
    console.log(usuario, password)
    return this.http.post<{ token: string }>('https://localhost:7144/api/Auth/login', {
      usuario,
      password
    });
  }

//   handleLoginSuccess(token: string) {
//     this.tokenService.saveToken(token);
//     this.router.navigateByUrl('/dashboard'); // redirige al módulo principal
//   }
}
