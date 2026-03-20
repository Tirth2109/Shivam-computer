import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export type UserState = {
  username: string;
  role: string;
  email?: string;
  phone?: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  anniversary?: string;
};

type AuthContextValue = {
  user: UserState | null;
  session: Session | null;
  loading: boolean;
  signInWithPassword: (args: { email: string; password: string }) => Promise<void>;
  signUp: (args: { email: string; password: string; fullName?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserState | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const middleName = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";
  return { firstName, middleName, lastName };
}

function supabaseUserToState(u: SupabaseUser): UserState {
  const metadata = (u.user_metadata ?? {}) as Record<string, unknown>;

  const fullName =
    (metadata.fullName as string | undefined) ??
    (metadata.full_name as string | undefined) ??
    (metadata.username as string | undefined) ??
    "";

  const role = (metadata.role as string | undefined) ?? "customer";

  const derivedName =
    fullName.trim() !== "" ? splitFullName(fullName) : { firstName: "", middleName: "", lastName: "" };

  return {
    username: fullName.trim() !== "" ? fullName : u.email ?? "User",
    role,
    email: u.email ?? undefined,
    phone: (u as any).phone ?? undefined,
    title: (metadata.title as string | undefined) ?? undefined,
    firstName: (metadata.firstName as string | undefined) ?? derivedName.firstName ?? undefined,
    middleName: (metadata.middleName as string | undefined) ?? derivedName.middleName ?? undefined,
    lastName: (metadata.lastName as string | undefined) ?? derivedName.lastName ?? undefined,
    gender: (metadata.gender as string | undefined) ?? undefined,
    dob: (metadata.dob as string | undefined) ?? undefined,
    anniversary: (metadata.anniversary as string | undefined) ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configured) {
      const stored = localStorage.getItem("summitCurrentUser");
      if (stored) {
        try {
          setUser(JSON.parse(stored) as UserState);
        } catch {
          setUser(null);
        }
      }
      setSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    void supabase
      ?.auth.getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
        setUser(data.session?.user ? supabaseUserToState(data.session.user) : null);
        if (data.session?.user) {
          const nextUser = supabaseUserToState(data.session.user);
          localStorage.setItem("summitCurrentUser", JSON.stringify(nextUser));
        } else {
          localStorage.removeItem("summitCurrentUser");
        }
      })
      .catch(() => {
        setSession(null);
        setUser(null);
        localStorage.removeItem("summitCurrentUser");
      })
      .finally(() => setLoading(false));

    const { data: subscriptionData } = supabase!.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
        if (newSession?.user) {
          const nextUser = supabaseUserToState(newSession.user);
          setUser(nextUser);
          localStorage.setItem("summitCurrentUser", JSON.stringify(nextUser));
        } else {
          setUser(null);
          localStorage.removeItem("summitCurrentUser");
        }
      }
    );

    return () => {
      subscriptionData.subscription.unsubscribe();
    };
  }, [configured]);

  const value: AuthContextValue = useMemo(() => {
    return {
      user,
      session,
      loading,
      signInWithPassword: async ({ email, password }) => {
        if (!supabase) throw new Error("Supabase not configured");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signUp: async ({ email, password, fullName }) => {
        if (!supabase) throw new Error("Supabase not configured");
        const name = (fullName ?? "").trim();
        const split = splitFullName(name);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName: name,
              firstName: split.firstName,
              middleName: split.middleName,
              lastName: split.lastName,
              role: "customer",
            },
          },
        });
        if (error) throw error;
      },
      signOut: async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        localStorage.removeItem("summitCurrentUser");
        setUser(null);
        setSession(null);
      },
      logout: async () => {
        // Backwards-compatible alias used by some older components.
        await value.signOut();
      },
      setUser: (next) => {
        setUser(next);
        if (!next) {
          localStorage.removeItem("summitCurrentUser");
          return;
        }
        localStorage.setItem("summitCurrentUser", JSON.stringify(next));

        // Best-effort: persist updated profile data into Supabase metadata.
        if (configured && supabase) {
          void supabase.auth
            .updateUser({
              data: {
                fullName: next.username,
                role: next.role,
                title: next.title ?? null,
                firstName: next.firstName ?? null,
                middleName: next.middleName ?? null,
                lastName: next.lastName ?? null,
                gender: next.gender ?? null,
                dob: next.dob ?? null,
                anniversary: next.anniversary ?? null,
              },
            })
            .catch(() => {
              // Ignore profile update failures for now (RLS/metadata rules may vary).
            });
        }
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, loading, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
