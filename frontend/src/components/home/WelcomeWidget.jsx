/** Stage 5 local import target — used by HomePage. */
export default function WelcomeWidget({ name }) {
  return (
    <section aria-labelledby="welcome-widget-heading" style={{ marginBottom: "1rem" }}>
      <h2 id="welcome-widget-heading">Welcome widget</h2>
      <p className="banner success" role="status">
        Hello {name || "there"} — this widget is loaded via a local import (Stage 5).
      </p>
    </section>
  );
}
