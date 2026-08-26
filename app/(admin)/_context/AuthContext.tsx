"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../_lib/api";
import {
  getToken,
  setToken,
  clearAuth,
  setStoredUser,
  getStoredUser,
} from "../_lib/auth";
import type { User, LoginPayload } from "../_lib/types";

// ─── Context Shape ──────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Try to restore from storage first for instant UI
    const stored = getStoredUser();
    if (stored) setUser(stored);

    // Then verify with the server
    authApi
      .me()
      .then((res) => {
        const u = res.user as User;
        if (u) {
          setUser(u);
          setStoredUser(u, !!localStorage.getItem("pr_admin_remember"));
        }
      })
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (payload: LoginPayload, remember: boolean) => {
      const res = await authApi.login(payload);
      if (res.status !== "ok" || !res.token || !res.user) {
        throw new Error(res.message || "Login failed");
      }
      setToken(res.token, remember);
      setStoredUser(res.user as User, remember);
      setUser(res.user as User);
      router.push("/admin/dashboard");
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore — clear locally regardless
    } finally {
      clearAuth();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.me();
      if (res.user) {
        setUser(res.user as User);
        setStoredUser(res.user as User, !!localStorage.getItem("pr_admin_remember"));
      }
    } catch {
      /* noop */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
