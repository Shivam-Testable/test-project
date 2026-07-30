import { Link } from "react-router-dom";

/**
 * Stage 4 route convention:
 *   /help  →  frontend/src/pages/help/HelpPage.jsx
 */
export default function HelpPage() {
  return (
    <main className="page">
      <section className="card" aria-labelledby="help-heading">
        <h1 id="help-heading">Help</h1>
        <p className="subtitle">Product help — TESR-18 (Stage 4 route /help)</p>
        <p role="status">
          Use Home for your dashboard, Settings for notification preferences, and Account
          pages for security and privacy.
        </p>
        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/home">Back to home</Link>
          {" · "}
          <Link to="/support/contact">Contact support</Link>
        </p>
      </section>
    </main>
  );
}
