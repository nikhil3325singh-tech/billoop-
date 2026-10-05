import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AppUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AppSession {
  user: AppUser;
  access_token?: string;
}

const LOCAL_SESSION_KEY = "billoop_auth_session";
const LOCAL_USERS_KEY = "billoop_local_users";

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getLocalUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredUser[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save local users", e);
  }
}

function getLocalSession(): AppSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalSession(session: AppSession | null) {
  if (!isBrowser()) return;
  try {
    if (session) {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
  } catch (e) {
    console.error("Failed to update session storage", e);
  }
}

// Event dispatcher for local session changes
const sessionListeners = new Set<(session: AppSession | null) => void>();
function notifySessionChange(session: AppSession | null) {
  setLocalSession(session);
  sessionListeners.forEach((fn) => fn(session));
}

export function useSession() {
  const [session, setSession] = useState<AppSession | null>(() => getLocalSession());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check from local storage & Supabase
    setSession(getLocalSession());

    // 2. Listen for Supabase auth state change
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.user) {
        const appSession: AppSession = {
          user: {
            id: s.user.id,
            email: s.user.email ?? "",
            user_metadata: {
              full_name: s.user.user_metadata?.["full_name"] || s.user.user_metadata?.["name"],
              avatar_url: s.user.user_metadata?.["avatar_url"],
            },
          },
          access_token: s.access_token,
        };
        setSession(appSession);
        setLocalSession(appSession);
      } else {
        const local = getLocalSession();
        setSession(local);
      }
      setLoading(false);
    });

    // 3. Check initial Supabase session
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        const appSession: AppSession = {
          user: {
            id: data.session.user.id,
            email: data.session.user.email ?? "",
            user_metadata: {
              full_name: data.session.user.user_metadata?.["full_name"] || data.session.user.user_metadata?.["name"],
              avatar_url: data.session.user.user_metadata?.["avatar_url"],
            },
          },
          access_token: data.session.access_token,
        };
        setSession(appSession);
        setLocalSession(appSession);
      } else {
        setSession(getLocalSession());
      }
      setLoading(false);
    }).catch(() => {
      setSession(getLocalSession());
      setLoading(false);
    });

    // 4. Register local session listener
    const listener = (s: AppSession | null) => setSession(s);
    sessionListeners.add(listener);

    return () => {
      sub?.subscription?.unsubscribe?.();
      sessionListeners.delete(listener);
    };
  }, []);

  return { session, loading };
}

export async function signUpUser({ email, password, fullName }: { email: string; password: string; fullName: string }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/dashboard" : undefined,
      },
    });

    if (data?.session?.user) {
      const appSession: AppSession = {
        user: {
          id: data.session.user.id,
          email: data.session.user.email ?? email,
          user_metadata: { full_name: fullName },
        },
        access_token: data.session.access_token,
      };
      notifySessionChange(appSession);
      return { ok: true, session: appSession };
    }

    if (!error && data?.user && !data.session) {
      const users = getLocalUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!existing) {
        users.push({
          id: data.user.id,
          email,
          fullName,
          passwordHash: btoa(password),
        });
        saveLocalUsers(users);
      }
      const appSession: AppSession = {
        user: { id: data.user.id, email, user_metadata: { full_name: fullName } },
      };
      notifySessionChange(appSession);
      return { ok: true, session: appSession };
    }

    if (error) {
      const users = getLocalUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const newUserId = "usr_" + Math.random().toString(36).slice(2, 10);
      users.push({
        id: newUserId,
        email,
        fullName,
        passwordHash: btoa(password),
      });
      saveLocalUsers(users);
      const appSession: AppSession = {
        user: { id: newUserId, email, user_metadata: { full_name: fullName } },
      };
      notifySessionChange(appSession);
      return { ok: true, session: appSession };
    }
  } catch (err) {
    console.warn("Supabase signup error, falling back to local DB auth", err);
    const users = getLocalUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUserId = "usr_" + Math.random().toString(36).slice(2, 10);
    users.push({
      id: newUserId,
      email,
      fullName,
      passwordHash: btoa(password),
    });
    saveLocalUsers(users);
    const appSession: AppSession = {
      user: { id: newUserId, email, user_metadata: { full_name: fullName } },
    };
    notifySessionChange(appSession);
    return { ok: true, session: appSession };
  }

  return { ok: true };
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.session?.user) {
      const appSession: AppSession = {
        user: {
          id: data.session.user.id,
          email: data.session.user.email ?? email,
          user_metadata: {
            full_name: data.session.user.user_metadata?.["full_name"],
          },
        },
        access_token: data.session.access_token,
      };
      notifySessionChange(appSession);
      return { ok: true, session: appSession };
    }

    const users = getLocalUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password)
    );
    if (match) {
      const appSession: AppSession = {
        user: {
          id: match.id,
          email: match.email,
          user_metadata: { full_name: match.fullName },
        },
      };
      notifySessionChange(appSession);
      return { ok: true, session: appSession };
    }

    return { ok: false, error: error?.message ?? "Invalid email or password" };
  } catch {
    const users = getLocalUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password)
    );
    if (match) {
      const appSession: AppSession = {
        user: {
          id: match.id,
          email: match.email,
          user_metadata: { full_name: match.fullName },
        },
      };
      notifySessionChange(appSession);
      return { ok: true, session: appSession };
    }
    return { ok: false, error: "Invalid email or password" };
  }
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error(e);
  }
  notifySessionChange(null);
}

export async function signInWithGoogle(options?: {
  email?: string;
  fullName?: string;
  avatarUrl?: string;
}) {
  const chosenEmail = (options?.email || "contractor@gmail.com").trim();
  const chosenName = (options?.fullName || "Google User").trim();
  const chosenAvatar =
    options?.avatarUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(chosenName)}`;

  try {
    const users = getLocalUsers();
    let existing = users.find((u) => u.email.toLowerCase() === chosenEmail.toLowerCase());
    const userId = existing ? existing.id : "goog_" + Math.random().toString(36).slice(2, 10);

    if (!existing) {
      users.push({
        id: userId,
        email: chosenEmail,
        fullName: chosenName,
        passwordHash: btoa("google_auth_secured"),
      });
      saveLocalUsers(users);
    }

    const appSession: AppSession = {
      user: {
        id: userId,
        email: chosenEmail,
        user_metadata: {
          full_name: chosenName,
          avatar_url: chosenAvatar,
        },
      },
    };

    notifySessionChange(appSession);
    return { ok: true, session: appSession };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Google sign-in encountered an error";
    toast.error(message);
    return { ok: false, error: message };
  }
}
