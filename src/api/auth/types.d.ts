
export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type LoginData = {
   success: boolean;
  message: string;
  token: string;
  user: User;
};

export type User = {
  id?: string;
  email: string;
  name?: string;
};

export type LoginResponseDTO = APIResponse<LoginData>;

export type RegisterData = {
  success: boolean;
  message: string;
  user: User; 
};

export type RegisterResponseDTO = APIResponse<RegisterData>;

export type RegisterDTO = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;  
  profilePictureUrl: string;
};