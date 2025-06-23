import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { mainRoutes } from './main/main.routes';
import { AuthGuard } from '../core/guards/auth.guard';

export const featuresRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./main/main.routes').then((m) => m.mainRoutes),
  },

];