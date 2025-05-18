import { Product, Category, User, Order, ProductImage } from './index';

export function isProduct(obj: any): obj is Product {
  return obj && 
    typeof obj === 'object' && 
    'reference' in obj && 
    'name' in obj && 
    'price' in obj;
}

export function isCategory(obj: any): obj is Category {
  return obj && 
    typeof obj === 'object' && 
    'id' in obj && 
    'name' in obj;
}

export function isUser(obj: any): obj is User {
  return obj && 
    typeof obj === 'object' && 
    'email' in obj && 
    'username' in obj;
}

export function isOrder(obj: any): obj is Order {
  return obj && 
    typeof obj === 'object' && 
    'user_id' in obj && 
    'total' in obj;
}

export function isProductImage(obj: any): obj is ProductImage {
  return obj && 
    typeof obj === 'object' && 
    'product_id' in obj && 
    'name' in obj;
}