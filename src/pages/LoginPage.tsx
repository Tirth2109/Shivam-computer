import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import type { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";

const REGISTERED_USERS_KEY = "shivam_registered_users";
const OTP_RESEND_COOLDOWN_MS = 60_000;
const LOCAL_ADMIN_USERNAME = "admin";
const LOCAL_ADMIN_PASSWORD = "shivam2026";

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
    setUser,
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

    const isLocalAdminLogin =
      email.toLowerCase() === LOCAL_ADMIN_USERNAME &&
      password === LOCAL_ADMIN_PASSWORD;

    if (supabaseEnabled) {
      if (loginMethod === "password" && isLocalAdminLogin) {
        setUser({
          username: LOCAL_ADMIN_USERNAME,
          role: "admin",
          email: "admin@local",
        });
        setSuccessStatus("Admin login successful. Redirecting to dashboard.");
        setTimeout(() => navigate("/admin"), 300);
        return;
      }

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

  const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-[#ecf3ff]";
  const inputClass =
    "w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3.5 py-2.5 text-base text-[#ecf3ff] placeholder:text-[#a8b6ca] outline-none transition focus:border-[#5ec7ff] focus:ring-2 focus:ring-[#5ec7ff4d]";
  const primaryButtonClass =
    "w-full rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff] disabled:cursor-not-allowed disabled:opacity-60";
  const outlineButtonClass =
    "rounded-full border border-[#2a3f5d] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#ecf3ff] transition hover:border-[#5ec7ff] hover:text-[#5ec7ff] disabled:cursor-not-allowed disabled:opacity-60";
  const authTabClass = (active: boolean) =>
    `w-full rounded-full border px-4 py-2.5 text-[0.95rem] font-semibold transition ${
      active
        ? "border-[#5ec7ff] bg-[#5ec7ff] text-[#050812] shadow-[0_0_0_1px_rgba(94,199,255,0.2)]"
        : "border-[#2a3f5d] bg-[#0f1625] text-[#d5deec] hover:border-[#5ec7ff] hover:text-[#5ec7ff]"
    }`;

  const orbStyles = [
    "left-[10%] top-[20%] h-[200px] w-[200px] bg-[rgba(94,199,255,0.5)] [animation-delay:0s]",
    "right-[15%] top-[60%] h-[150px] w-[150px] bg-[rgba(63,185,80,0.4)] [animation-delay:-2s]",
    "left-1/2 bottom-[10%] h-[180px] w-[180px] bg-[rgba(255,140,0,0.35)] [animation-delay:-4s]",
    "right-[40%] top-[15%] h-[120px] w-[120px] bg-[rgba(168,85,247,0.4)] [animation-delay:-6s]",
    "left-[30%] bottom-[40%] h-[100px] w-[100px] bg-[rgba(236,72,153,0.3)] [animation-delay:-1s]",
  ];

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-8" role="main">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,_#0a0e1a_0%,_#0f1629_25%,_#131c33_50%,_#0d1220_100%)]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 motion-safe:animate-[auth-grid-pulse_4s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(88, 166, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 166, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {orbStyles.map((orbClass, index) => (
          <div
            key={index}
            className={`absolute rounded-full opacity-40 blur-[60px] motion-safe:animate-[auth-orb-float_8s_ease-in-out_infinite] motion-reduce:animate-none ${orbClass}`}
          />
        ))}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const palette = ["rgba(88, 166, 255, 0.5)", "rgba(63, 185, 80, 0.5)", "rgba(255, 140, 0, 0.5)"];
            return (
              <span
                key={i}
                className="absolute h-2 w-2 rounded-[2px] motion-safe:animate-[auth-pixel-float_6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-30"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${5 + (i % 3)}s`,
                  background: palette[i % palette.length],
                  left: `${(i * 5) % 100}%`,
                  top: `${(i * 7) % 100}%`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[400px] rounded-[12px] border border-[#2a3f5d] bg-[#111b2c] p-8 text-left shadow-[0_2px_16px_rgba(0,0,0,0.35)] motion-safe:animate-[fadeInUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="mb-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={authTabClass(mode === "login")}
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
            className={authTabClass(mode === "signup")}
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
            <h1 className="mb-2 text-center text-2xl font-semibold text-[#ecf3ff]">Verify email</h1>
            <p className="mb-5 text-center text-[0.95rem] text-[#a8b6ca]">
              {verification.source === "signup"
                ? `Enter the code sent to ${verification.email} to complete signup.`
                : `Enter the code sent to ${verification.email} to login.`}
            </p>
            <form id="otp-form" onSubmit={handleVerifyOtp} noValidate className="mb-4 flex flex-col gap-4">
              <label htmlFor="otp-code" className={labelClass}>
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
                  className={inputClass}
                  onChange={(event) => setOtpToken(event.target.value.replace(/\D/g, "").slice(0, 8))}
                />
              </label>
              <button type="submit" className={primaryButtonClass} disabled={isBusy}>
                {isBusy ? "Verifying..." : "Verify code"}
              </button>
              <button
                type="button"
                className={`${outlineButtonClass} mt-3 w-full`}
                onClick={handleResendOtp}
                disabled={isBusy || secondsUntilResend > 0}
              >
                {secondsUntilResend > 0 ? `Resend in ${secondsUntilResend}s` : "Resend OTP"}
              </button>
            </form>
            <p className="m-0 text-center text-xs text-[#a8b6ca]">
              Wrong email?{" "}
              <button
                type="button"
                className="cursor-pointer bg-transparent p-0 text-inherit text-[#5ec7ff] transition hover:text-[#81d7ff]"
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
            <h1 className="mb-2 text-center text-2xl font-semibold text-[#ecf3ff]">Login</h1>
            <p className="mb-5 text-center text-[0.95rem] text-[#a8b6ca]">Sign in to continue to the Shivam Computer home page.</p>

            {supabaseEnabled && (
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  className={`${outlineButtonClass} flex-1 py-2 ${loginMethod === "password" ? "border-[#5ec7ff] text-[#5ec7ff] opacity-100" : "opacity-70"}`}
                  onClick={() => setLoginMethod("password")}
                >
                  Password
                </button>
                <button
                  type="button"
                  className={`${outlineButtonClass} flex-1 py-2 ${loginMethod === "otp" ? "border-[#5ec7ff] text-[#5ec7ff] opacity-100" : "opacity-70"}`}
                  onClick={() => setLoginMethod("otp")}
                >
                  Email OTP
                </button>
              </div>
            )}

            <form id="login-form" onSubmit={handleLogin} className="mb-4 flex flex-col gap-4">
              <label htmlFor="login-email-or-username" className={labelClass}>
                Email / Username
                <input
                  id="login-email-or-username"
                  type="text"
                  name="email"
                  autoComplete="username"
                  required
                  placeholder="Enter email or 'admin'"
                  className={inputClass}
                />
              </label>

              {(!supabaseEnabled || loginMethod === "password") && (
                <label htmlFor="login-password" className={labelClass}>
                  Password
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter password"
                    className={inputClass}
                  />
                </label>
              )}

              <button type="submit" className={primaryButtonClass} disabled={isBusy}>
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
            <h1 className="mb-2 text-center text-2xl font-semibold text-[#ecf3ff]">Sign up</h1>
            <p className="mb-5 text-center text-[0.95rem] text-[#a8b6ca]">
              Create an account and continue to the Shivam Computer home page.
            </p>
            <form id="signup-form" onSubmit={handleSignUp} className="mb-4 flex flex-col gap-4">
              <label htmlFor="signup-fullName" className={labelClass}>
                Full name
                <input
                  id="signup-fullName"
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  required
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </label>

              <label htmlFor="signup-email" className={labelClass}>
                Email
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </label>

              <label htmlFor="signup-password" className={labelClass}>
                Password
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  placeholder="Choose a password (min 6 characters)"
                  className={inputClass}
                />
              </label>

              <button type="submit" className={primaryButtonClass} disabled={isBusy}>
                {isBusy ? "Creating account..." : "Create account"}
              </button>
            </form>
          </>
        )}

        <p id="login-status" className="mb-4 min-h-6 text-center text-sm" style={{ color: statusColor }}>
          {status}
        </p>

        <p className="m-0 text-center text-xs text-[#a8b6ca]">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="cursor-pointer bg-transparent p-0 text-inherit text-[#5ec7ff] transition hover:text-[#81d7ff]"
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
                className="cursor-pointer bg-transparent p-0 text-inherit text-[#5ec7ff] transition hover:text-[#81d7ff]"
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

        <p className="mt-3 text-center text-xs text-[#a8b6ca]">
          <Link to="/" className="text-[#5ec7ff] transition hover:text-[#81d7ff]">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
