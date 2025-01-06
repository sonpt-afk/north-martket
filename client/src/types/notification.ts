// types for notification
export interface Notification {
  _id: string;
  title: string;
  message: string;
  onClick: string;
  user: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;

}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}