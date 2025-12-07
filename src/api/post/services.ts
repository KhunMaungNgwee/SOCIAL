import axiosInstance from '../../configs/axios'; 
import type { Post, CreatePostDTO } from './types'
import type { APIResponse } from '../type'

const createPost = async (dto: CreatePostDTO): Promise<APIResponse<Post>> => {
  const response = await axiosInstance.post<APIResponse<Post>>(`/posts`, dto)
  return response.data
}

const editPost = async (postId: number, dto: CreatePostDTO): Promise<APIResponse<Post>> => {
  const response = await axiosInstance.put<APIResponse<Post>>(`/posts/${postId}`, dto)
  return response.data
}


const getMyPosts = async (page = 1, pageSize = 10): Promise<APIResponse<Post[]>> => {
  const response = await axiosInstance.get<APIResponse<Post[]>>(`/my-posts`, {
    params: { page, pageSize }
  })
  return response.data
}

export default {
  createPost,
  editPost,
  getMyPosts
}
