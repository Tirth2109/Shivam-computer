import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import type { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";

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

function getAllUsers(): User[] {
  return [...users, ...getRegisteredUsers()];
}

export default function LoginPage() {
  const supabaseEnabled = isSupabaseConfigured();
  const { user, loading: authLoading, signInWithPassword, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("#0b1d40");
  const [otpMode, setOtpMode] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    // Admin page is allowed for any signed-in user in this app.
    navigate("/admin");
  }, [authLoading, navigate, user]);

  const handleSendOtp = (emailValue: string) => {
    if (!emailValue) {
      setStatus("Enter email first to send OTP.");
      setStatusColor("#dc2626");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(code);
    setOtpEmail(emailValue);
    setStatus(`OTP sent to ${emailValue}. (Demo code: ${code})`);
    setStatusColor("#059669");
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const otp = formData.get("otp")?.toString().trim() ?? "";

    if (otpMode) {
      const emailToCheck = email;
      if (!emailToCheck) {
        setStatus("Please enter your email for OTP login.");
        setStatusColor("#dc2626");
        return;
      }
      if (!sentOtp || otpEmail !== emailToCheck) {
        setStatus("Please request an OTP first.");
        setStatusColor("#dc2626");
        return;
      }
      if (otp !== sentOtp) {
        setStatus("Invalid OTP.");
        setStatusColor("#dc2626");
        return;
      }

      const match = getAllUsers().find((u) => {
        const userId = (u.email || u.username || "").toLowerCase();
        return userId === emailToCheck.toLowerCase();
      });
      if (!match) {
        setStatus("User not found for provided email/username.");
        setStatusColor("#dc2626");
        return;
      }

      localStorage.setItem(
        "summitCurrentUser",
        JSON.stringify({ username: match.username || emailToCheck, role: match.role, email: match.email || emailToCheck })
      );
      setStatus("OTP verified. Redirecting to admin...");
      setStatusColor("#059669");
      setTimeout(() => navigate("/admin"), 500);
      return;
    }

    if (supabaseEnabled) {
      if (!email) {
        setStatus("Please enter your email.");
        setStatusColor("#dc2626");
        return;
      }

      void (async () => {
        try {
          await signInWithPassword({ email, password });
          setStatus("Signed in! Redirecting to the admin.");
          setStatusColor("#059669");
          setTimeout(() => navigate("/admin"), 400);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to sign in";
          setStatus(msg);
          setStatusColor("#dc2626");
        }
      })();
      return;
    }

    if (!email) {
      setStatus("Please enter your email.");
      setStatusColor("#dc2626");
      return;
    }

    const match = getAllUsers().find(
      (u) =>
        (u.email && u.email.toLowerCase() === email.toLowerCase()) ||
        (u.username && u.username.toLowerCase() === email.toLowerCase())
    );

    if (!match || match.password !== password) {
      setStatus("Credentials do not match our records.");
      setStatusColor("#dc2626");
      return;
    }

    localStorage.setItem(
      "summitCurrentUser",
      JSON.stringify({ username: match.username ?? email, role: match.role, email: match.email ?? email })
    );
    setStatus("Authenticated! Redirecting to the admin.");
    setStatusColor("#059669");
    setTimeout(() => navigate("/admin"), 800);
  };

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const password = formData.get("password")?.toString() ?? "";
    const fullName = formData.get("fullName")?.toString().trim() ?? "";

    if (supabaseEnabled) {
      const email = formData.get("email")?.toString().trim() ?? "";
      if (!fullName) {
        setStatus("Please enter your full name.");
        setStatusColor("#dc2626");
        return;
      }
      if (!email) {
        setStatus("Please enter your email.");
        setStatusColor("#dc2626");
        return;
      }
      if (password.length < 6) {
        setStatus("Password must be at least 6 characters.");
        setStatusColor("#dc2626");
        return;
      }

      void (async () => {
        try {
          await signUp({ email, password, fullName });
          setStatus(
            "Account created! Now sign in. (If email confirmation is enabled, please confirm first.)"
          );
          setStatusColor("#059669");
          setMode("login");
          (event.currentTarget as HTMLFormElement).reset();
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to sign up";
          setStatus(msg);
          setStatusColor("#dc2626");
        }
      })();
      return;
    }

    const email = formData.get("email")?.toString().trim() ?? "";

    if (!email) {
      setStatus("Please enter your email.");
      setStatusColor("#dc2626");
      return;
    }
    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      setStatusColor("#dc2626");
      return;
    }
    if (!fullName.trim()) {
      setStatus("Please enter your full name.");
      setStatusColor("#dc2626");
      return;
    }

    const all = getAllUsers();
    if (
      all.some(
        (u) => (u.email ?? "").toLowerCase() === email.toLowerCase()
      )
    ) {
      setStatus("Email already registered. Please login or use another email.");
      setStatusColor("#dc2626");
      return;
    }

    const newUser: User = {
      username: email,
      email: email,
      password,
      role: "customer",
      fullName,
    };

    const registered = getRegisteredUsers();
    registered.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));

    setStatus("Account created! You can now sign in.");
    setStatusColor("#059669");
    setMode("login");
    (event.currentTarget as HTMLFormElement).reset();
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
            <span
              key={i}
              className="auth-bg-pixel"
              style={{
                animationDelay: `${i * 0.3}s`,
                left: `${(i * 5) % 100}%`,
                top: `${(i * 7) % 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setStatus("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setStatus("");
            }}
          >
            Sign up
          </button>
        </div>

        {mode === "login" ? (
          <>
            <h1>Login</h1>
            <p>Sign in to access the Shivam Computer admin dashboard.</p>
            <form id="login-form" onSubmit={handleLogin}>
              <label htmlFor="login-email-or-username">
                Email
                <input
                  id="login-email-or-username"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                />
              </label>

              {!otpMode ? (
                <label htmlFor="login-password">
                  Password
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter password"
                  />
                </label>
              ) : (
                <>
                  <label htmlFor="login-otp">
                    OTP
                    <input
                      id="login-otp"
                      type="text"
                      name="otp"
                      autoComplete="one-time-code"
                      pattern="\\d{6}"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit OTP"
                    />
                  </label>

                  <div style={{ marginBottom: "1rem" }}>
                    <button
                      type="button"
                      className="btn outline"
                      onClick={() => {
                        const emailField = (document.getElementById("login-email-or-username") as HTMLInputElement)?.value?.trim();
                        handleSendOtp(emailField);
                      }}
                    >
                      Send OTP
                    </button>
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", margin: "0.25rem 0" }}>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => {
                    setOtpMode((prev) => !prev);
                    setStatus("");
                  }}
                >
                  {otpMode ? "Use Password" : "Use OTP"}
                </button>
                {otpMode && sentOtp && otpEmail && (
                  <span style={{ color: "#059669", fontSize: "0.85rem" }}>
                    OTP sent to {otpEmail} (demo)
                  </span>
                )}
              </div>

              <button type="submit" className="btn primary" style={{ width: "100%" }}>
                Sign in
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Sign up</h1>
            <p>Create an account to access the Shivam Computer admin dashboard.</p>
            <form id="signup-form" onSubmit={handleSignUp}>
              <label htmlFor="signup-fullName">
                Full name
                <input
                  id="signup-fullName"
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  required
                  placeholder="Enter your full name"
                />
              </label>

              <label htmlFor="signup-email">
                Email
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                />
              </label>

              <label htmlFor="signup-password">
                Password
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  placeholder="Choose a password (min 6 characters)"
                />
              </label>

              <button type="submit" className="btn primary" style={{ width: "100%" }}>
                Create account
              </button>
            </form>
          </>
        )}

        <p id="login-status" className="status-message" style={{ color: statusColor }}>
          {status}
        </p>

        <p className="microcopy">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button type="button" className="link-btn" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link-btn" onClick={() => setMode("login")}>
                Login
              </button>
            </>
          )}
        </p>

        <p className="microcopy">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}

