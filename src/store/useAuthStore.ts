import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResponse } from "@/interfaces/login";

interface AuthState {
  user: {
    access_token: string | null;
    refresh_token: string | null;
  } | null;
  accountId: string | null;
  isAuthenticated: boolean;
  setLogin: (response: LoginResponse, accountId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accountId: null,
      isAuthenticated: false,
      setLogin: (response: LoginResponse, accountId: string) =>
        set({
          user: {
            access_token: response.accessToken,
            refresh_token: response.refreshToken,
          },
          accountId: accountId,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          accountId: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
