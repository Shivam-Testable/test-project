import { Link, Navigate } from "react-router-dom";
import { getToken } from "../../../lib/authStorage";

/**
 * Stage 4 route convention:
 *   /account/security  →  frontend/src/pages/account/security/SecurityPage.jsx
 */
export default function SecurityPage() {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="security-heading">
        <h1 id="security-heading">Account security</h1>
        <p className="subtitle">Security settings — TESR-19 (Stage 4 route /account/security)</p>
        <p role="status">
          Manage password and signed-in sessions from the links below.
        </p>
        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/change-password">Change password</Link>
          {" · "}
          <Link to="/sessions">Active sessions</Link>
          {" · "}
          <Link to="/account">Account overview</Link>
          {" · "}
          <Link to="/home">Home</Link>
        </p>
      </section>
    </main>
  );
}
