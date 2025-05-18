import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import * as constants from "../../constants";
import { Product, ApiResponse, ProductFormData } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;
  
  // Reactive state for products
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor() {
    this.baseUrl = constants.API_URL + '/api/v1/products';
  }

  async getAll(): Promise<Product[]> {
    const products = await firstValueFrom(
      this.httpClient.get<Product[]>(this.baseUrl)
    );
    return products;
  }
  
  async refresh(): Promise<Product[]> {
    try {
      const products = await this.getAll();
      this.productsSubject.next(products);
      return products;
    } catch (error) {
      console.error('Error refreshing products:', error);
      return [];
    }
  }

  getById(productId: string): Promise<ApiResponse<Product>> {
    console.log('Solicitando producto con ID:', productId);
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/${productId}`)
    ).then(response => {
      console.log('Respuesta raw de la API:', response);
      
      // Si la respuesta es nula o no es un objeto, es un error
      if (!response || typeof response !== 'object') {
        console.error('Respuesta inesperada de la API:', response);
        return { 
          data: {} as Product, 
          error: true, 
          message: 'Formato de respuesta inesperado' 
        };
      }
      
      // Si la respuesta ya tiene el formato esperado
      if ('data' in response && typeof response.data === 'object') {
        console.log('Respuesta tiene formato ApiResponse con data:', response.data);
        return response as ApiResponse<Product>;
      }
      
      // Si la respuesta es el producto directamente
      if ('id' in response || 'reference' in response) {
        console.log('Respuesta es el producto directamente, adaptando');
        return {
          data: response as Product,
          error: false,
          message: 'Producto obtenido correctamente'
        };
      }
      
      // Si no cumple ninguno de los formatos esperados
      console.error('Formato de respuesta no reconocido:', response);
      return { 
        data: {} as Product, 
        error: true, 
        message: 'Formato de respuesta no reconocido' 
      };
    }).catch(error => {
      console.error('Error al obtener el producto:', error);
      return { 
        data: {} as Product, 
        error: true, 
        message: 'Error al cargar el producto: ' + error.message 
      };
    });
  }

  getByCategoryId(categoryId: string): Promise<ApiResponse<Product[]>> {    
    return firstValueFrom(
      this.httpClient.get<ApiResponse<Product[]>>(`${this.baseUrl}/category/${categoryId}`)
    )
  }

  async create(formValue: ProductFormData): Promise<ApiResponse<Product>> {    
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponse<Product>>(this.baseUrl, formValue)
    );
    
    if (response && !response.error) {
      await this.refresh();
    }
    
    return response;
  }

  // Actualización simplificada que garantiza que los datos son compatibles con el backend
  async update(productId: string, formValue: ProductFormData): Promise<ApiResponse<Product>> {
    // Prepare sanitized data object (eliminate potential errors of type mismatch)
    const safeData = {
      reference: formValue.reference,
      name: formValue.name,
      description: formValue.description || '',
      price: Number(formValue.price) || 0,
      quantity: Number(formValue.quantity) || 0,
      category: formValue.category && formValue.category.id ? { id: Number(formValue.category.id) } : null
    };
    
    console.log('Enviando actualización del producto:', {
      productId,
      formData: safeData
    });
    
    try {
      const response = await firstValueFrom(
        this.httpClient.put<ApiResponse<Product>>(`${this.baseUrl}/${productId}`, safeData)
      );
      
      console.log('Respuesta del servidor a la actualización:', response);
      
      if (response && !response.error) {
        await this.refresh();
      }
      
      return response;
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      
      // Convertir err a any para acceder a sus propiedades
      const error = err as any;
      console.error('Detalles del error:', {
        status: error?.status || 'N/A',
        statusText: error?.statusText || 'N/A',
        message: error?.message || 'N/A',
        error: error?.error || 'N/A'
      });
      
      let errorMessage = 'Error al actualizar el producto';
      
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      return { 
        data: {} as Product, 
        error: true, 
        message: errorMessage
      };
    }
  }

  async deleteById(productId: string): Promise<ApiResponse<Product>> {
    const response = await firstValueFrom(
      this.httpClient.delete<ApiResponse<Product>>(`${this.baseUrl}/${productId}`)
    );
    
    if (response && !response.error) {
      await this.refresh();
    }
    
    return response;
  }
}
