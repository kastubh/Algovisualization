import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      async login(credentials) {
        const tokens = await authApi.login(credentials);
        set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
        const user = await authApi.getMe();
        set({ user });
      },
      async register(payload) {
        await authApi.register(payload);
        await get().login({ email: payload.email, password: payload.password });
      },
      logout() {
        set({ user: null, accessToken: null, refreshToken: null });
      },
      async hydrateUser() {
        if (!get().accessToken || get().user) return;
        const user = await authApi.getMe();
        set({ user });
      },
    }),
    { name: 'algoviz-auth' },
  ),
);
