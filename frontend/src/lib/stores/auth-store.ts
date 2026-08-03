import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface AuthSession {
    accessToken: string;
    refreshToken: string;
    user: User;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    hasHydrated: boolean;
    setSession: (session: AuthSession) => void;
    updateUser: (user: Partial<User>) => void;
    clearSession: () => void;
    setHasHydrated: (state: boolean) => void;
}

// Persisted to localStorage on the client. On the server (SSR) `persist`
// has no localStorage to read, so getState() just returns this initial
// (logged-out) state — which is exactly right for the public pages that
// fetch during SSR (home, services listing): they never send a token.
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            hasHydrated: false,
            setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
            updateUser: (partial) => set((state) => (state.user ? { user: { ...state.user, ...partial } } : state)),
            clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: "baytak-auth",
            onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
        },
    ),
);