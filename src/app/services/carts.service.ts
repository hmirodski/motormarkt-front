import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/carts';
    const cart = localStorage.getItem("cart");

  }

  getAll() {
    return firstValueFrom(
      this.httpClient.get<any[]>(this.baseUrl)
    )
  }

  getById(cartId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${cartId}`)
    )
  }

  create(formValue: any){    
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }

  update(cartId: string, formValue: any){
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/${cartId}`, formValue)
    );
  }

  deleteById(cartId: string) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}/${cartId}`)
    );
  }
}
