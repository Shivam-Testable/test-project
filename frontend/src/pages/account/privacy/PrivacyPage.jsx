import { Link, Navigate } from "react-router-dom";
import { getToken } from "../../../lib/authStorage";

/**
 * Stage 4 route convention:
 *   /account/privacy  →  frontend/src/pages/account/privacy/PrivacyPage.jsx
 */
export default function PrivacyPage() {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="privacy-heading">
        <h1 id="privacy-heading">Privacy</h1>
        <p className="subtitle">Privacy notes — TESR-20 (Stage 4 route /account/privacy)</p>
        <p role="status">
          We store your account profile and preferences to provide this demo app. You can update
          your display name and notification settings from Home and Settings.
        </p>
        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/account">Account overview</Link>
          {" · "}
          <Link to="/settings">Notification settings</Link>
          {" · "}
          <Link to="/home">Home</Link>
        </p>
      </section>
    </main>
  );
}
