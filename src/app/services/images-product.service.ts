import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesProductService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/images_product';
  }

  getAll() {
    return firstValueFrom(
      this.httpClient.get<any[]>(this.baseUrl)
    )
  }

  getById(imagesProductId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${imagesProductId}`).pipe(
        catchError((error: HttpErrorResponse) => {
          // Puedes lanzar el error nuevamente o devolver un valor predeterminado
          return throwError(error);
        })
      )
    )
  }

  getByProductId(productId: string){    
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${productId}/images`)
    )
  }

  create(formValue: any){    
    return firstValueFrom(
      this.httpClient.post<any>(this.baseUrl, formValue)
    );
  }

  deleteById(imagesProductId: string) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}/${imagesProductId}`)
    );
  }


}
