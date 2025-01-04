export interface User {
  name: string;
  email: string;
  _id: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface UserPayload {
  name?: string;
  email: string;
  password: string;
}