import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";
import { Category, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/categories';
  }

  getAll(): Promise<Category[]> {
    return firstValueFrom(
      this.httpClient.get<Category[]>(this.baseUrl)
    )
  }

  getById(categoryId: string): Promise<ApiResponse<Category>> {    
    return firstValueFrom(
      this.httpClient.get<ApiResponse<Category>>(`${this.baseUrl}/${categoryId}`)
    )
  }

  create(formValue: Partial<Category>): Promise<ApiResponse<Category>> {    
    return firstValueFrom(
      this.httpClient.post<ApiResponse<Category>>(this.baseUrl, formValue)
    );
  }

  update(categoryId: string, formValue: Partial<Category>): Promise<ApiResponse<Category>> {
    return firstValueFrom(
      this.httpClient.put<ApiResponse<Category>>(`${this.baseUrl}/${categoryId}`, formValue)
    );
  }

  deleteById(categoryId: string): Promise<ApiResponse<Category>> {
    return firstValueFrom(
      this.httpClient.delete<ApiResponse<Category>>(`${this.baseUrl}/${categoryId}`)
    );
  }
}
