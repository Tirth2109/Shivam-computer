import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import type { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";

const REGISTERED_USERS_KEY = "shivam_registered_users";
const OTP_RESEND_COOLDOWN_MS = 60_000;

type OtpVerificationState = {
  email: string;
  type: "signup" | "email";
  source: "signup" | "login";
  cooldownUntil: number;
};

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

function nextCooldown() {
  return Date.now() + OTP_RESEND_COOLDOWN_MS;
}

export default function LoginPage() {
  const supabaseEnabled = isSupabaseConfigured();
  const {
    user,
    loading: authLoading,
    signInWithPassword,
    signInWithOtp,
    verifyEmailOtp,
    resendSignUpOtp,
    signUp,
  } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("#0b1d40");
  const [isBusy, setIsBusy] = useState(false);

  const [verification, setVerification] = useState<OtpVerificationState | null>(null);
  const [otpToken, setOtpToken] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    // Signed-in users should land on home.
    navigate("/");
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!verification) return;
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [verification]);

  const clearVerification = () => {
    setVerification(null);
    setOtpToken("");
  };

  const setErrorStatus = (message: string) => {
    setStatus(message);
    setStatusColor("#dc2626");
  };

  const setSuccessStatus = (message: string) => {
    setStatus(message);
    setStatusColor("#059669");
  };

  const toFriendlyAuthError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Authentication request failed.";
    const lower = message.toLowerCase();

    if (lower.includes("error sending confirmation email")) {
      return "Supabase could not send confirmation email. Set up Custom SMTP in Supabase (Authentication -> Providers -> Email), or disable email confirmation temporarily for local testing.";
    }
    if (lower.includes("rate limit")) {
      return "Too many requests. Wait at least 60 seconds and try again. If this continues, increase Supabase Auth email/OTP rate limits and configure Custom SMTP.";
    }
    if (lower.includes("email_address_not_authorized")) {
      return "This email is not authorized by the default Supabase mailer. Use Custom SMTP or test with an authorized/team email.";
    }

    return message;
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (supabaseEnabled) {
      if (!email) {
        setErrorStatus("Please enter your email.");
        return;
      }

      if (loginMethod === "otp") {
        if (isBusy) return;
        setIsBusy(true);
        void (async () => {
          try {
            await signInWithOtp({ email, shouldCreateUser: false });
            setSuccessStatus(`We sent an OTP to ${email}. Enter it below to continue.`);
            setVerification({
              email,
              type: "email",
              source: "login",
              cooldownUntil: nextCooldown(),
            });
            setOtpToken("");
          } catch (e) {
            setErrorStatus(toFriendlyAuthError(e));
          } finally {
            setIsBusy(false);
          }
        })();
        return;
      }

      if (isBusy) return;
      setIsBusy(true);
      void (async () => {
        try {
          await signInWithPassword({ email, password });
          setSuccessStatus("Signed in! Redirecting to home.");
          setTimeout(() => navigate("/"), 400);
        } catch (e) {
          setErrorStatus(toFriendlyAuthError(e));
        } finally {
          setIsBusy(false);
        }
      })();
      return;
    }

    if (!email) {
      setErrorStatus("Please enter your email.");
      return;
    }

    const match = getAllUsers().find(
      (u) =>
        (u.email && u.email.toLowerCase() === email.toLowerCase()) ||
        (u.username && u.username.toLowerCase() === email.toLowerCase())
    );

    if (!match || match.password !== password) {
      setErrorStatus("Credentials do not match our records.");
      return;
    }

    localStorage.setItem(
      "summitCurrentUser",
      JSON.stringify({ username: match.username ?? email, role: match.role, email: match.email ?? email })
    );
    setSuccessStatus("Authenticated! Redirecting to home.");
    setTimeout(() => navigate("/"), 800);
  };

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const password = formData.get("password")?.toString() ?? "";
    const fullName = formData.get("fullName")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";

    if (!fullName) {
      setErrorStatus("Please enter your full name.");
      return;
    }
    if (!email) {
      setErrorStatus("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      setErrorStatus("Password must be at least 6 characters.");
      return;
    }

    if (supabaseEnabled) {
      if (isBusy) return;
      setIsBusy(true);
      void (async () => {
        try {
          const { requiresEmailVerification } = await signUp({ email, password, fullName });

          if (requiresEmailVerification) {
            setSuccessStatus(`Account created. Enter the OTP sent to ${email} to verify your email.`);
            setMode("login");
            setLoginMethod("otp");
            setVerification({
              email,
              type: "signup",
              source: "signup",
              cooldownUntil: nextCooldown(),
            });
            setOtpToken("");
          } else {
            setSuccessStatus("Account created and signed in. Redirecting to home.");
            setTimeout(() => navigate("/"), 400);
          }

          (event.currentTarget as HTMLFormElement).reset();
        } catch (e) {
          setErrorStatus(toFriendlyAuthError(e));
        } finally {
          setIsBusy(false);
        }
      })();
      return;
    }

    const all = getAllUsers();
    if (all.some((u) => (u.email ?? "").toLowerCase() === email.toLowerCase())) {
      setErrorStatus("Email already registered. Please login or use another email.");
      return;
    }

    const newUser: User = {
      username: email,
      email,
      password,
      role: "customer",
      fullName,
    };

    const registered = getRegisteredUsers();
    registered.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));

    setSuccessStatus("Account created! You can now sign in.");
    setMode("login");
    (event.currentTarget as HTMLFormElement).reset();
  };

  const handleVerifyOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!verification) {
      setErrorStatus("No OTP verification is currently pending.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const token = formData.get("otp")?.toString().trim() ?? "";

    if (!/^\d{6,8}$/.test(token)) {
      setErrorStatus("Please enter the OTP from email (6 to 8 digits).");
      return;
    }

    if (isBusy) return;
    setIsBusy(true);
    void (async () => {
      try {
        await verifyEmailOtp({
          email: verification.email,
          token,
          type: verification.type,
        });
        setSuccessStatus("Email verified successfully. Redirecting to home.");
        clearVerification();
        setTimeout(() => navigate("/"), 400);
      } catch (e) {
        setErrorStatus(toFriendlyAuthError(e));
      } finally {
        setIsBusy(false);
      }
    })();
  };

  const handleResendOtp = () => {
    if (!verification || isBusy) return;
    const secondsLeft = Math.ceil((verification.cooldownUntil - Date.now()) / 1000);
    if (secondsLeft > 0) return;

    setIsBusy(true);
    void (async () => {
      try {
        if (verification.type === "signup") {
          await resendSignUpOtp({ email: verification.email });
        } else {
          await signInWithOtp({ email: verification.email, shouldCreateUser: false });
        }
        setVerification((prev) =>
          prev
            ? {
                ...prev,
                cooldownUntil: nextCooldown(),
              }
            : prev
        );
        setSuccessStatus(`A new OTP has been sent to ${verification.email}.`);
      } catch (e) {
        setErrorStatus(toFriendlyAuthError(e));
      } finally {
        setIsBusy(false);
      }
    })();
  };

  const secondsUntilResend = verification
    ? Math.max(0, Math.ceil((verification.cooldownUntil - nowMs) / 1000))
    : 0;

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
              clearVerification();
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
              clearVerification();
            }}
          >
            Sign up
          </button>
        </div>

        {supabaseEnabled && verification ? (
          <>
            <h1>Verify email</h1>
            <p>
              {verification.source === "signup"
                ? `Enter the code sent to ${verification.email} to complete signup.`
                : `Enter the code sent to ${verification.email} to login.`}
            </p>
            <form id="otp-form" onSubmit={handleVerifyOtp} noValidate>
              <label htmlFor="otp-code">
                OTP code
                <input
                  id="otp-code"
                  type="text"
                  name="otp"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={8}
                  required
                  placeholder="Enter 6 to 8 digit OTP"
                  value={otpToken}
                  onChange={(event) => setOtpToken(event.target.value.replace(/\D/g, "").slice(0, 8))}
                />
              </label>
              <button type="submit" className="btn primary" style={{ width: "100%" }} disabled={isBusy}>
                {isBusy ? "Verifying..." : "Verify code"}
              </button>
              <button
                type="button"
                className="btn outline"
                style={{ width: "100%", marginTop: "0.75rem" }}
                onClick={handleResendOtp}
                disabled={isBusy || secondsUntilResend > 0}
              >
                {secondsUntilResend > 0 ? `Resend in ${secondsUntilResend}s` : "Resend OTP"}
              </button>
            </form>
            <p className="microcopy">
              Wrong email?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  clearVerification();
                  setStatus("");
                }}
              >
                Start again
              </button>
            </p>
          </>
        ) : mode === "login" ? (
          <>
            <h1>Login</h1>
            <p>Sign in to continue to the Shivam Computer home page.</p>

            {supabaseEnabled && (
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => setLoginMethod("password")}
                  style={{ opacity: loginMethod === "password" ? 1 : 0.7 }}
                >
                  Password
                </button>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => setLoginMethod("otp")}
                  style={{ opacity: loginMethod === "otp" ? 1 : 0.7 }}
                >
                  Email OTP
                </button>
              </div>
            )}

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

              {(!supabaseEnabled || loginMethod === "password") && (
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
              )}

              <button type="submit" className="btn primary" style={{ width: "100%" }} disabled={isBusy}>
                {supabaseEnabled && loginMethod === "otp"
                  ? isBusy
                    ? "Sending OTP..."
                    : "Send OTP"
                  : isBusy
                    ? "Signing in..."
                    : "Sign in"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Sign up</h1>
            <p>Create an account and continue to the Shivam Computer home page.</p>
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

              <button type="submit" className="btn primary" style={{ width: "100%" }} disabled={isBusy}>
                {isBusy ? "Creating account..." : "Create account"}
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
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setMode("signup");
                  clearVerification();
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setMode("login");
                  clearVerification();
                }}
              >
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
