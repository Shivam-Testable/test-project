import { Navigate } from "react-router-dom";
import { getStoredUser, getToken } from "../../lib/authStorage";
import AccountShell from "../../components/account/AccountShell";

/**
 * Stage 4 route + Stage 5 imports:
 *   /account → AccountPage → AccountShell → AccountNav + AccountSummary
 */
export default function AccountPage() {
  const token = getToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="page">
      <AccountShell displayName={user?.displayName} email={user?.email} />
    </main>
  );
}
