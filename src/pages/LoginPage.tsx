import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import type { User } from "../types";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const REGISTERED_USERS_KEY = "shivam_registered_users";

function getRegisteredUsers(): User[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as User[];
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // ignore
  }
  return [];
}

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState("");
  const [isEmailType, setIsEmailType] = useState(true);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("#0b1d40");
  
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/account");
    }
  }, [user, navigate]);

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const id = formData.get("identifier")?.toString().trim() ?? "";

    if (id.length < 3) {
      setStatus("Please enter a valid Email or Phone Number.");
      setStatusColor("#dc2626");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
    setIdentifier(id);
    setIsEmailType(isEmail);

    if (isSupabaseConfigured() && supabase) {
      setStatus("Sending OTP code...");
      setStatusColor("#0b1d40");
      
      const { error } = await supabase.auth.signInWithOtp(
        isEmail ? { email: id } : { phone: id }
      );

      if (error) {
        setStatus(error.message);
        setStatusColor("#dc2626");
        return;
      }
      
      setStatus("Code sent! Check your inbox or messages.");
      setStatusColor("#059669");
      setStep(2);
      return;
    }

    // Mock Fallback
    setStatus("Mock mode: Pretend an OTP was sent. Use code '123456' to verify.");
    setStatusColor("#059669");
    setStep(2);
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const token = formData.get("token")?.toString().trim() ?? "";

    if (token.length < 6) {
      setStatus("Please enter the 6-digit code.");
      setStatusColor("#dc2626");
      return;
    }

    if (isSupabaseConfigured() && supabase) {
      setStatus("Verifying code...");
      setStatusColor("#0b1d40");

      const { error } = await supabase.auth.verifyOtp({
        email: isEmailType ? identifier : undefined,
        phone: !isEmailType ? identifier : undefined,
        token,
        type: isEmailType ? 'email' : 'sms',
      });

      if (error) {
        setStatus(error.message);
        setStatusColor("#dc2626");
        return;
      }

      // Successful Supabase auth will be caught by AuthContext listener, 
      // but we can manually set user or let context handle it.
      setStatus("Authenticated! Redirecting...");
      setStatusColor("#059669");
      return;
    }

    // Mock Fallback
    if (token !== "123456") {
      setStatus("Invalid mock code. Try 123456.");
      setStatusColor("#dc2626");
      return;
    }

    // Create or find mock user
    const registered = getRegisteredUsers();
    let match = [...users, ...registered].find(
      (u) => 
        (u.username && u.username.toLowerCase() === identifier.toLowerCase()) || 
        (u.email && u.email === identifier) || 
        (u.phone && u.phone === identifier)
    );

    if (!match) {
      match = { 
        username: identifier, 
        email: isEmailType ? identifier : undefined, 
        phone: !isEmailType ? identifier : undefined, 
        role: "customer" 
      };
      registered.push(match);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    }

    const newUserProfile = { 
      username: match.fullName || match.username || identifier, 
      role: match.role,
      email: match.email,
      phone: match.phone
    };
    localStorage.setItem("summitCurrentUser", JSON.stringify(newUserProfile));
    setUser(newUserProfile);
    
    setStatus("Authenticated! Redirecting...");
    setStatusColor("#059669");
    setTimeout(() => {
      navigate(match.role === "admin" ? "/admin" : "/account");
    }, 800);
  };

  return (
    <main className="auth-page auth-page-standalone auth-page-game-bg" role="main">
      <div className="auth-bg-game" aria-hidden="true">
        <div className="auth-bg-grid" />
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-orb auth-bg-orb-3" />
        <div className="auth-bg-orb auth-bg-orb-4" />
        <div className="auth-bg-orb auth-bg-orb-5" />
        <div className="auth-bg-pixels">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="auth-bg-pixel" style={{ animationDelay: `${i * 0.3}s`, left: `${(i * 5) % 100}%`, top: `${(i * 7) % 100}%` }} />
          ))}
        </div>
      </div>
      <div className="auth-card">
        {step === 1 ? (
          <>
            <h1 style={{ marginBottom: "0.5rem" }}>Sign in / Sign up</h1>
            <p>Access your Shivam Computer account with a single code.</p>
            <form id="otp-send-form" onSubmit={handleSendOtp} style={{ marginTop: "1.5rem" }}>
              <label htmlFor="login-identifier">
                Email or Phone Number
                <input
                  id="login-identifier"
                  type="text"
                  name="identifier"
                  autoComplete="username"
                  required
                  placeholder="Enter email or phone number"
                />
              </label>
              
              <button type="submit" className="btn primary" style={{ width: "100%", marginTop: "1rem" }}>
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ marginBottom: "0.5rem" }}>Verify Code</h1>
            <p>Enter the 6-digit code sent to <strong>{identifier}</strong></p>
            <form id="otp-verify-form" onSubmit={handleVerifyOtp} style={{ marginTop: "1.5rem" }}>
              <label htmlFor="otp-token">
                Authentication Code
                <input
                  id="otp-token"
                  type="text"
                  name="token"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="123456"
                  style={{ letterSpacing: "0.25rem", textAlign: "center", fontSize: "1.2rem", padding: "1rem" }}
                />
              </label>
              <button type="submit" className="btn primary" style={{ width: "100%", marginTop: "1rem" }}>
                Verify & Login
              </button>
            </form>
            <button 
              className="btn outline" 
              style={{ width: "100%", marginTop: "0.75rem", border: "none", background: "transparent", color: "var(--text-muted)" }}
              onClick={() => { setStep(1); setStatus(""); }}
            >
              ← Back to Email/Phone
            </button>
          </>
        )}

        <p
          id="login-status"
          className="status-message"
          style={{ color: statusColor, marginTop: "1.5rem" }}
        >
          {status}
        </p>
        
        <p className="microcopy" style={{ marginTop: "1rem" }}>
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
