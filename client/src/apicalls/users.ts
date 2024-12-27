import { axiosInstance } from './axiosInstance.ts';
import { User, ApiResponse, UserPayload } from '../types/user';

export const RegisterUser = async (payload: UserPayload): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.post('/api/users/register', payload);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

export const LoginUser = async (payload: Pick<UserPayload, 'email' | 'password'>): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.post('/api/users/login', payload);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

export const GetCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.get('/api/users/get-current-user');
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};