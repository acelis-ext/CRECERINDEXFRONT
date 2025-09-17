import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { finalize, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private http = inject(HttpClient);
  private endpoint = environment.apiBaseUrl;
  private tokenService = inject(TokenService);
  private router = inject(Router);

login(usuario: string, password: string, scaptchatoken: string) {
  return this.http.post<{ token: string }>(`${this.endpoint}Auth/login`, { usuario, password, scaptchatoken });
}


  /** Revoca en server y limpia cliente pase lo que pase */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.endpoint}Auth/logout`, {}, { responseType: 'text' as 'json' })
          .pipe(finalize(() => this.tokenService.clearToken()))
      );
    } catch {
      this.tokenService.clearToken();
    } finally {
      this.router.navigateByUrl('/login');
      setTimeout(() => window.history.pushState({}, '', '/login'));
      console.log('Usuario desconectado y redirigido a login');
    }
  }
}
