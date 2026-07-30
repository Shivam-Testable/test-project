import { Link, Navigate } from "react-router-dom";
import { getStoredUser, getToken } from "../../lib/authStorage";

/**
 * Stage 4 route convention:
 *   /account  →  frontend/src/pages/account/AccountPage.jsx
 */
export default function AccountPage() {
  const token = getToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="account-heading">
        <h1 id="account-heading">Account</h1>
        <p className="subtitle">Account overview — TESR-22 (Stage 4 route /account)</p>
        <p role="status">
          Signed in as {user?.displayName || user?.email || "user"}. Choose a section below.
        </p>
        <ul style={{ paddingLeft: "1.1rem" }}>
          <li>
            <Link to="/account/security">Security</Link>
          </li>
          <li>
            <Link to="/account/privacy">Privacy</Link>
          </li>
          <li>
            <Link to="/settings">Notification settings</Link>
          </li>
          <li>
            <Link to="/sessions">Active sessions</Link>
          </li>
          <li>
            <Link to="/change-password">Change password</Link>
          </li>
        </ul>
        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/home">Back to home</Link>
          {" · "}
          <Link to="/help">Help</Link>
        </p>
      </section>
    </main>
  );
}
