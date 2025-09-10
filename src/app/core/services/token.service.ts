import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/DecodedToken';


export class TokenService {
  private readonly tokenKey = 'auth-token';
 saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUser(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return {
        nombre: decoded?.Nombre ?? 'Nombre',
        apellido: decoded?.Apellido ?? 'Apellido',
        exp: decoded?.exp
      };
    } catch {
      return null;
    }
  }

  /** true si el token ya expiró (o no existe) */
  isExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const dec: any = jwtDecode(token);
      if (!dec?.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return dec.exp <= now;
    } catch {
      return true;
    }
  }
}
