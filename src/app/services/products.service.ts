import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/products';
  }

  getAll() {
    return firstValueFrom(
      this.httpClient.get<any[]>(this.baseUrl)
    )
  }

  getById(productId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${productId}`)
    )
  }

  getByCategoryId(categoryId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/category/${categoryId}`)
    )
  }

  create(formValue: any){    
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }

  update(productId: string, formValue: any){
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/${productId}`, formValue)
    );
  }

  deleteById(productId: string) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}/${productId}`)
    );
  }
}
