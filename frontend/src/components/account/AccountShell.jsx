import { Link } from "react-router-dom";
import AccountNav from "./AccountNav";
import AccountSummary from "./AccountSummary";

/**
 * Stage 5 import graph:
 *   AccountPage → AccountShell → AccountNav + AccountSummary
 */
export default function AccountShell({ displayName, email }) {
  return (
    <section className="card" aria-labelledby="account-heading">
      <h1 id="account-heading">Account</h1>
      <p className="subtitle">Account shell — TESR-25 (Stage 5 import graph)</p>
      <AccountSummary displayName={displayName} email={email} />
      <AccountNav />
      <p className="subtitle" style={{ marginTop: "1rem" }}>
        <Link to="/home">Back to home</Link>
        {" · "}
        <Link to="/help">Help</Link>
      </p>
    </section>
  );
}
