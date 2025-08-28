export default function Navbar({ title }) {
  return (
    <header style={{ padding: "12px 24px", borderBottom: "1px solid #ddd" }}>
      <strong>{title}</strong>
    </header>
  );
}
