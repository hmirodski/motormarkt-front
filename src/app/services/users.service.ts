import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiResponse, User, UserCredentials } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/users';
  }

  login(formValue: UserCredentials): Promise<ApiResponse<User>> {
    return firstValueFrom(
      this.httpClient.post<ApiResponse<User>>(`${this.baseUrl}/login_admin`, formValue).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
    )
  }

  login_client(formValue: UserCredentials): Promise<ApiResponse<User>> {
    return firstValueFrom(
      this.httpClient.post<ApiResponse<User>>(`${this.baseUrl}/login`, formValue).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
    )
  }

  isLogged(): boolean {
    return localStorage.getItem('token_admin') ? true : false;
  }

  getAll(): Promise<User[]> {
    return firstValueFrom(
      this.httpClient.get<User[]>(this.baseUrl)
    )
  }

  getById(userId: string): Promise<ApiResponse<User>> {
    return firstValueFrom(
      this.httpClient.get<ApiResponse<User>>(`${this.baseUrl}/${userId}`).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
    )
  }

  getByEmail(email: string): Promise<ApiResponse<User>> {
    return firstValueFrom(
      this.httpClient.get<ApiResponse<User>>(`${this.baseUrl}/email/${email}`).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
    )
  }

  create(formValue: Partial<User>): Promise<ApiResponse<User>> {    
    return firstValueFrom(
      this.httpClient.post<ApiResponse<User>>(this.baseUrl, formValue)
    );
  }

  update(userId: string, formValue: Partial<User>): Promise<ApiResponse<User>> {
    return firstValueFrom(
      this.httpClient.put<ApiResponse<User>>(`${this.baseUrl}/${userId}`, formValue)
    );
  }

  deleteById(userId: string): Promise<ApiResponse<User>> {
    return firstValueFrom(
      this.httpClient.delete<ApiResponse<User>>(`${this.baseUrl}/${userId}`)
    );
  }
}
