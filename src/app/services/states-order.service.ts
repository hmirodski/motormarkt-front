import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class StatesOrderService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/states_orders';
  }

  getAll() {
    return firstValueFrom(
      this.httpClient.get<any[]>(this.baseUrl)
    )
  }

  getById(orderLineId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${orderLineId}`)
    )
  }

  create(formValue: any){    
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }

  getByOrderId(orderId: string){    
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/order/${orderId}`)
    )
  }
}
