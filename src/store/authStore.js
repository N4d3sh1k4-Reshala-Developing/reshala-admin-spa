import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) => set({ 
    accessToken: token, 
    user: user, 
    isAuthenticated: !!token 
  }),

  logout: () => set({ 
    accessToken: null, 
    user: null, 
    isAuthenticated: false 
  }),

  // Method to update only the token (used after refresh)
  updateToken: (token) => set({ 
    accessToken: token 
  }),
}));
