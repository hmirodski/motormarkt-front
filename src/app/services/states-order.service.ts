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

  getByOrderId(orderId: string | number): Promise<any[]> {
    // Asegurar que orderId es una cadena
    const orderIdStr = String(orderId);
    console.log(`Obteniendo estados para orden ID: ${orderIdStr}`);
    
    return firstValueFrom(
      this.httpClient.get<any[]>(`${this.baseUrl}/order/${orderIdStr}`)
    ).then(response => {
      console.log(`Respuesta estados para orden ${orderIdStr}:`, response);
      // Manejar tanto respuestas de array directo como respuestas con formato ApiResponse
      if (response && Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        return (response as any).data;
      }
      return [];
    }).catch(error => {
      console.error(`Error getting states for order ${orderIdStr}:`, error);
      return [];
    });
  }
}
