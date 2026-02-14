import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { StockItem } from '../../models/models';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  private stockService = inject(StockService);

  items: StockItem[] = [];
  filteredItems: StockItem[] = [];
  categories = ['Cuisine', 'Hygiène', 'Entretien', 'Autre'];
  
  searchTerm = '';
  filterCategory = 'all';
  showAddForm = false;
  editingItem: StockItem | null = null;
  
  formData: Omit<StockItem, 'id'> = {
    name: '',
    quantity: 0,
    unit: 'unité(s)',
    category: 'Cuisine',
    alertThreshold: 2
  };

  ngOnInit(): void {
    this.stockService.getItems().subscribe(items => {
      this.items = items;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.filterCategory === 'all' || item.category === this.filterCategory;
      return matchesSearch && matchesCategory;
    });
  }

  get lowStockItems(): StockItem[] {
    return this.items.filter(item => item.quantity <= item.alertThreshold);
  }

  get lowStockItemNames(): string {
    return this.items
      .filter(item => item.quantity <= item.alertThreshold)
      .map(item => item.name)
      .join(', ');
  }

  get totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.editingItem = null;
    this.resetForm();
  }

  openEditForm(item: StockItem): void {
    this.showAddForm = true;
    this.editingItem = item;
    this.formData = {
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      alertThreshold: item.alertThreshold
    };
  }

  closeForm(): void {
    this.showAddForm = false;
    this.editingItem = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      quantity: 0,
      unit: 'unité(s)',
      category: 'Cuisine',
      alertThreshold: 2
    };
  }

  async saveItem(): Promise<void> {
    if (!this.formData.name.trim()) {
      alert('Veuillez entrer un nom');
      return;
    }

    try {
      if (this.editingItem?.id) {
        await this.stockService.updateItem(this.editingItem.id, this.formData);
      } else {
        await this.stockService.addItem(this.formData);
      }
      this.closeForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async adjustQuantity(item: StockItem, delta: number): Promise<void> {
    if (!item.id) return;
    
    const newQuantity = Math.max(0, item.quantity + delta);
    try {
      await this.stockService.updateItem(item.id, { quantity: newQuantity });
    } catch (error) {
      console.error('Erreur lors de l\'ajustement:', error);
      alert('Erreur lors de l\'ajustement');
    }
  }

  async deleteItem(item: StockItem): Promise<void> {
    if (!item.id) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)) {
      try {
        await this.stockService.deleteItem(item.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  }
}
