import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { TokenService } from './services/token.service';

export const coreProviders = [
  provideHttpClient(withInterceptors([jwtInterceptor])),
    TokenService 
  // otros providers como TokenService
];

