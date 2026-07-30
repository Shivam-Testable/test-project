import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authHeaders, clearSession, getToken } from "../lib/authStorage";

/** Active sessions list + revoke — TESR-13 (Stage 3). */
export default function SessionsPage() {
  const navigate = useNavigate();
  const token = getToken();
  const [status, setStatus] = useState("loading");
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadSessions() {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/v1/auth/sessions", {
        headers: { ...authHeaders() },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          navigate("/login");
          return;
        }
        setStatus("error");
        setError(data.message || "Failed to load sessions");
        return;
      }
      setSessions(data.sessions || []);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Could not reach the sessions API.");
    }
  }

  useEffect(() => {
    if (!token) return;
    loadSessions();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  async function onRevoke(sessionId, isCurrent) {
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/v1/auth/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message || "Failed to revoke session");
        return;
      }
      if (isCurrent) {
        clearSession();
        navigate("/login");
        return;
      }
      setMessage("Session revoked");
      await loadSessions();
    } catch {
      setError("Could not revoke session.");
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="sessions-heading">
        <h1 id="sessions-heading">Active sessions</h1>
        <p className="subtitle">Manage signed-in devices — TESR-13 (Stage 3)</p>

        {status === "loading" ? (
          <p className="banner success" role="status">
            Loading sessions…
          </p>
        ) : null}

        {status === "success" ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sessions.map((session) => (
              <li
                key={session.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <p>
                  <strong>{session.label}</strong>
                  {session.current ? " (current)" : ""}
                </p>
                <p className="subtitle" style={{ marginBottom: "0.5rem" }}>
                  Started {new Date(session.createdAt).toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={() => onRevoke(session.id, session.current)}
                >
                  Revoke session
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {message ? (
          <p className="banner success" role="status">
            {message}
          </p>
        ) : null}
        {error || status === "error" ? (
          <p className="banner error" role="alert">
            {error || "Failed to load sessions"}
          </p>
        ) : null}

        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/home">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
