import { axiosInstance } from './axiosInstance';
import { Product, ApiResponse } from '../types/product';

export const AddProduct = async (payload: Product): Promise<ApiResponse<Product>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Product>>('/api/products/add-product', payload);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

export const GetProduct = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Product[]>>('/api/products/get-products');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

//delete a product
export const DeleteProduct = async (id)=>{
  try {
    const response = await axiosInstance.delete(
      `/api/products/delete-product/${id}`
    );
    return response?.data
  } catch (error) {
    return error?.message
  }
}