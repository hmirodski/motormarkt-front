import { Product } from "../product";

export interface User {
  id?: number;
  username: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string; // Legacy property
  updatedAt?: string; // Legacy property
  role?: string;
  password?: string;
  card_user?: string;
  card_number?: string;
  card_caducity?: string;
  card_CVV?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  active?: boolean;
  admin?: boolean;
  client?: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  first_name: string;
  last_name: string;
  username: string;
}