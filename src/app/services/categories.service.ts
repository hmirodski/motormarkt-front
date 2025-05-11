import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/categories';
  }

  getAll() {
    return firstValueFrom(
      this.httpClient.get<any[]>(this.baseUrl)
    )
  }

  getById(categoryId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${categoryId}`)
    )
  }

  create(formValue: any){    
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }

  update(categoryId: string, formValue: any){
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/${categoryId}`, formValue)
    );
  }

  deleteById(categoryId: string) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}/${categoryId}`)
    );
  }
}
