import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { TokenService } from './services/token.service';
import { authErrorInterceptor } from './interceptors/auth-error.interceptor';

export const coreProviders = [
  provideHttpClient(withInterceptors([jwtInterceptor, authErrorInterceptor])),
  TokenService
  // otros providers como TokenService
];

