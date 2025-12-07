
import axiosInstance from '../../configs/axios';
interface UploadImageResponse {
  message: string;
  status: number;
  data: {
    imageUrl: string; 
  };
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('ImageFile', file);
  
  const response = await axiosInstance.post<UploadImageResponse>(
    '/upload/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  if (response.data.status !== 0) {
    throw new Error(response.data.message || 'Upload failed');
  }
  
  return response.data.data.imageUrl; // Lowercase 'i'
};

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  const response = await axiosInstance.delete('/upload/image', {
    data: { ImageUrl: imageUrl },
  });
  
  return response.data.status === 0;
};