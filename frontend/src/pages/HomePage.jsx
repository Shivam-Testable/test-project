import { Link, Navigate } from "react-router-dom";
import { getStoredUser, getToken } from "../lib/authStorage";

/** Minimal post-login landing for TESR-3; dashboard content comes in TESR-6. */
export default function HomePage() {
  const token = getToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace />;
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
      </section>
    </main>
  );
}
