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

  calculateDifference(startDate: string, endDate?: string): DateCalculation {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Calculer la différence en millisecondes
    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Calculer années, mois, jours
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
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

    // Additionner les jours
    const totalDays = calc1.totalDays + calc2.totalDays;

    // Calculer années/mois/jours du total
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    return {
      years,
      months,
      days,
      totalDays
    };
  }
}
