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

//get all users
export const GetUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await axiosInstance.get('/api/users/get-users');
    return response.data;
  } catch (error) {
return error instanceof Error ? error.message : 'An error occurred'     
  }
};

//update user status
export const UpdateUserStatus = async (id: string,status:string): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.put(`/api/users/update-user-status/${id}`, {status});
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};