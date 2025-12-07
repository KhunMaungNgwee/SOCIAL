import axiosInstance from '../../configs/axios';
import type { 
  PostResponseDTO, 
  CreateCommentDTO, 
  ReactionRequestDTO, 
  ReactionResponseDTO,  
} from './types'
import type { APIResponse } from '../type'

const getAllPosts = async (page = 1, pageSize = 10): Promise<APIResponse<PostResponseDTO[]>> => {
  const response = await axiosInstance.get<APIResponse<PostResponseDTO[]>>(`/posts`, {
    params: { page, pageSize }
  })
  return response.data
}

const commentOnPost = async (postId: number, dto: CreateCommentDTO): Promise<APIResponse<Comment>> => {
  const response = await axiosInstance.post<APIResponse<Comment>>(`/posts/${postId}/comments`, dto)
  return response.data
}

const toggleReaction = async (postId: number, dto: ReactionRequestDTO): Promise<APIResponse<ReactionResponseDTO>> => {
  const response = await axiosInstance.post<APIResponse<ReactionResponseDTO>>(`/posts/${postId}/reaction`, dto)
  return response.data
}

export default {
  getAllPosts,
  commentOnPost,
  toggleReaction
}
