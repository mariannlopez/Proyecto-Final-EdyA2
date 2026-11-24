import { Injectable, OnDestroy, signal } from '@angular/core';
import { Unsubscribe } from 'firebase/auth';
import { DataSnapshot } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class RealtimeCollectionService<T extends {id?: string} = Record<string, any>> implements OnDestroy {
  private tableName!: string;
  private unsubscribe?: Unsubscribe;

  readonly results = signal<T[]>([]);
  readonly isPending = signal<boolean>(false);
  readonly error =  signal<string | null>(null);

  init(tableName: string): this{

  }

  private handleSnapshot(snapshot: DataSnapshot): T[]{

  }

  private startListener(): void {

  }

  async getAll(data: Omit<T, 'id'>){

  }

  async update(id: string, data: Partial<T>){

  }

  async deleteItem(id: string){
    
  }
}
