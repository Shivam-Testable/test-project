/**
 * Stage 6 bounded-search target.
 * Unique component name: TrustedDeviceBanner
 * Unique UI string: Trusted device check is active for this session.
 */
export default function TrustedDeviceBanner() {
  return (
    <section aria-labelledby="trusted-device-heading" style={{ marginBottom: "1rem" }}>
      <h2 id="trusted-device-heading">Trusted device</h2>
      <p className="banner success" role="status">
        Trusted device check is active for this session.
      </p>
    </section>
  );
}
