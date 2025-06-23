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
    console.log('token service',token)
    try {
      const decoded = jwtDecode<any>(token);
      console.log('decoded',decoded)
      return {
        nombre: decoded.Nombre || 'Nombre',
        apellido: decoded.Apellido || 'Apellido',
      };
    } catch (e) {
      return null;
    }
  }
}
