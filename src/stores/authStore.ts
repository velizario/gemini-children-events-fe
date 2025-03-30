// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // To persist state in localStorage

// Define the shape of your user object (mirror backend response if possible)
interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'PARENT' | 'ORGANIZER' | 'ADMIN'; // Match Prisma enum
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // You might want to partially persist, e.g., not storing sensitive data if needed
      // partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Selector hooks (optional but convenient)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useUserRole = () => useAuthStore((state) => state.user?.role);