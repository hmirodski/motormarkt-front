import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import * as constants from "../../constants";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductImage, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ImagesProductService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/images_product';
  }

  getAll(): Promise<ProductImage[]> {
    return firstValueFrom(
      this.httpClient.get<ProductImage[]>(this.baseUrl)
    )
  }

  getById(imagesProductId: string): Promise<ApiResponse<ProductImage>> {    
    return firstValueFrom(
      this.httpClient.get<ApiResponse<ProductImage>>(`${this.baseUrl}/${imagesProductId}`).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      )
    )
  }

  getByProductId(productId: string): Promise<ApiResponse<ProductImage[]>> {    
    console.log('Solicitando imágenes para el producto:', productId);
    return firstValueFrom(
      this.httpClient.get<ApiResponse<ProductImage[]>>(`${this.baseUrl}/${productId}/images`)
    ).then(response => {
      console.log('Respuesta de imágenes recibida:', response);
      return response;
    }).catch(error => {
      console.error('Error al obtener imágenes del producto:', error);
      return { data: [], error: true, message: 'Error al cargar imágenes' };
    });
  }

  create(formValue: FormData, retryCount = 0): Promise<ApiResponse<ProductImage>> {    
    const maxRetries = 2;
    console.log('Iniciando subida de imagen (intento ' + (retryCount + 1) + '/' + (maxRetries + 1) + ')');
    console.log('Datos en formValue:', {
      product_id: formValue.get('product_id'),
      image_name: formValue.get('image') instanceof File ? (formValue.get('image') as File).name : 'No es un archivo válido',
      image_size: formValue.get('image') instanceof File ? (formValue.get('image') as File).size + ' bytes' : 'N/A',
      image_type: formValue.get('image') instanceof File ? (formValue.get('image') as File).type : 'N/A'
    });
    
    return firstValueFrom<ApiResponse<ProductImage>>(
      this.httpClient.post<ApiResponse<ProductImage>>(this.baseUrl, formValue).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Error en la petición de subida de imagen (intento ${retryCount + 1}/${maxRetries + 1}):`, error);
          console.error('Detalles del error:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message
          });
          
          if (retryCount < maxRetries) {
            console.log(`Reintentando subida de imagen (${retryCount + 1}/${maxRetries})...`);
            const delay = Math.pow(2, retryCount) * 1000;
            return new Promise<ApiResponse<ProductImage>>(resolve => {
              setTimeout(() => {
                resolve(this.create(formValue, retryCount + 1));
              }, delay);
            });
          }
          
          return throwError(() => error);
        })
      )
    ).then(response => {
      console.log('Respuesta exitosa de subida de imagen:', response);
      return response;
    }).catch(error => {
      console.error('Error final en la subida de imagen:', error);
      return { 
        data: {} as ProductImage, 
        error: true, 
        message: 'Error al subir la imagen: ' + (error.message || 'Error desconocido')
      };
    });
  }

  deleteById(imagesProductId: string): Promise<ApiResponse<ProductImage>> {
    return firstValueFrom(
      this.httpClient.delete<ApiResponse<ProductImage>>(`${this.baseUrl}/${imagesProductId}`)
    );
  }


}
