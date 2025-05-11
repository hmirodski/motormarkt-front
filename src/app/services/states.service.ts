import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/states';
  }

  getAll() {
    return firstValueFrom(
      this.httpClient.get<any[]>(this.baseUrl)
    )
  }

  getById(stateId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${stateId}`)
    )
  }

  create(formValue: any){    
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }

  update(stateId: string, formValue: any){
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/${stateId}`, formValue)
    );
  }

  deleteById(stateId: string) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}/${stateId}`)
    );
  }
}
