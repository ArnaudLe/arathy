import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <!-- En-tête -->
      <header class="header" *ngIf="user$ | async" [class.header-hidden]="!headerVisible">
        <div class="header-content">
          <h1 class="title">👫 Arathy</h1>
          <nav class="nav">
            <button
                class="nav-btn"
                [class.active]="currentRoute === '/stock'"
                (click)="navigateTo('/stock')">
              📦 Stock
            </button>
            <button
                class="nav-btn"
                [class.active]="currentRoute === '/dates'"
                (click)="navigateTo('/dates')">
              📅 Dates
            </button>
          </nav>
          <button class="btn btn-secondary btn-logout" (click)="logout()">
            🚪 Déconnexion
          </button>
        </div>
      </header>

      <!-- Contenu -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: 'app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentRoute: string = '';
  user$ = this.authService.isAuthenticated();
  private lastScrollTop = 0;
  headerVisible = true;

  constructor() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Sur mobile uniquement
    if (window.innerWidth <= 768) {
      if (scrollTop > this.lastScrollTop && scrollTop > 100) {
        // Scroll vers le bas et au-delà de 100px
        this.headerVisible = false;
      } else {
        // Scroll vers le haut ou en haut de page
        this.headerVisible = true;
      }
    } else {
      // Sur desktop, toujours visible
      this.headerVisible = true;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  async logout(): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}