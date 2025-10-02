import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function SelectField({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  options = [],
  error,
  touched,
  style,
  arrowOffset = 10,
  disabled = false,
  maxPanelHeight = 260,
  portal = true,        // 👈 por defecto usa portal
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(
    Math.max(0, options.findIndex((o) => String(o.value) === String(value)))
  );

  const wrapRef = React.useRef(null);
  const btnRef  = React.useRef(null);
  const listRef = React.useRef(null);

  // ======= Posición del menú (para portal) =======
  const [menuPos, setMenuPos] = React.useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,          // alto disponible/ajustado
    placement: "bottom" // bottom|top
  });

  const measureAndPlace = React.useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();

    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;

    // Alto objetivo del panel
    const desired = maxPanelHeight;
    const placeBottom = spaceBelow >= Math.min(desired, 180) || spaceBelow >= spaceAbove;

    // top final (fixed): debajo u arriba, con margen 8px
    let top, height, placement;
    if (placeBottom) {
      const h = Math.min(desired, Math.max(120, spaceBelow - 8));
      top = rect.bottom + 8;
      height = h;
      placement = "bottom";
    } else {
      const h = Math.min(desired, Math.max(120, spaceAbove - 8));
      top = rect.top - 8 - h;
      height = h;
      placement = "top";
    }

    setMenuPos({
      top,
      left: rect.left,
      width: rect.width,
      height,
      placement
    });
  }, [maxPanelHeight]);

  // medir al abrir y en resize/scroll
  React.useEffect(() => {
    if (!open) return;
    measureAndPlace();
    const onScroll = () => measureAndPlace();
    const onResize = () => measureAndPlace();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, measureAndPlace]);

  // —— Click afuera
  React.useEffect(() => {
    const onDown = (e) => {
      // si el click entra al botón o al menú, no cerrar
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      const menuEl = document.getElementById(`${id}-menu`);
      if (menuEl && menuEl.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [id]);

  // —— Cuando abre, llevar al seleccionado y scrollear al ítem
  React.useEffect(() => {
    if (!open) return;
    const idx = Math.max(0, options.findIndex((o) => String(o.value) === String(value)));
    setActiveIndex(idx === -1 ? 0 : idx);
    // el scroll al ítem activo lo manejamos tras render (pequeño timeout)
    const t = setTimeout(() => {
      const menuEl = document.getElementById(`${id}-menu`);
      const el = menuEl?.querySelector(`[data-idx="${idx}"]`);
      el?.scrollIntoView?.({ block: "nearest" });
    }, 0);
    return () => clearTimeout(t);
  }, [open, options, value, id]);

  const handleFocus = (e) => { setFocused(true); onFocus?.(e); };
  const handleBlur  = (e) => { setFocused(false); onBlur?.(e); };

  const borderColor = error ? "#ef4444" : focused || open ? "#42b3fd" : "#cbd5e1";
  const boxShadow   = focused || open ? "0 0 0 5px rgba(37,99,235,.15)" : "none";
  const transform   = focused || open ? "scale(1.02)" : "scale(1)";

  const selected = options.find((o) => String(o.value) === String(value));
  const selectedLabel = selected ? selected.label : (options[0]?.label ?? "");

  // —— emitir cambio como evento sintético compatible
  const emitChange = (newVal) => {
    const evt = {
      target: { id, name: id, value: newVal },
      currentTarget: { id, name: id, value: newVal },
      type: "change",
    };
    onChange?.(evt);
  };

  const selectByIndex = (idx) => {
    const opt = options[idx];
    if (!opt) return;
    emitChange(opt.value);
    setOpen(false);
    btnRef.current?.focus();
  };

  // —— Teclado
  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        selectByIndex(activeIndex);
      }
      return;
    }
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    }
  };

  // —— Animaciones
  const panelVariants = {
    initial: { opacity: 0, y: menuPos.placement === "bottom" ? 8 : -8, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 28, mass: 0.5 } },
    exit:    { opacity: 0, y: menuPos.placement === "bottom" ? 6 : -6, scale: 0.985, transition: { type: "tween", duration: 0.15 } },
  };
  const listVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.012 } } };
  const itemVariants = { hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.12 } } };

  // —— Render del panel (portal o inline)
  const Panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          id={`${id}-menu`}
          role="listbox"
          aria-activedescendant={`${id}-opt-${activeIndex}`}
          tabIndex={-1}
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            position: portal ? "fixed" : "absolute",
            zIndex: 1000,
            top: portal ? menuPos.top : "calc(100% + 8px)",
            left: portal ? menuPos.left : 0,
            width: portal ? menuPos.width : "100%",
            maxHeight: portal ? menuPos.height : maxPanelHeight,
            overflowY: "auto",
            overscrollBehavior: "contain",
            background: "#ffffff77",
            border: "2px solid rgba(255,255,255,0.18)",
            borderRadius: 12,
            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
            padding: 6,
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
          {/* Ocultar scrollbar en WebKit */}
          <style>{`#${id}-menu::-webkit-scrollbar { display: none; width: 0; height: 0; }`}</style>

          <motion.div variants={listVariants} initial="hidden" animate="show">
            {options.length === 0 && (
              <motion.div variants={itemVariants} style={{ padding: "10px 12px", color: "white", opacity: 0.8, fontSize: 13 }}>
                No hay opciones
              </motion.div>
            )}

            {options.map((opt, i) => {
              const active = i === activeIndex;
              const isSelected = String(opt.value) === String(value);
              return (
                <motion.div
                  key={opt.value}
                  id={`${id}-opt-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={isSelected}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => selectByIndex(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 10px",
                    borderRadius: 10,
                    marginBottom: 6,
                    cursor: "pointer",
                    userSelect: "none",
                    border: isSelected ? "1px solid #2ea3ff" : "1px solid rgba(255,255,255,0.18)",
                    background: isSelected
                      ? "rgba(46,163,255,0.15)"
                      : active
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(255,255,255,0.03)",
                    color: "#7f7d7dff",
                  }}
                >
                  <span style={{ pointerEvents: "none" }}>{opt.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={wrapRef} style={{ marginBottom: 14, width: "100%", position: "relative", ...style }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 14, color: "#ffffffff", marginBottom: 6, display: "block" }}>
          {label}
        </label>
      )}

      {/* Trigger estilizado como tu input/select */}
      <button
        id={id}
        name={id}
        type="button"
        ref={btnRef}
        disabled={disabled}
        onClick={() => { setOpen((o) => !o); if (!open) measureAndPlace(); }}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: "100%",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: 12,
          border: `4px solid ${borderColor}`,
          outline: "none",
          fontSize: 14,
          transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
          transform,
          boxShadow,
          background: disabled ? "#ffffff55" : "#ffffff77",
          boxSizing: "border-box",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        {...props}
      >
        <span style={{ color: "#0b1220" }}>
          {options.find((o) => String(o.value) === String(value))?.label ?? (options[0]?.label ?? "")}
        </span>

        {/* Caret animado */}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "tween", duration: 0.18 }}
          style={{
             marginLeft: "auto",               // empuja a la derecha
              marginRight: arrowOffset,         // “offset” configurable
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              lineHeight: 0,                    // evita desplazamientos por métricas de fuente
              color: "#7f7d7dff",
              pointerEvents: "none",
          }}
        >
          ▾
        </motion.span>
      </button>

      {/* Panel: portal o inline (fallback) */}
      {portal ? createPortal(Panel, document.body) : Panel}

      {touched && error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}
