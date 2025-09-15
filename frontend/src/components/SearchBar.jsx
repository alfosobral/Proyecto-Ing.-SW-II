import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
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
    borderRadius: "8px",
    overflow: "hidden",
  },
  input: {
    border: "none",
    outline: "none",
    padding: "6px 10px",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "white",
    width: "180px",
  },
  button: {
    border: "none",
    outline: "none",
    padding: "6px 10px",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
