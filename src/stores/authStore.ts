import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AppRole } from '../types';
import { login as apiLogin, verifyToken as apiVerifyToken } from '../services/api';

const mapApiUserToAuthUser = (apiUser: {
  id: string;
  email: string;
  role: AppRole;
  createdAt: string;
  updatedAt: string;
}) => ({
  id: apiUser.id,
  email: apiUser.email,
  role: apiUser.role,
});

const handleAuthError = (error: unknown, message: string, setError?: (error: string) => void): void => {
  console.error(message, error);
  if (setError) {
    setError(message);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiLogin({ email, password });
          
          localStorage.setItem('auth_token', response.token);
          
          set({
            user: mapApiUserToAuthUser(response.user),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          handleAuthError(error, 'Login failed', (errorMsg) =>
            set({ error: errorMsg, isLoading: false })
          );
          throw error;
        }
      },

      logout: (): void => {
        localStorage.removeItem('auth_token');
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async (): Promise<void> => {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await apiVerifyToken();
          
          set({
            user: mapApiUserToAuthUser(response.user),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          handleAuthError(error, 'Token verification failed', (errorMsg) => {
            localStorage.removeItem('auth_token');
            set({
              error: errorMsg,
              isAuthenticated: false,
              user: null,
              isLoading: false
            });
          });
        }
      },

      clearError: (): void => {
        set({ error: null });
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