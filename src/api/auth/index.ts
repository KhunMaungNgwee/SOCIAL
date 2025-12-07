import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import type { LoginRequestDTO, LoginResponseDTO, RegisterDTO ,RegisterResponseDTO} from './types'
import authServices from './services'
import type { APIResponse } from '../type'

export const useLoginMutation = (
  options?: UseMutationOptions<APIResponse<LoginResponseDTO>, Error, LoginRequestDTO>
) => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: LoginRequestDTO) => authServices.login(payload),
    ...options,
  })
}

export const useRegisterMutation = (
  options?: UseMutationOptions<APIResponse<RegisterResponseDTO>, Error, RegisterDTO>
) => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: (payload: RegisterDTO) => authServices.register(payload),
    ...options,
  })
}
