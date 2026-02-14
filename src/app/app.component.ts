import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <!-- En-tête -->
      <header class="header">
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
        </div>
      </header>

      <!-- Contenu -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }

    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #667eea;
      margin: 0;
    }

    .nav {
      display: flex;
      gap: 0.5rem;
      background: #f3f4f6;
      padding: 0.25rem;
      border-radius: 12px;
    }

    .nav-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      color: #6b7280;
    }

    .nav-btn:hover {
      color: #667eea;
    }

    .nav-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .main-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
      }

      .title {
        font-size: 1.5rem;
      }

      .nav {
        width: 100%;
      }

      .nav-btn {
        flex: 1;
        padding: 0.75rem;
        font-size: 0.9rem;
      }

      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
