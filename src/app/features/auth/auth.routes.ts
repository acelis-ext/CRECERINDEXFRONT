import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';

export const authRoutes: Routes = [
  { path: '', component: LoginPage } // Esto hace que / (raíz) muestre el login
];
