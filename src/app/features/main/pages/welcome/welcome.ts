import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../../core/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.html',

})
export class Welcome {
  private tokenService = inject(TokenService);
    private router = inject(Router);

  user = this.tokenService.getUser();

}
