import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Welcome} from './pages/welcome/welcome';

export const mainRoutes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        component: Welcome, // Mostramos mensaje de bienvenida por defecto
        pathMatch: 'full'
      },
      {
        path: 'search',
        loadChildren: () =>
          import('../search/search.route').then(m => m.searchRoutes)
      }
    ]
  }
];
