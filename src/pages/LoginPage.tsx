import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import type { User } from "../types";

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
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("#0b1d40");
  const navigate = useNavigate();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const match = getAllUsers().find(
      (user) => user.username === username && user.password === password
    );
    if (!match) {
      setStatus("Credentials do not match our records.");
      setStatusColor("#dc2626");
      return;
    }

    localStorage.setItem(
      "summitCurrentUser",
      JSON.stringify({ username: match.username, role: match.role })
    );
    setStatus("Authenticated! Redirecting to the admin.");
    setStatusColor("#059669");
    setTimeout(() => {
      navigate("/admin");
    }, 800);
  };

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const fullName = formData.get("fullName")?.toString().trim() ?? "";

    if (username.length < 3) {
      setStatus("Username must be at least 3 characters.");
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
    if (all.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      setStatus("Username already taken. Please choose another.");
      setStatusColor("#dc2626");
      return;
    }

    const newUser: User = {
      username,
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
    (form as HTMLFormElement).reset();
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
              <label htmlFor="login-username">
                Username
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder="Enter username"
                />
              </label>
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
              <label htmlFor="signup-username">
                Username
                <input
                  id="signup-username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder="Choose a username"
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

        <p
          id="login-status"
          className="status-message"
          style={{ color: statusColor }}
        >
          {status}
        </p>
        <p className="microcopy">
          {mode === "login" ? (
            <>Don&apos;t have an account? <button type="button" className="link-btn" onClick={() => setMode("signup")}>Sign up</button></>
          ) : (
            <>Already have an account? <button type="button" className="link-btn" onClick={() => setMode("login")}>Login</button></>
          )}
        </p>
        <p className="microcopy">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
