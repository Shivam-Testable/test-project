import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  authHeaders,
  clearSession,
  getToken,
  setSession,
} from "../lib/authStorage";

/** Home dashboard + edit display name (TESR-8 Stage 2). */
export default function HomePage() {
  const navigate = useNavigate();
  const token = getToken();
  const [loadStatus, setLoadStatus] = useState("loading");
  const [welcome, setWelcome] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [logoutStatus, setLogoutStatus] = useState("idle");
  const [displayName, setDisplayName] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

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
        setDisplayName(data.user?.displayName || "");
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

  async function onSaveDisplayName(event) {
    event.preventDefault();
    setSaveStatus("loading");
    setSaveMessage("");
    try {
      const response = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ displayName }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSaveStatus("error");
        setSaveMessage(data.message || "Failed to update display name");
        return;
      }
      setUser(data.user);
      setWelcome(`Welcome back, ${data.user.displayName || data.user.email}`);
      setSession(token, data.user);
      setSaveStatus("success");
      setSaveMessage(data.message || "Display name updated");
    } catch {
      setSaveStatus("error");
      setSaveMessage("Could not reach the update display name API.");
    }
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
        <p className="subtitle">Post-login dashboard — TESR-8 edit display name</p>

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

            <form className="form" onSubmit={onSaveDisplayName} noValidate style={{ marginTop: "1.25rem" }}>
              <label htmlFor="display-name">Display name</label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                autoComplete="nickname"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                minLength={2}
                maxLength={80}
                required
              />
              <button type="submit" disabled={saveStatus === "loading"}>
                {saveStatus === "loading" ? "Saving…" : "Save display name"}
              </button>
            </form>

            {saveStatus === "success" ? (
              <p className="banner success" role="status">
                {saveMessage}
              </p>
            ) : null}
            {saveStatus === "error" ? (
              <p className="banner error" role="alert">
                {saveMessage}
              </p>
            ) : null}
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
