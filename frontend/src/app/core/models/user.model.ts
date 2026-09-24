export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'owner' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}
