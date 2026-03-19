import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type UserState = { 
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
} | null;

interface AuthContextType {
  user: UserState;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: UserState) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  setUser: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // First try Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session && session.user) {
          const u = session.user;
          if (mounted) {
            setUser({
              username: u.user_metadata?.full_name || u.email || u.phone || "User",
              role: "customer", // Modify this if you pull roles via custom claims
              email: u.email,
              phone: u.phone,
              title: u.user_metadata?.title,
              firstName: u.user_metadata?.firstName,
              middleName: u.user_metadata?.middleName,
              lastName: u.user_metadata?.lastName,
              gender: u.user_metadata?.gender,
              dob: u.user_metadata?.dob,
              anniversary: u.user_metadata?.anniversary
            });
            setLoading(false);
          }
          return;
        }
      }

      // Fallback local storage
      const stored = localStorage.getItem("summitCurrentUser");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (mounted) {
            setUser(parsed);
          }
        } catch {
          // invalid json
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    };

    checkSession();

    let authListener: any = null;
    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session && session.user) {
          const u = session.user;
          if (mounted) {
            setUser({
              username: u.user_metadata?.full_name || u.email || u.phone || "User",
              role: "customer",
              email: u.email,
              phone: u.phone,
              title: u.user_metadata?.title,
              firstName: u.user_metadata?.firstName,
              middleName: u.user_metadata?.middleName,
              lastName: u.user_metadata?.lastName,
              gender: u.user_metadata?.gender,
              dob: u.user_metadata?.dob,
              anniversary: u.user_metadata?.anniversary
            });
          }
        } else {
          // User signed out, or session invalid
          // Clear it
          if (mounted) {
            setUser(null);
            localStorage.removeItem("summitCurrentUser");
          }
        }
        if (mounted) {
          setLoading(false);
        }
      });
      authListener = data.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("summitCurrentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
