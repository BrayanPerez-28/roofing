import type { User } from "./types";

const TOKEN_KEY = "pr_admin_token";
const USER_KEY = "pr_admin_user";
const REMEMBER_KEY = "pr_admin_remember";

// ─── Token Management ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY) ||
    null
  );
}

export function setToken(token: string, remember: boolean): void {
  if (typeof window === "undefined") return;
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, "true");
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

// ─── User Management ───────────────────────────────────────────────────────────

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User, remember: boolean): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(USER_KEY, serialized);
  } else {
    sessionStorage.setItem(USER_KEY, serialized);
  }
}

export function removeStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

// ─── Auth State ────────────────────────────────────────────────────────────────

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function clearAuth(): void {
  removeToken();
  removeStoredUser();
}
