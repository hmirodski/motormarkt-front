import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";
import { ApiResponse, ProductState } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/states';
  }

  getAll(): Promise<ProductState[]> {
    return firstValueFrom(
      this.httpClient.get<ProductState[]>(this.baseUrl)
    )
  }

  getById(stateId: string): Promise<ApiResponse<ProductState>> {    
    return firstValueFrom(
      this.httpClient.get<ApiResponse<ProductState>>(`${this.baseUrl}/${stateId}`)
    )
  }

  create(formValue: Partial<ProductState>): Promise<ApiResponse<ProductState>> {    
    return firstValueFrom(
      this.httpClient.post<ApiResponse<ProductState>>(this.baseUrl, formValue)
    );
  }

  update(stateId: string, formValue: Partial<ProductState>): Promise<ApiResponse<ProductState>> {
    return firstValueFrom(
      this.httpClient.put<ApiResponse<ProductState>>(`${this.baseUrl}/${stateId}`, formValue)
    );
  }

  deleteById(stateId: string): Promise<ApiResponse<ProductState>> {
    return firstValueFrom(
      this.httpClient.delete<ApiResponse<ProductState>>(`${this.baseUrl}/${stateId}`)
    );
  }
}
