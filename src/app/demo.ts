import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from './demo/demo';

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/users';

   getItems(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.apiUrl);
  }

  // POST: Create data
  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  // PUT: Update data
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }

  // DELETE: Remove data
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  
}
