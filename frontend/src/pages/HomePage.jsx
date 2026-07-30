import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  authHeaders,
  clearSession,
  getToken,
  setSession,
} from "../lib/authStorage";
import WelcomeWidget from "../components/home/WelcomeWidget";
import QuickLinksWidget from "../components/home/QuickLinksWidget";
import TrustedDeviceBanner from "../components/security/TrustedDeviceBanner";

/** Home dashboard — Stage 5 import graph via WelcomeWidget + QuickLinksWidget. */
export default function HomePage() {
  const navigate = useNavigate();
  const token = getToken();
  const [loadStatus, setLoadStatus] = useState("loading");
  const [welcome, setWelcome] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [logoutStatus, setLogoutStatus] = useState("idle");
  const [displayName, setDisplayName] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [profileStatus, setProfileStatus] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [refreshStatus, setRefreshStatus] = useState("idle");
  const [refreshMessage, setRefreshMessage] = useState("");
  const [tipStatus, setTipStatus] = useState("loading");
  const [tip, setTip] = useState("");
  const [tipError, setTipError] = useState("");
  const [activityStatus, setActivityStatus] = useState("loading");
  const [activity, setActivity] = useState([]);
  const [activityError, setActivityError] = useState("");

  const loadHome = useCallback(
    async (cancelledRef) => {
      setLoadStatus("loading");
      setError("");
      try {
        const response = await fetch("/api/v1/home", {
          headers: {
            ...authHeaders(),
          },
        });
        const data = await response.json().catch(() => ({}));
        if (cancelledRef?.current) return false;
        if (!response.ok) {
          if (response.status === 401) {
            clearSession();
            navigate("/login");
            return false;
          }
          setLoadStatus("error");
          setError(data.message || "Failed to load home dashboard");
          return false;
        }
        setWelcome(data.welcome || "Welcome");
        setUser(data.user || null);
        setDisplayName(data.user?.displayName || "");
        setLoadStatus("success");
        return true;
      } catch {
        if (cancelledRef?.current) return false;
        setLoadStatus("error");
        setError("Could not reach the home API. Is the backend running?");
        return false;
      }
    },
    [navigate]
  );

  const loadProfile = useCallback(
    async (cancelledRef) => {
      setProfileStatus("loading");
      setProfileError("");
      try {
        const response = await fetch("/api/v1/home/profile", {
          headers: {
            ...authHeaders(),
          },
        });
        const data = await response.json().catch(() => ({}));
        if (cancelledRef?.current) return false;
        if (!response.ok) {
          if (response.status === 401) {
            clearSession();
            navigate("/login");
            return false;
          }
          setProfileStatus("error");
          setProfileError(data.message || "Failed to load profile");
          return false;
        }
        setProfile(data);
        setProfileStatus("success");
        return true;
      } catch {
        if (cancelledRef?.current) return false;
        setProfileStatus("error");
        setProfileError("Could not reach the profile API.");
        return false;
      }
    },
    [navigate]
  );

  const loadTip = useCallback(
    async (cancelledRef) => {
      setTipStatus("loading");
      setTipError("");
      try {
        const response = await fetch("/api/v1/home/tip", {
          headers: {
            ...authHeaders(),
          },
        });
        const data = await response.json().catch(() => ({}));
        if (cancelledRef?.current) return false;
        if (!response.ok) {
          if (response.status === 401) {
            clearSession();
            navigate("/login");
            return false;
          }
          setTipStatus("error");
          setTipError(data.message || "Failed to load tip");
          return false;
        }
        setTip(data.tip || "");
        setTipStatus("success");
        return true;
      } catch {
        if (cancelledRef?.current) return false;
        setTipStatus("error");
        setTipError("Could not reach the tip API.");
        return false;
      }
    },
    [navigate]
  );

  const loadActivity = useCallback(
    async (cancelledRef) => {
      setActivityStatus("loading");
      setActivityError("");
      try {
        const response = await fetch("/api/v1/home/activity", {
          headers: {
            ...authHeaders(),
          },
        });
        const data = await response.json().catch(() => ({}));
        if (cancelledRef?.current) return false;
        if (!response.ok) {
          if (response.status === 401) {
            clearSession();
            navigate("/login");
            return false;
          }
          setActivityStatus("error");
          setActivityError(data.message || "Failed to load activity");
          return false;
        }
        setActivity(data.events || []);
        setActivityStatus("success");
        return true;
      } catch {
        if (cancelledRef?.current) return false;
        setActivityStatus("error");
        setActivityError("Could not reach the activity API.");
        return false;
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!token) return undefined;
    const cancelledRef = { current: false };
    loadHome(cancelledRef);
    loadProfile(cancelledRef);
    loadTip(cancelledRef);
    loadActivity(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
  }, [token, loadHome, loadProfile, loadTip, loadActivity]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  async function onRefreshDashboard() {
    setRefreshStatus("loading");
    setRefreshMessage("");
    const cancelledRef = { current: false };
    const homeOk = await loadHome(cancelledRef);
    const profileOk = await loadProfile(cancelledRef);
    const tipOk = await loadTip(cancelledRef);
    const activityOk = await loadActivity(cancelledRef);
    if (homeOk && profileOk && tipOk && activityOk) {
      setRefreshStatus("success");
      setRefreshMessage("Dashboard refreshed");
    } else {
      setRefreshStatus("error");
      setRefreshMessage("Refresh failed. Check the errors above.");
    }
  }

  async function onSaveDisplayName(event) {
    event.preventDefault();
    setSaveStatus("loading");
    setSaveMessage("");
    try {
      const response = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ displayName }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSaveStatus("error");
        setSaveMessage(data.message || "Failed to update display name");
        return;
      }
      setUser(data.user);
      setWelcome(`Welcome back, ${data.user.displayName || data.user.email}`);
      setSession(token, data.user);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName: data.user.displayName,
              email: data.user.email,
            }
          : prev
      );
      setSaveStatus("success");
      setSaveMessage(data.message || "Display name updated");
      await loadTip({ current: false });
      await loadActivity({ current: false });
    } catch {
      setSaveStatus("error");
      setSaveMessage("Could not reach the update display name API.");
    }
  }

  async function onLogout() {
    setLogoutStatus("loading");
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });
    } catch {
      // clear local session either way
    }
    clearSession();
    navigate("/login");
  }

  function formatMemberSince(value) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="home-heading">
        <h1 id="home-heading">Home</h1>
        <p className="subtitle">Post-login dashboard — Stage 5 widgets via local imports</p>

        <WelcomeWidget name={user?.displayName || user?.email} />
        <QuickLinksWidget />
        <TrustedDeviceBanner />

        <button
          type="button"
          onClick={onRefreshDashboard}
          disabled={refreshStatus === "loading"}
          style={{ marginBottom: "1rem" }}
        >
          {refreshStatus === "loading" ? "Refreshing…" : "Refresh dashboard"}
        </button>

        {refreshStatus === "loading" ? (
          <p className="banner success" role="status">
            Refreshing dashboard…
          </p>
        ) : null}
        {refreshStatus === "success" ? (
          <p className="banner success" role="status">
            {refreshMessage}
          </p>
        ) : null}
        {refreshStatus === "error" ? (
          <p className="banner error" role="alert">
            {refreshMessage}
          </p>
        ) : null}

        <section aria-labelledby="tip-heading" style={{ marginBottom: "1rem" }}>
          <h2 id="tip-heading">Tip</h2>
          {tipStatus === "loading" ? (
            <p className="banner success" role="status">
              Loading tip…
            </p>
          ) : null}
          {tipStatus === "success" ? (
            <p className="banner success" role="status">
              {tip}
            </p>
          ) : null}
          {tipStatus === "error" ? (
            <p className="banner error" role="alert">
              {tipError}
            </p>
          ) : null}
        </section>

        {loadStatus === "loading" ? (
          <p className="banner success" role="status">
            Loading dashboard…
          </p>
        ) : null}

        {loadStatus === "success" ? (
          <div>
            <p className="banner success" role="status">
              {welcome}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Display name:</strong> {user?.displayName || "—"}
            </p>

            <form className="form" onSubmit={onSaveDisplayName} noValidate style={{ marginTop: "1.25rem" }}>
              <label htmlFor="display-name">Display name</label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                autoComplete="nickname"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                minLength={2}
                maxLength={80}
                required
              />
              <button type="submit" disabled={saveStatus === "loading"}>
                {saveStatus === "loading" ? "Saving…" : "Save display name"}
              </button>
            </form>

            {saveStatus === "success" ? (
              <p className="banner success" role="status">
                {saveMessage}
              </p>
            ) : null}
            {saveStatus === "error" ? (
              <p className="banner error" role="alert">
                {saveMessage}
              </p>
            ) : null}
          </div>
        ) : null}

        {loadStatus === "error" ? (
          <p className="banner error" role="alert">
            {error}
          </p>
        ) : null}

        <section aria-labelledby="activity-heading" style={{ marginTop: "1.5rem" }}>
          <h2 id="activity-heading">Recent activity</h2>
          {activityStatus === "loading" ? (
            <p className="banner success" role="status">
              Loading activity…
            </p>
          ) : null}
          {activityStatus === "success" ? (
            <div role="status">
              {activity.length === 0 ? (
                <p className="subtitle">No recent events yet.</p>
              ) : (
                <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
                  {activity.map((event) => (
                    <li key={event.id} style={{ marginBottom: "0.5rem" }}>
                      <strong>{event.message}</strong>
                      <div className="subtitle">{new Date(event.at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
          {activityStatus === "error" ? (
            <p className="banner error" role="alert">
              {activityError}
            </p>
          ) : null}
        </section>

        <section aria-labelledby="profile-heading" style={{ marginTop: "1.5rem" }}>
          <h2 id="profile-heading">Profile</h2>
          {profileStatus === "loading" ? (
            <p className="banner success" role="status">
              Loading profile…
            </p>
          ) : null}
          {profileStatus === "success" ? (
            <div className="banner success" role="status">
              <p>
                <strong>Email:</strong> {profile?.email}
              </p>
              <p>
                <strong>Display name:</strong> {profile?.displayName || "—"}
              </p>
              <p>
                <strong>Member since:</strong> {formatMemberSince(profile?.memberSince || profile?.createdAt)}
              </p>
            </div>
          ) : null}
          {profileStatus === "error" ? (
            <p className="banner error" role="alert">
              {profileError}
            </p>
          ) : null}
        </section>

        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/sessions">Active sessions</Link>
          {" · "}
          <Link to="/change-password">Change password</Link>
          {" · "}
          <Link to="/settings">Notification settings</Link>
          {" · "}
          <Link to="/help">Help</Link>
          {" · "}
          <Link to="/account">Account</Link>
          {" · "}
          <Link to="/login">Back to login</Link>
        </p>

        <button type="button" onClick={onLogout} disabled={logoutStatus === "loading"}>
          {logoutStatus === "loading" ? "Logging out…" : "Log out"}
        </button>
      </section>
    </main>
  );
}
