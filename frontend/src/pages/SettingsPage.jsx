import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authHeaders, clearSession, getToken } from "../lib/authStorage";

/** Notification preferences UI — TESR-16 (Stage 3). */
export default function SettingsPage() {
  const navigate = useNavigate();
  const token = getToken();
  const [loadStatus, setLoadStatus] = useState("loading");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [productTips, setProductTips] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    async function loadPrefs() {
      setLoadStatus("loading");
      setMessage("");
      try {
        const response = await fetch("/api/v1/users/me/preferences", {
          headers: { ...authHeaders() },
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
          setMessage(data.message || "Failed to load preferences");
          return;
        }
        setEmailAlerts(Boolean(data.preferences?.emailAlerts));
        setProductTips(Boolean(data.preferences?.productTips));
        setLoadStatus("success");
      } catch {
        if (cancelled) return;
        setLoadStatus("error");
        setMessage("Could not reach the preferences API.");
      }
    }

    loadPrefs();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  async function onSave(event) {
    event.preventDefault();
    setSaveStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/v1/users/me/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ emailAlerts, productTips }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSaveStatus("error");
        setMessage(data.message || "Failed to save preferences");
        return;
      }
      setEmailAlerts(Boolean(data.preferences?.emailAlerts));
      setProductTips(Boolean(data.preferences?.productTips));
      setSaveStatus("success");
      setMessage(data.message || "Preferences updated");
    } catch {
      setSaveStatus("error");
      setMessage("Could not reach the preferences API.");
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="settings-heading">
        <h1 id="settings-heading">Notification settings</h1>
        <p className="subtitle">Manage alerts and tips — TESR-16 (Stage 3)</p>

        {loadStatus === "loading" ? (
          <p className="banner success" role="status">
            Loading preferences…
          </p>
        ) : null}

        {loadStatus === "success" ? (
          <form className="form" onSubmit={onSave}>
            <label htmlFor="email-alerts">
              <input
                id="email-alerts"
                name="emailAlerts"
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: "auto", marginRight: "0.5rem" }}
              />
              Email alerts
            </label>

            <label htmlFor="product-tips" style={{ marginTop: "0.75rem" }}>
              <input
                id="product-tips"
                name="productTips"
                type="checkbox"
                checked={productTips}
                onChange={(e) => setProductTips(e.target.checked)}
                style={{ width: "auto", marginRight: "0.5rem" }}
              />
              Product tips
            </label>

            <button type="submit" disabled={saveStatus === "loading"} style={{ marginTop: "1rem" }}>
              {saveStatus === "loading" ? "Saving…" : "Save preferences"}
            </button>
          </form>
        ) : null}

        {saveStatus === "success" || (loadStatus === "error" && message) || saveStatus === "error" ? (
          <p
            className={`banner ${saveStatus === "success" ? "success" : "error"}`}
            role={saveStatus === "success" ? "status" : "alert"}
          >
            {message}
          </p>
        ) : null}

        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/home">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
