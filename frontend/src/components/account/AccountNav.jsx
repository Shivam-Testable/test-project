import { Link } from "react-router-dom";

/** Stage 5 — imported by AccountShell. */
export default function AccountNav() {
  return (
    <nav aria-label="Account sections">
      <ul style={{ paddingLeft: "1.1rem" }}>
        <li>
          <Link to="/account/security">Security</Link>
        </li>
        <li>
          <Link to="/account/privacy">Privacy</Link>
        </li>
        <li>
          <Link to="/account/export">Export archive</Link>
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
    </nav>
  );
}
