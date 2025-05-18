import { Product } from "../product";
import { User } from "../user";

export interface Order {
  id?: number;
  user_id: number;
  reference?: string;
  total: number;
  state_id: number;
  state?: OrderState;
  current_state?: {
    name: string;
    color: string;
    id?: number;
  };
  created_at?: string;
  updated_at?: string;
  order_lines?: OrderLine[];
  payment?: string;
  total_price?: number;
  user?: { id: number } | User;
}

export interface OrderLine {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
  created_at?: string;
  updated_at?: string;
}

export interface OrderState {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}