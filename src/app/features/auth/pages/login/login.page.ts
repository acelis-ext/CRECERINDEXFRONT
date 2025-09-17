import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaComponent, RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-login.page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  form: FormGroup;
  loading = false;
  errorMsg: string | null = null;

  @ViewChild('captchaRef') captchaRef?: RecaptchaComponent;
  siteKey = environment.CAPTCHA_KEY;
  bCaptchaValid = false;
  private captchaIssuedAt: number | null = null;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.form = fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      scaptchatoken: ['', Validators.required]
    });
  }

  // ---- reCAPTCHA handlers ----
  validateCaptcha(token: string | null) {
    if (token) {
      this.bCaptchaValid = true;
      this.captchaIssuedAt = Date.now();
      this.form.patchValue({ scaptchatoken: token });
      this.form.get('scaptchatoken')?.setErrors(null);
    } else {
      this.onCaptchaExpired();
    }
  }

  onCaptchaExpired() {
    this.bCaptchaValid = false;
    this.captchaIssuedAt = null;
    this.form.patchValue({ scaptchatoken: '' });
    // try/catch por si el iframe ya no existe (evita "client element has been removed")
    try { this.captchaRef?.reset(); } catch {}
  }

  onCaptchaError(_e?: unknown) {
    this.onCaptchaExpired();
  }

  resetCaptcha() {
    this.onCaptchaExpired();
  }

  // ---- Login ----
  login() {
    // token caduca ~2min => cortamos a ~110s para evitar rechazos
    const tooOld = this.captchaIssuedAt && (Date.now() - this.captchaIssuedAt) > 110_000;

    if (this.form.invalid || !this.bCaptchaValid || !this.captchaIssuedAt || tooOld) {
      if (tooOld) this.errorMsg = 'Captcha expirado. Valídalo nuevamente.';
      this.form.markAllAsTouched();
      this.onCaptchaExpired();
      return;
    }

    this.loading = true;
    this.tokenService.clearToken();

    const { usuario, password, scaptchatoken } = this.form.value;

    this.authService.login(usuario, password, scaptchatoken).subscribe({
      next: ({ token }) => {
        this.tokenService.saveToken(token);
        // ✅ NO resetees el captcha aquí: el componente se destruye al navegar
        this.router.navigate(['/main']);
      },
      error: (err) => {
        this.errorMsg = err?.uiMessage ?? 'Credenciales o captcha inválidos';
        this.loading = false;
        // ❌ En error sí resetea (ese token ya no sirve)
        this.resetCaptcha();
        setTimeout(() => (this.errorMsg = null), 3000);
      },
      complete: () => (this.loading = false)
    });
  }
}
