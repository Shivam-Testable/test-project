import { useState } from "react";

const API_URL = "/api/v1/auth/register";

export default function RegisterPage() {
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
        setMessage(data.message || "Registration failed");
        return;
      }

      setStatus("success");
      setMessage(data.message || "User registered successfully");
      setPassword("");
    } catch {
      setStatus("error");
      setMessage("Could not reach the register API. Is the backend running?");
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="register-heading">
        <h1 id="register-heading">Create account</h1>
        <p className="subtitle">Minimal register form for TESR-2 (Stage 1)</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Registering…" : "Register"}
          </button>
        </form>

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
