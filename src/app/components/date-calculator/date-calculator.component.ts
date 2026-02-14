import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateService } from '../../services/date.service';
import { DateEvent, DateCalculation } from '../../models/models';

@Component({
  selector: 'app-date-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-calculator.component.html',
  styleUrls: ['./date-calculator.component.css']
})
export class DateCalculatorComponent implements OnInit {
  private dateService = inject(DateService);

  events: DateEvent[] = [];
  showAddForm = false;
  editingEvent: DateEvent | null = null;

  formData: Omit<DateEvent, 'id'> = {
    title: '',
    startDate: '',
    endDate: '',
    useTwoPeriods: false
  };

  ngOnInit(): void {
    this.dateService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.editingEvent = null;
    this.resetForm();
  }

  openEditForm(event: DateEvent): void {
    this.showAddForm = true;
    this.editingEvent = event;
    this.formData = {
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate || '',
      useTwoPeriods: event.useTwoPeriods
    };
  }

  closeForm(): void {
    this.showAddForm = false;
    this.editingEvent = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      title: '',
      startDate: '',
      endDate: '',
      useTwoPeriods: false
    };
  }

  onToggleChange(): void {
    if (!this.formData.useTwoPeriods) {
      this.formData.endDate = '';
    }
  }

  async saveEvent(): Promise<void> {
    if (!this.formData.title.trim() || !this.formData.startDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.formData.useTwoPeriods && !this.formData.endDate) {
      alert('Veuillez entrer une date de fin');
      return;
    }

    try {
      const eventData = {
        ...this.formData,
        endDate: this.formData.useTwoPeriods ? this.formData.endDate : undefined
      };

      if (this.editingEvent?.id) {
        await this.dateService.updateEvent(this.editingEvent.id, eventData);
      } else {
        await this.dateService.addEvent(eventData);
      }
      this.closeForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async deleteEvent(event: DateEvent): Promise<void> {
    if (!event.id) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer "${event.title}" ?`)) {
      try {
        await this.dateService.deleteEvent(event.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  }

  calculateDate(event: DateEvent): DateCalculation {
    return this.dateService.calculateDifference(event.startDate, event.endDate);
  }

  getEventColor(index: number): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    ];
    return colors[index % colors.length];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
