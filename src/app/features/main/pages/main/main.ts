import { Component, inject } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  private tokenService = inject(TokenService);
  private router = inject(Router);

  user = this.tokenService.getUser();
  currentYear = new Date().getFullYear(); // ✅ solución

  showSidebar = false;

  get isMobile(): boolean {
    return window.innerWidth < 640; // Tailwind's sm breakpoint
  }
  logout() {
    this.tokenService.clearToken();
    if (this.isMobile) this.showSidebar = false;
    this.router.navigate(['/']);
  }


  navigateAndCloseSidebar(path: string) {
    this.router.navigate([`/main/${path}`]);
    this.showSidebar = false;
  }



}
