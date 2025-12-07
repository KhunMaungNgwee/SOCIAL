import axiosInstance from '../../configs/axios'; 
import type { UserProfileDTO } from './types'
import type { APIResponse } from '../type'


const getProfile = async (): Promise<APIResponse<UserProfileDTO>> => {
  const response = await axiosInstance.get<APIResponse<UserProfileDTO>>(`/profile`)
  return response.data
}

export default {
  getProfile
}
