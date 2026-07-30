import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AdminUser } from "../types";

interface AdminAuthState {
    accessToken: string | null;
    admin: AdminUser | null;
    hasHydrated: boolean;
    setSession: (accessToken: string, admin: AdminUser) => void;
    clearSession: () => void;
    setHasHydrated: (state: boolean) => void;
}

// Deliberately a DIFFERENT storage key ("baytak-admin-auth") from the
// customer app's "baytak-auth" — the two apps also run on different
// origins in production, so there is no realistic path for these to mix,
// but the distinct key keeps local dev (same-machine, different ports on
// localhost share storage in some browsers) safe too.
export const useAdminAuthStore = create<AdminAuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            admin: null,
            hasHydrated: false,
            setSession: (accessToken, admin) => set({ accessToken, admin }),
            clearSession: () => set({ accessToken: null, admin: null }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: "baytak-admin-auth",
            onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
        },
    ),
);