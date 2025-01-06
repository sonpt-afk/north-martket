import { axiosInstance } from './axiosInstance';
import { Notification, ApiResponse } from '../types/notification';

//add a notification
export const AddNotification = async (payload:Notification): Promise<ApiResponse<Notification>> => {
  try {
    const response = await axiosInstance.post('/api/notifications/notify', payload);
    return response?.data
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };  }
}

//get all notifications
export const GetAllNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const response = await axiosInstance.get('/api/notifications/get-all-notifications');
    return response.data
  } catch (error) {
    return error.response.data
  }
}

//delete a notification
export const DeleteNotification = async(id:string): Promise<ApiResponse<Notification>>=>{
  try {
    const response = await axiosInstance.delete(
      `/api/notifications/delete-notification/${id}`
    )
    return response?.data
  } catch (error) {
    return error.response?.data
    
  }
}

//read all notis by user
export const ReadAllNotifications = async()=>{
  try {
    const response = await axiosInstance.put(
      `/api/notifications/read-all-notifications`
    )
    return response?.data
  } catch (error) {
    return error.response?.data
    
  }
}