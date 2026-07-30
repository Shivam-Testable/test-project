import { Link } from "react-router-dom";

/** Stage 5 local import target — used by HomePage. */
export default function QuickLinksWidget() {
  return (
    <section aria-labelledby="quick-links-heading" style={{ marginBottom: "1rem" }}>
      <h2 id="quick-links-heading">Quick links</h2>
      <p className="subtitle">
        <Link to="/account">Account</Link>
        {" · "}
        <Link to="/help">Help</Link>
        {" · "}
        <Link to="/settings">Settings</Link>
      </p>
    </section>
  );
}
