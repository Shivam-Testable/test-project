import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { authHeaders, getToken } from "../lib/authStorage";

/** Change password — TESR-14 (Stage 3). */
export default function ChangePasswordPage() {
  const token = getToken();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Failed to change password");
        return;
      }
      setStatus("success");
      setMessage(data.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setStatus("error");
      setMessage("Could not reach the change password API.");
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="change-password-heading">
        <h1 id="change-password-heading">Change password</h1>
        <p className="subtitle">Update credentials while signed in — TESR-14 (Stage 3)</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label htmlFor="current-password">Current password</label>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Saving…" : "Change password"}
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

        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/home">Back to home</Link>
        </p>
      </section>
    </main>
  );
}
