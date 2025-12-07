import axios from '../../configs/axios'
import type { LoginRequestDTO, RegisterDTO, LoginResponseDTO, RegisterResponseDTO } from './types'

const baseUrl = '/Auth'

const login = async (payload: LoginRequestDTO): Promise<LoginResponseDTO> => {
  const response = await axios.post<LoginResponseDTO>(`${baseUrl}/login`, payload);
  return response.data; 
};

const register = async (payload: RegisterDTO): Promise<RegisterResponseDTO> => {
  const response = await axios.post<RegisterResponseDTO>(`${baseUrl}/register`, payload);
  return response.data;
};

export default {
  login,
  register
}
