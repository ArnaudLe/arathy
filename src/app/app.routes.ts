import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StockComponent } from './components/stock/stock.component';
import { DateCalculatorComponent } from './components/date-calculator/date-calculator.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'stock', component: StockComponent, canActivate: [authGuard] },
  { path: 'dates', component: DateCalculatorComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/stock', pathMatch: 'full' },
  { path: '**', redirectTo: '/stock' }
];