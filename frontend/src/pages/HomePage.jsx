import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authHeaders, clearSession, getToken } from "../lib/authStorage";

/** Home dashboard UI — TESR-6 (uses TESR-5 API). Logout from TESR-4. */
export default function HomePage() {
  const navigate = useNavigate();
  const token = getToken();
  const [loadStatus, setLoadStatus] = useState("loading");
  const [welcome, setWelcome] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [logoutStatus, setLogoutStatus] = useState("idle");

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    async function loadHome() {
      setLoadStatus("loading");
      setError("");
      try {
        const response = await fetch("/api/v1/home", {
          headers: {
            ...authHeaders(),
          },
        });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (!response.ok) {
          if (response.status === 401) {
            clearSession();
            navigate("/login");
            return;
          }
          setLoadStatus("error");
          setError(data.message || "Failed to load home dashboard");
          return;
        }
        setWelcome(data.welcome || "Welcome");
        setUser(data.user || null);
        setLoadStatus("success");
      } catch {
        if (cancelled) return;
        setLoadStatus("error");
        setError("Could not reach the home API. Is the backend running?");
      }
    }

    loadHome();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  async function onLogout() {
    setLogoutStatus("loading");
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });
    } catch {
      // clear local session either way
    }
    clearSession();
    navigate("/login");
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="home-heading">
        <h1 id="home-heading">Home</h1>
        <p className="subtitle">Post-login dashboard for TESR-6 (Stage 1)</p>

        {loadStatus === "loading" ? (
          <p className="banner success" role="status">
            Loading dashboard…
          </p>
        ) : null}

        {loadStatus === "success" ? (
          <div>
            <p className="banner success" role="status">
              {welcome}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Display name:</strong> {user?.displayName || "—"}
            </p>
          </div>
        ) : null}

        {loadStatus === "error" ? (
          <p className="banner error" role="alert">
            {error}
          </p>
        ) : null}

        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/login">Back to login</Link>
        </p>

        <button type="button" onClick={onLogout} disabled={logoutStatus === "loading"}>
          {logoutStatus === "loading" ? "Logging out…" : "Log out"}
        </button>
      </section>
    </main>
  );
}
