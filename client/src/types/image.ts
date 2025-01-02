export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data?: {
    secure_url: string;
  };
}

export interface ImageUploadPayload {
  file: File;
  productId: string;
}