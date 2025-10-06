import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const handleAuthError = (error: unknown, message: string): void => {
  console.error(message, error);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string): Promise<void> => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
          }

          const data = await response.json();
          
          // Store token in localStorage
          localStorage.setItem('auth_token', data.token);
          
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          handleAuthError(error, 'Login failed');
          set({ isLoading: false });
          throw error;
        }
      },

      logout: (): void => {
        // Remove token from localStorage
        localStorage.removeItem('auth_token');
        
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async (): Promise<void> => {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            // Token is invalid, remove it and set unauthenticated
            localStorage.removeItem('auth_token');
            set({ isAuthenticated: false, user: null });
            return;
          }

          const data = await response.json();
          
          set({
            user: data.user,
            isAuthenticated: true,
          });
        } catch (error) {
          handleAuthError(error, 'Token verification failed');
          localStorage.removeItem('auth_token');
          set({ isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);