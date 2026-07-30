/** Stage 5 — imported by AccountShell. */
export default function AccountSummary({ displayName, email }) {
  return (
    <p role="status">
      Signed in as {displayName || email || "user"}. Choose a section below.
    </p>
  );
}
