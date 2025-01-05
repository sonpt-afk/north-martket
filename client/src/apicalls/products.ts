import { axiosInstance } from './axiosInstance';
import { Product, ApiResponse } from '../types/product';
import { ImageUploadPayload, ImageUploadResponse } from '../types/image';

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

export const GetProduct = async (filters): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Product[]>>('/api/products/get-products',filters);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

//delete a product

export const DeleteProduct = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`/api/products/delete-product/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

//edit a product
export const EditProduct = async (id, payload)=>{
  try {
    const response = await axiosInstance.put(
      `/api/products/edit-product/${id}`,
      payload
    );
    return response?.data
  } catch (error) {
    return error?.message
  }
}

//get a product by id
export const GetProductById = async(id:string) =>{
  try {
    const response = await axiosInstance.get(`/api/products/get-product-by-id/${id}`);
    return response?.data
  } catch (error) {
    return error?.message
    
  }
}

//upload product image
export const UploadProductImage = async (payload: ImageUploadPayload): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('productId', payload.productId);

    const response = await axiosInstance.post<ImageUploadResponse>(
      '/api/products/upload-image-to-product',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

//update product status
export const UpdateProductStatus = async (id: string, status: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.put(`/api/products/update-product-status/${id}`, {
      status: status
    })
    return response.data
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred'
    }
  }
}

//place a new bid
export const PlaceNewBid = async (payload)=>{
  try {
    const response = await axiosInstance.post(
      `/api/bids/place-new-bid`,
      payload
    );
    return response?.data
  } catch (error) {
    return error?.message
  }
}

//get all bids
export const GetAllBids = async (filters)=>{
  try {
    const response = await axiosInstance.post(`/api/bids/get-all-bids`, filters);
    return response?.data
  } catch (error) {
    return error?.message
  }
}