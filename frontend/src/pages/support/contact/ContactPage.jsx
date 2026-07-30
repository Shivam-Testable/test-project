import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Stage 4 route convention:
 *   /support/contact  →  frontend/src/pages/support/contact/ContactPage.jsx
 */
export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus("error");
      setFeedback("Name and message are required");
      return;
    }
    setStatus("success");
    setFeedback("Thanks — your message was recorded locally for this demo.");
    setMessage("");
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="contact-heading">
        <h1 id="contact-heading">Contact support</h1>
        <p className="subtitle">Support contact — TESR-21 (Stage 4 route /support/contact)</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="contact-message">Message</label>
          <input
            id="contact-message"
            name="message"
            type="text"
            placeholder="How can we help?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit">Send message</button>
        </form>

        {status === "success" ? (
          <p className="banner success" role="status">
            {feedback}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="banner error" role="alert">
            {feedback}
          </p>
        ) : null}

        <p className="subtitle" style={{ marginTop: "1rem" }}>
          <Link to="/help">Help</Link>
          {" · "}
          <Link to="/home">Home</Link>
        </p>
      </section>
    </main>
  );
}
