/** Stage 5 shared form component — imported by ContactPage. */
export default function TextField({
  id,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </>
  );
}
