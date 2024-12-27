export interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  age: number;
  seller: string;
  status: string;
  images: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}