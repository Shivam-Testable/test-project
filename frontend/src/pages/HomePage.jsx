import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authHeaders, clearSession, getStoredUser, getToken } from "../lib/authStorage";

/** Post-login landing; logout control added in TESR-4. Dashboard API in TESR-5/6. */
export default function HomePage() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getStoredUser();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  async function onLogout() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });
      const data = await response.json().catch(() => ({}));
      clearSession();
      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Logout failed on server; local session cleared");
      }
      navigate("/login");
    } catch {
      clearSession();
      navigate("/login");
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="home-heading">
        <h1 id="home-heading">Home</h1>
        <p className="banner success" role="status">
          Logged in as {user?.email || "user"}
        </p>
        <p className="subtitle">
          Dashboard details will load here in TESR-6.{" "}
          <Link to="/login">Back to login</Link>
        </p>

        <button type="button" onClick={onLogout} disabled={status === "loading"}>
          {status === "loading" ? "Logging out…" : "Log out"}
        </button>

        {status === "error" ? (
          <p className="banner error" role="alert">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
