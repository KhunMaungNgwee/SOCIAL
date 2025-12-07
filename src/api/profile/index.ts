import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { UserProfileDTO } from './types'
import profileService from './services'
import type { APIResponse } from '../type'

export const useProfileQuery = (
  options?: UseQueryOptions<APIResponse<UserProfileDTO>, Error>
) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    ...options
  })
}
