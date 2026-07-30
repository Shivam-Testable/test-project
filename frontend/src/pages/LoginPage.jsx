import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSession } from "../lib/authStorage";

const API_URL = "/api/v1/auth/login";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Login failed");
        return;
      }

      setSession(data.token, data.user);
      setStatus("success");
      setMessage(data.message || "Logged in successfully");
      navigate("/home");
    } catch {
      setStatus("error");
      setMessage("Could not reach the login API. Is the backend running?");
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="login-heading">
        <h1 id="login-heading">Log in</h1>
        <p className="subtitle">Combined login for TESR-3 (Stage 1)</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="subtitle" style={{ marginTop: "1rem" }}>
          No account? <Link to="/register">Create one</Link>
        </p>

        {status === "success" ? (
          <p className="banner success" role="status">
            {message}
          </p>
        ) : null}

        {status === "error" ? (
          <p className="banner error" role="alert">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
