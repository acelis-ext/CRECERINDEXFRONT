import { Component, inject } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
private tokenService = inject(TokenService);
  private router = inject(Router);
  private authService = inject(AuthService);

  user = this.tokenService.getUser();
  currentYear = new Date().getFullYear();
  showSidebar = false;

  get isMobile(): boolean { return window.innerWidth < 640; }

  async logout() {
    await this.authService.logout(); // llama API + limpia + redirige
    if (this.isMobile) this.showSidebar = false;
  }

  navigateAndCloseSidebar(path: string) {
    this.router.navigate([`/main/${path}`]);
    this.showSidebar = false;
  }
}
