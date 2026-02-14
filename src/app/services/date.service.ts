import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DateEvent, DateCalculation } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private firestore = inject(Firestore);
  private eventsCollection = collection(this.firestore, 'date-events');

  getEvents(): Observable<DateEvent[]> {
    const q = query(this.eventsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<DateEvent[]>;
  }

  async addEvent(event: Omit<DateEvent, 'id'>): Promise<void> {
    const newEvent = {
      ...event,
      createdAt: new Date().toISOString()
    };
    await addDoc(this.eventsCollection, newEvent);
  }

  async updateEvent(id: string, event: Partial<DateEvent>): Promise<void> {
    const eventDoc = doc(this.firestore, 'date-events', id);
    await updateDoc(eventDoc, event);
  }

  async deleteEvent(id: string): Promise<void> {
    const eventDoc = doc(this.firestore, 'date-events', id);
    await deleteDoc(eventDoc);
  }

  /**
   * Calcule la différence entre deux dates de manière précise
   */
  calculateDifference(startDate: string, endDate?: string): DateCalculation {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    // Calculer la différence en millisecondes
    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Calculer années, mois, jours de manière précise
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // Ajuster si les jours sont négatifs
    if (days < 0) {
      months--;
      // Prendre le nombre de jours du mois précédent
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }

    // Ajuster si les mois sont négatifs
    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      years: Math.abs(years),
      months: Math.abs(months),
      days: Math.abs(days),
      totalDays
    };
  }

  /**
   * Calcule le total de deux périodes en additionnant les jours
   * puis en recalculant années/mois/jours de manière précise
   */
  calculateTotalPeriods(
      period1Start: string,
      period1End: string,
      period2Start?: string
  ): DateCalculation {
    // Période 1
    const calc1 = this.calculateDifference(period1Start, period1End);

    // Si pas de période 2, retourner juste période 1
    if (!period2Start) {
      return calc1;
    }

    // Période 2 (de period2Start à aujourd'hui)
    const calc2 = this.calculateDifference(period2Start);

    // Total de jours exact
    const totalDaysCount = calc1.totalDays + calc2.totalDays;

    // Calculer la date virtuelle en ajoutant tous les jours à period1Start
    const virtualDate = this.addDaysToDate(period1Start, totalDaysCount);

    // Calculer la différence entre period1Start et cette date virtuelle
    // Cela donne le calcul précis en années/mois/jours
    const preciseDiff = this.calculateDifference(period1Start, virtualDate.toISOString().split('T')[0]);

    return {
      years: preciseDiff.years,
      months: preciseDiff.months,
      days: preciseDiff.days,
      totalDays: totalDaysCount
    };
  }

  /**
   * Ajoute un nombre de jours à une date (gère les années bissextiles)
   */
  private addDaysToDate(dateString: string, daysToAdd: number): Date {
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }

  /**
   * Calcule la prochaine date d'anniversaire de manière ultra-précise
   */
  getNextAnniversary(event: DateEvent): { date: Date; daysUntil: number; text: string } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time pour comparaison précise

    if (!event.useTwoPeriods) {
      // Mode simple : anniversaire basé sur period1Start
      const start = new Date(event.period1Start);

      // Calculer l'anniversaire cette année
      let nextAnniversary = new Date(
          today.getFullYear(),
          start.getMonth(),
          start.getDate()
      );

      // Si déjà passé, prendre l'année prochaine
      if (nextAnniversary <= today) {
        nextAnniversary = new Date(
            today.getFullYear() + 1,
            start.getMonth(),
            start.getDate()
        );
      }

      const diffMs = nextAnniversary.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      const dateText = nextAnniversary.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return { date: nextAnniversary, daysUntil, text: dateText };

    } else {
      // Mode 2 périodes : calcul ultra-précis
      if (!event.period1End || !event.period2Start) {
        return null;
      }

      // Calculer le total actuel de jours
      const currentCalc = this.calculateTotalPeriods(
          event.period1Start,
          event.period1End,
          event.period2Start
      );

      const totalDays = currentCalc.totalDays;

      // Date virtuelle = period1Start + totalDays
      const virtualDate = this.addDaysToDate(event.period1Start, totalDays);

      // Trouver le prochain anniversaire basé sur period1Start
      const startDate = new Date(event.period1Start);
      const virtualYear = virtualDate.getFullYear();

      // Calculer l'anniversaire dans l'année virtuelle
      let nextAnniversary = new Date(
          virtualYear,
          startDate.getMonth(),
          startDate.getDate()
      );

      // Si l'anniversaire virtuel est déjà passé, prendre l'année suivante
      if (nextAnniversary <= virtualDate) {
        nextAnniversary = new Date(
            virtualYear + 1,
            startDate.getMonth(),
            startDate.getDate()
        );
      }

      // Calculer combien de jours entre virtualDate et nextAnniversary
      const diffMs = nextAnniversary.getTime() - virtualDate.getTime();
      const daysFromVirtualToAnniversary = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // La vraie date du prochain anniversaire = aujourd'hui + ces jours
      const realNextAnniversary = this.addDaysToDate(
          today.toISOString().split('T')[0],
          daysFromVirtualToAnniversary
      );

      const daysUntil = daysFromVirtualToAnniversary;

      const dateText = realNextAnniversary.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return {
        date: realNextAnniversary,
        daysUntil,
        text: dateText
      };
    }
  }
}