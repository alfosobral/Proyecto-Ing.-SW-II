import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({
    onSearch,
    width = "40%",
    maxWidth = 500,
    minWidth = 200, 
}) {
  const [query, setQuery] = useState("");

  const normalizedWidth =
    typeof width === "number" ? `${width}%` : (width || "40%");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      ...styles.form,
      width: normalizedWidth,
      maxWidth,
      minWidth
    }}>
      <input
        type="text"
        placeholder="Buscar..."
        width={width}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
        aria-label="Buscar"
      />
      <button type="submit" style={styles.button}>
        <FaSearch />
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1b25",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "8px 12px",
    fontSize: 14,
    background: "#111827",
    color: "#fff",
  },
  button: {
    border: "none",
    outline: "none",
    padding: "8px 12px",
    cursor: "pointer",
    background: "#111827",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
};
