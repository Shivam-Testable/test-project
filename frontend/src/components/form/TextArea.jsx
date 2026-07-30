/** Stage 5 shared form component — imported by ContactPage. */
export default function TextArea({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        style={{
          width: "100%",
          marginBottom: "0.65rem",
          padding: "0.7rem 0.8rem",
          border: "1px solid var(--border)",
          borderRadius: 8,
          font: "inherit",
        }}
      />
    </>
  );
}
