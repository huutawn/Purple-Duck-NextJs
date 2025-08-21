export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  name: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  tokenVerify?: string;
  isVerified: boolean;
  timeCreateToken?: string;
  dob?: string;
  roles: Role[];
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  tokenVerify?: string;
  isVerified: boolean;
  timeCreateToken?: string;
  dob?: string;
  roles: Role[];
}

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}
