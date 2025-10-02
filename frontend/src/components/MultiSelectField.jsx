import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MultiSelectField({
  id,
  label,
  options = [],            // [{ value, label }]
  values = [],             // ['8','10', ...]
  onChange,                // (nextValues: string[]) => void
  placeholder = "Seleccioná opciones",
  error,
  touched,
  disabled = false,
  maxPanelHeight = 260,
}) {
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const wrapRef = React.useRef(null);

  // Cerrar al click afuera
  React.useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  const toggleValue = (val) => {
    if (disabled) return;
    const set = new Set(values.map(String));
    const sval = String(val);
    if (set.has(sval)) set.delete(sval);
    else set.add(sval);
    onChange?.(Array.from(set).sort((a, b) => Number(a) - Number(b)));
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const selected = options.filter((o) => values.includes(String(o.value)));
  const borderColor = error ? "#ef4444" : focused || open ? "#42b3fd" : "#cbd5e1";
  const boxShadow   = focused || open ? "0 0 0 5px rgba(37,99,235,.15)" : "none";
  const transform   = focused || open ? "scale(1.02)" : "scale(1)";

  // variants para animaciones smooth
  const panelVariants = {
    initial: { opacity: 0, y: 8, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 28, mass: 0.5 } },
    exit:    { opacity: 0, y: 6, scale: 0.985, transition: { type: "tween", duration: 0.15 } },
  };

  const listVariants = {
    hidden: { opacity: 1 }, // el contenedor no flickea
    show:   { opacity: 1, transition: { staggerChildren: 0.012 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 4 },
    show:   { opacity: 1, y: 0, transition: { type: "tween", duration: 0.12 } },
  };

  return (
    <div ref={wrapRef} style={{ marginBottom: 14, width: "100%", position: "relative" }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 14, color: "#ffffffff", marginBottom: 6, display: "block" }}>
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: 12,
          border: `4px solid ${borderColor}`,
          background: disabled ? "#ffffff55" : "#ffffff77",
          outline: "none",
          fontSize: 14,
          transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
          transform,
          boxShadow,
          boxSizing: "border-box",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "baseline", overflow: "hidden" }}>
          <span style={{ fontWeight: 700, color: "#0b1220" }}>
            {selected.length ? `${selected.length} ` : ""}
          </span>
          <span style={{ opacity: 0.9, color: "#0b1220" }}>
            {selected.length ? "seleccionada(s)" : placeholder}
          </span>
        </div>

        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "tween", duration: 0.18 }}
          style={{ display: "inline-flex", color: "#0b1220" }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-multiselectable="true"
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: "absolute",
              zIndex: 60,
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              maxHeight: maxPanelHeight,
              overflowY: "auto",         // permite scroll...
              overscrollBehavior: "contain",       
              background: "#ffffff77",
              border: "2px solid rgba(255,255,255,0.18)",
              borderRadius: 12,
              boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
              padding: 8,
              backdropFilter: "blur(4px)",
              scrollbarWidth: "none",   
              msOverflowStyle: "none",     
            }}
            onWheelCapture={(e) => {
              const el = e.currentTarget;
              const atTop = el.scrollTop === 0 && e.deltaY < 0;
              const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop <= 0 && e.deltaY > 0;
              if (atTop || atBottom) e.stopPropagation();
            }}
          >
            <style>{`
              [role="listbox"]::-webkit-scrollbar { display: none; width: 0; height: 0; }
            `}</style>

            {/* Botón limpiar (si hay selección) */}
            {!!selected.length && (
              <motion.div
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0, transition: { type: "tween", duration: 0.12 } }}
                style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}
              >
                <button
                  type="button"
                  onClick={clearAll}
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "2px solid rgba(255,255,255,.25)",
                    background: "rgba(255,255,255,.08)",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Limpiar
                </button>
              </motion.div>
            )}

            {/* Lista con stagger suave */}
            <motion.div variants={listVariants} initial="hidden" animate="show">
              {options.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  style={{ padding: "10px 12px", color: "white", opacity: 0.8, fontSize: 13 }}
                >
                  No hay opciones
                </motion.div>
              )}

              {options.map((o) => {
                const checked = values.includes(String(o.value));
                return (
                  <motion.label
                    key={o.value}
                    htmlFor={`${id}-${o.value}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.4 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: checked ? "1px solid #2ea3ff" : "1px solid rgba(255,255,255,0.18)",
                      background: checked ? "rgba(46,163,255,0.15)" : "rgba(255,255,255,0.03)",
                      color: "#7f7d7dff",
                      cursor: "pointer",
                      userSelect: "none",
                      marginBottom: 6,
                    }}
                  >
                    <input
                      id={`${id}-${o.value}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleValue(o.value)}
                      style={{ accentColor: "#2ea3ff" }}
                    />
                    <span>{o.label}</span>
                  </motion.label>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {touched && error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}
