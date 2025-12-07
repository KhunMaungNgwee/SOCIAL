import { useMutation, useQuery } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import type { 
  PostResponseDTO, 
  CreateCommentDTO, 
  ReactionRequestDTO, 
  ReactionResponseDTO 
} from './types'

import newsfeedServices from './services'
import type { APIResponse } from '../type'

// Fetch posts
export const usePostsQuery = (
  page: number,
  pageSize: number,
  options?: UseQueryOptions<APIResponse<PostResponseDTO[]>, Error>
) => {
  return useQuery({
    queryKey: ['posts', page, pageSize],
    queryFn: () => newsfeedServices.getAllPosts(page, pageSize),
    ...options,
  })
}

// Comment mutation
export const useCommentMutation = (
  options?: UseMutationOptions<APIResponse<Comment>, Error, { postId: number; dto: CreateCommentDTO }>
) => {
  return useMutation({
    mutationKey: ['comment'],
    mutationFn: ({ postId, dto }) => newsfeedServices.commentOnPost(postId, dto),
    ...options,
  })
}

// Reaction mutation
export const useReactionMutation = (
  options?: UseMutationOptions<APIResponse<ReactionResponseDTO>, Error, { postId: number; dto: ReactionRequestDTO }>
) => {
  return useMutation({
    mutationKey: ['reaction'],
    mutationFn: ({ postId, dto }) => newsfeedServices.toggleReaction(postId, dto),
    ...options,
  })
}
