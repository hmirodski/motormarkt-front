import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";
import { ApiResponse, Order } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/orders';
  }

  getAll(): Promise<Order[]> {
    return firstValueFrom(
      this.httpClient.get<Order[]>(this.baseUrl)
    ).then(response => {
      console.log('Respuesta de getAll ordenes:', response);
      return response;
    }).catch(error => {
      console.error('Error al obtener todas las órdenes:', error);
      return [];
    });
  }

  getById(orderId: string): Promise<ApiResponse<Order>> {    
    return firstValueFrom(
      this.httpClient.get<ApiResponse<Order>>(`${this.baseUrl}/${orderId}`)
    )
  }

  create(formValue: Partial<Order>): Promise<ApiResponse<Order>> {    
    return firstValueFrom(
      this.httpClient.post<ApiResponse<Order>>(this.baseUrl, formValue)
    );
  }

  update(orderId: string, formValue: Partial<Order>): Promise<ApiResponse<Order>> {
    return firstValueFrom(
      this.httpClient.put<ApiResponse<Order>>(`${this.baseUrl}/${orderId}`, formValue)
    );
  }

  getByUser(userId: string): Promise<ApiResponse<Order[]>> {
    return firstValueFrom(
      this.httpClient.get<Order[]>(`${this.baseUrl}/user/${userId}`)
    ).then(response => {
      // Transformar respuesta array a formato ApiResponse
      return { 
        data: response,
        error: false,
        message: 'Pedidos obtenidos correctamente'
      };
    });
  }
}
