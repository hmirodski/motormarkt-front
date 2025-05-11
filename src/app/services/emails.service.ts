import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/send-email';
  }

  send(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }
}
