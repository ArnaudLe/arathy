import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, skipWhile } from 'rxjs/operators';

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated().pipe(
        skipWhile(user => user === undefined),  // Attendre que Firebase soit initialisé
        take(1),  // Prendre une seule valeur
        map(user => {
            if (user) {
                return true;
            } else {
                router.navigate(['/login']);
                return false;
            }
        })
    );
};