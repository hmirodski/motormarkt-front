export interface Category {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExtendedCategory extends Category {
  id?: number; 
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id?: number;
  reference: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: Category | { id: number } | number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id?: number;
  name: string;
  product_id: number;
  created_at?: string;
  updated_at?: string;
  url?: string;
}

export interface ProductState {
  id?: number; // Make optional to allow deletion
  name: string;
  created_at?: string;
  updated_at?: string;
  color?: string; // Added for UI
}

export interface ProductFormData {
  reference: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: number | { id: number } | any; // Más flexible para manejar diferentes formatos
  images?: FileList | null;
}

export interface ProductUpdateFormData extends ProductFormData {
  id: number;
}