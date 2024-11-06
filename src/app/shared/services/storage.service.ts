import { Injectable, inject } from '@angular/core';
import { LOCAL_STORAGE } from '../utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  load<T>(key: string): T[] {
    return JSON.parse(this.storage.getItem(key) ?? '[]') as T[];
  }

  save<T>(key: string, items: T[]): void {
    this.storage.setItem(key, JSON.stringify(items));
  }
}
