
import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { uploadImage, deleteImage } from './service';

export const useUploadImageMutation = (
  options?: UseMutationOptions<string, Error, File>
) => {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
    ...options,
  });
};

export const useDeleteImageMutation = (
  options?: UseMutationOptions<boolean, Error, string>
) => {
  return useMutation({
    mutationFn: (imageUrl: string) => deleteImage(imageUrl),
    ...options,
  });
};