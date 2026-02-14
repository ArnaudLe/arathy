import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>👫 Arathy</h1>
          <p>Connectez-vous pour accéder à l'application</p>
        </div>
        
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label class="label">Email</label>
            <input 
              type="email" 
              class="input" 
              [(ngModel)]="email"
              name="email"
              placeholder="bonjour@gmail.com"
              autocomplete="email"
              required>
          </div>

          <div class="form-group">
            <label class="label">Mot de passe</label>
            <input 
              type="password" 
              class="input" 
              [(ngModel)]="password"
              name="password"
              autocomplete="current-password"
              required>
          </div>

          <div class="error" *ngIf="error">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{ loading ? 'Connexion...' : '🔑 Se connecter' }}
          </button>
        </form>

        <p class="login-footer">
          🔒 Votre session reste active même après fermeture du navigateur
        </p>
      </div>
    </div>
  `,
  styleUrl: 'login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';

  async login(): Promise<void> {
    this.error = '';
    this.loading = true;

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/stock']);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        this.error = '❌ Email ou mot de passe incorrect';
      } else if (error.code === 'auth/too-many-requests') {
        this.error = '⏸️ Trop de tentatives. Réessayez dans quelques minutes.';
      } else if (error.code === 'auth/network-request-failed') {
        this.error = '📡 Erreur réseau. Vérifiez votre connexion.';
      } else {
        this.error = '❌ Erreur de connexion. Réessayez.';
      }
    } finally {
      this.loading = false;
    }
  }
}