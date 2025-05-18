import { Product, ProductFormData } from '../models';

export function productToFormData(product: Product): ProductFormData {
  return {
    reference: product.reference,
    name: product.name,
    description: product.description || '',
    price: product.price,
    quantity: product.quantity,
    category: product.category?.id || 0,
    images: null
  };
}

export function formDataToProduct(formData: ProductFormData, id?: number): Product {
  return {
    id,
    reference: formData.reference,
    name: formData.name,
    description: formData.description,
    price: formData.price,
    quantity: formData.quantity,
    category: typeof formData.category === 'number' 
      ? { id: formData.category } 
      : formData.category
  };
}