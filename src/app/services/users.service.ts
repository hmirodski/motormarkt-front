import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/users';
  }

  login(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/login_admin`, formValue).pipe(
        catchError((error: HttpErrorResponse) => {
          // Puedes lanzar el error nuevamente o devolver un valor predeterminado
          return throwError(error);
        })
      )
    )
  }

  login_client(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/login`, formValue).pipe(
        catchError((error: HttpErrorResponse) => {
          // Puedes lanzar el error nuevamente o devolver un valor predeterminado
          return throwError(error);
        })
      )
    )
  }

  isLogged(): boolean {
    return localStorage.getItem('token_admin') ? true : false;
  }

  getAll() {
    return firstValueFrom(
      this.httpClient.get<any[]>(this.baseUrl)
    )
  }

  getById(userId: string){
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${userId}`).pipe(
        catchError((error: HttpErrorResponse) => {
          // Puedes lanzar el error nuevamente o devolver un valor predeterminado
          return throwError(error);
        })
      )
    )
  }

  getByEmail(email: string){
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/email/${email}`).pipe(
        catchError((error: HttpErrorResponse) => {
          // Puedes lanzar el error nuevamente o devolver un valor predeterminado
          return throwError(error);
        })
      )
    )
  }

  create(formValue: any){    
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }

  update(userId: string, formValue: any){
    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/${userId}`, formValue)
    );
  }

  deleteById(userId: string) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}/${userId}`)
    );
  }
}
