import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-login.page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  form: FormGroup;
  loading = false;
  errorMsg: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private tokenservices: TokenService
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;

    this.loading = true;

    const { usuario, password } = this.form.value;
    this.authService.login(usuario!, password!).subscribe({
      next: ({ token }) => {
        this.tokenservices.saveToken(token);
        this.router.navigate(['/main']);
      },
      error: () => {
        this.errorMsg = 'Credenciales inválidas';
        this.loading = false;

        // Oculta el mensaje después de 3 segundos
        setTimeout(() => this.errorMsg = null, 3000);
      },

      complete: () => {
        this.loading = false;
      }
    });
  }
}
