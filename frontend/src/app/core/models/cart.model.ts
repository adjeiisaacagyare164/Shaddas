import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  location: string;
  note: string;
}
