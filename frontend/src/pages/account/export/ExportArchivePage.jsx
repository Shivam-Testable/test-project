import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getToken } from "../../../lib/authStorage";

/**
 * Stage 6 bounded-search targets (unique UI strings):
 *   - Export account archive bundle
 *   - Generate archive bundle
 * Route: /account/export
 */
export default function ExportArchivePage() {
  const token = getToken();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  function onGenerate() {
    setStatus("success");
    setMessage("Archive bundle queued locally for this demo.");
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="export-archive-heading">
        <h1 id="export-archive-heading">Export account archive bundle</h1>
        <p className="subtitle">TESR-27 Stage 6 unique-text discovery page</p>
        <p>
          Download a demo package of your account metadata. This page is intentionally labeled
          with distinctive copy for bounded frontend search.
        </p>
        <button type="button" onClick={onGenerate}>
          Generate archive bundle
        </button>
        {status === "success" ? (
          <p className="banner success" role="status">
            {message}
          </p>
        ) : null}
        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/account">Back to account</Link>
          {" · "}
          <Link to="/home">Home</Link>
        </p>
      </section>
    </main>
  );
}
