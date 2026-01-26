import { create } from 'zustand';
import { httpClient } from '../../infra/http';
import { storage } from '../../infra/storage';

// User interface definition
export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER';
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  zone?: string;
  isOnline?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    role: 'CLIENT' | 'PROVIDER';
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await httpClient.post('/auth/login', { email, password });
      const { user, accessToken } = response.data;

      storage.setToken(accessToken);
      storage.setUser(user);

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al iniciar sesión',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await httpClient.post('/auth/register', data);
      const { user, accessToken } = response.data;

      storage.setToken(accessToken);
      storage.setUser(user);

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al registrarse',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    storage.clear();
    set({ user: null, isAuthenticated: false, error: null });
  },

  loadUser: async () => {
    const token = storage.getToken();
    
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      // Fetch fresh user data from API
      const response = await httpClient.get('/auth/me');
      const user = response.data;
      
      // Update localStorage and state
      storage.setUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // Token invalid or expired
      storage.clear();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
