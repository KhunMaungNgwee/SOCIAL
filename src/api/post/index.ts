import { useMutation, useQuery } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import type { Post, CreatePostDTO } from './types'
import postServices from './services'
import type { APIResponse } from '../type'

export const useMyPostsQuery = (
  page: number,
  pageSize: number,
  options?: UseQueryOptions<APIResponse<Post[]>, Error>
) => {
  return useQuery({
    queryKey: ['myPosts', page, pageSize],
    queryFn: () => postServices.getMyPosts(page, pageSize),
    ...options,
  })
}
export const useCreatePostMutation = (
  options?: UseMutationOptions<APIResponse<Post>, Error, CreatePostDTO, unknown>
) => {
  return useMutation({
    mutationKey: ['createPost'],
    mutationFn: (dto) => postServices.createPost(dto),
    ...options,
  })
}

export const useEditPostMutation = (
  options?: UseMutationOptions<APIResponse<Post>, Error, { postId: number; dto: CreatePostDTO }>
) => {
  return useMutation({
    mutationKey: ['editPost'],
    mutationFn: ({ postId, dto }) => postServices.editPost(postId, dto),
    ...options,
  })
}
