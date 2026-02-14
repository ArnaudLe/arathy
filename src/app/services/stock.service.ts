import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { StockItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private firestore = inject(Firestore);
  private stockCollection = collection(this.firestore, 'stock-items');

  getItems(): Observable<StockItem[]> {
    const q = query(this.stockCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<StockItem[]>;
  }

  async addItem(item: Omit<StockItem, 'id'>): Promise<void> {
    const newItem = {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await addDoc(this.stockCollection, newItem);
  }

  async updateItem(id: string, item: Partial<StockItem>): Promise<void> {
    const itemDoc = doc(this.firestore, 'stock-items', id);
    await updateDoc(itemDoc, {
      ...item,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteItem(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, 'stock-items', id);
    await deleteDoc(itemDoc);
  }
}
