export interface Product {
  id: string;
  category?: string;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  images: string[];
  availability: boolean;
  status: 'published' | 'draft' | 'hidden';
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  related_products?: Product[];
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  availability: boolean;
  status: 'published' | 'draft' | 'hidden';
  is_featured: boolean;
}
