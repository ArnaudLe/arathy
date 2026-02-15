import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { take, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentRoute: string = '';
  user$ = this.authService.isAuthenticated();
  loading = true;
  menuOpen = false;

  constructor() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });

    // Attendre que l'auth soit initialisée
    this.authService.isAuthenticated().pipe(
        skipWhile(user => user === undefined),
        take(1)
    ).subscribe(() => {
      this.loading = false;
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  async logout(): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await this.authService.logout();
      this.router.navigate(['/login']);
      this.closeMenu();
    }
  }
}