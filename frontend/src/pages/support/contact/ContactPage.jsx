import { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "../../../components/form/TextField";
import TextArea from "../../../components/form/TextArea";

/**
 * Stage 4 route + Stage 5 imports:
 *   ContactPage → TextField + TextArea
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
        <p className="subtitle">Support contact — TESR-24 shared form imports (Stage 5)</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <TextField
            id="contact-name"
            label="Name"
            name="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextArea
            id="contact-message"
            label="Message"
            name="message"
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
