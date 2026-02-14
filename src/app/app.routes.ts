import { Routes } from '@angular/router';
import { StockComponent } from './components/stock/stock.component';
import { DateCalculatorComponent } from './components/date-calculator/date-calculator.component';

export const routes: Routes = [
  { path: '', redirectTo: '/stock', pathMatch: 'full' },
  { path: 'stock', component: StockComponent },
  { path: 'dates', component: DateCalculatorComponent },
  { path: '**', redirectTo: '/stock' }
];
