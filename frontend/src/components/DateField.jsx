import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

// Utilidades de fecha
const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const parseISO = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
};
const toISO = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function DateField({
  id,
  label,
  value,           // ISO 'YYYY-MM-DD'
  onChange,
  onBlur,
  onFocus,
  placeholder = "Seleccioná una fecha",
  error,
  touched,
  min,             // opcional ISO
  max,             // opcional ISO
  disabled = false,
  arrowOffset = 10,
  maxPanelHeight = 340, // alto del popover
  portal = true,        // usar portal por defecto
  style,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const selectedDate = parseISO(value) || null;
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(selectedDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(selectedDate?.getMonth() ?? today.getMonth()); // 0..11

  const minDate = parseISO(min);
  const maxDate = parseISO(max);

  const wrapRef = React.useRef(null);
  const btnRef  = React.useRef(null);

  // ======= Posición del menú =======
  const [menuPos, setMenuPos] = React.useState({ top: 0, left: 0, width: 0, height: 0, placement: "bottom" });
  const measureAndPlace = React.useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const desired = maxPanelHeight;

    const placeBottom = spaceBelow >= Math.min(desired, 180) || spaceBelow >= spaceAbove;

    let top, height, placement;
    if (placeBottom) {
      const h = Math.min(desired, Math.max(220, spaceBelow - 8));
      top = rect.bottom + 8;
      height = h;
      placement = "bottom";
    } else {
      const h = Math.min(desired, Math.max(220, spaceAbove - 8));
      top = rect.top - 8 - h;
      height = h;
      placement = "top";
    }
    setMenuPos({ top, left: rect.left, width: rect.width, height, placement });
  }, [maxPanelHeight]);

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
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      const menuEl = document.getElementById(`${id}-calendar`);
      if (menuEl && menuEl.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [id]);

  const handleFocus = (e) => { setFocused(true); onFocus?.(e); };
  const handleBlur  = (e) => { setFocused(false); onBlur?.(e); };

  // —— navegación de mes
  const prevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  };
  const nextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  };

  // —— generar celdas (6 semanas)
  const weeks = React.useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startDay = (first.getDay() + 6) % 7; // Lunes=0 ... Domingo=6
    const startDate = new Date(viewYear, viewMonth, 1 - startDay);
    const out = [];
    for (let w = 0; w < 6; w++) {
      const row = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + w * 7 + d);
        row.push(day);
      }
      out.push(row);
    }
    return out;
  }, [viewYear, viewMonth]);

  // —— helpers de estado deshabilitado por min/max y mes visible
  const isDisabled = (d) => {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };
  const isOtherMonth = (d) => d.getMonth() !== viewMonth;
  const isToday = (d) => sameDay(d, new Date());

  // —— emitir cambio (evento sintético)
  const emitChange = (iso) => {
    const evt = { target: { id, name: id, value: iso }, currentTarget: { id, name: id, value: iso }, type: "change" };
    onChange?.(evt);
  };

  // —— seleccionar día
  const selectDay = (d) => {
    if (disabled || isDisabled(d)) return;
    const iso = toISO(d);
    emitChange(iso);
    setOpen(false);
    btnRef.current?.focus();
  };

  // —— teclado (trigger + dentro del calendario)
  const [active, setActive] = React.useState(selectedDate || parseISO(todayISO()));
  React.useEffect(() => { if (open) setActive(selectedDate || parseISO(todayISO())); }, [open]); // reset al abrir

  const onTriggerKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
      if (!open) { measureAndPlace(); }
    }
  };

  const moveActive = (days) => {
    const base = active || new Date(viewYear, viewMonth, 1);
    const d = new Date(base);
    d.setDate(base.getDate() + days);
    setActive(d);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const onCalendarKeyDown = (e) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "Enter") { e.preventDefault(); selectDay(active); return; }
    if (e.key === "ArrowLeft")  { e.preventDefault(); moveActive(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); moveActive(1); }
    if (e.key === "ArrowUp")    { e.preventDefault(); moveActive(-7); }
    if (e.key === "ArrowDown")  { e.preventDefault(); moveActive(7); }
    if (e.key === "PageUp")     { e.preventDefault(); setViewMonth((m) => { const nm = m === 0 ? 11 : m - 1; if (m === 0) setViewYear((y) => y - 1); return nm; }); }
    if (e.key === "PageDown")   { e.preventDefault(); setViewMonth((m) => { const nm = m === 11 ? 0 : m + 1; if (m === 11) setViewYear((y) => y + 1); return nm; }); }
    if (e.key === "Home")       { e.preventDefault(); const d = new Date(viewYear, viewMonth, 1); setActive(d); }
    if (e.key === "End")        { e.preventDefault(); const d = new Date(viewYear, viewMonth + 1, 0); setActive(d); }
  };

  // —— estilos comunes (mismo look que tus inputs)
  const borderColor = error ? "#ef4444" : focused || open ? "#42b3fd" : "#cbd5e1";
  const boxShadow   = focused || open ? "0 0 0 5px rgba(37,99,235,.15)" : "none";
  const transform   = focused || open ? "scale(1.02)" : "scale(1)";

  // —— Animaciones
  const panelVariants = {
    initial: { opacity: 0, y: menuPos.placement === "bottom" ? 8 : -8, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 28, mass: 0.5 } },
    exit:    { opacity: 0, y: menuPos.placement === "bottom" ? 6 : -6, scale: 0.985, transition: { type: "tween", duration: 0.15 } },
  };

  // —— Render del calendario (portal)
  const CalendarPanel = (
    <AnimatePresence>
      {open && (
        <motion.div
          id={`${id}-calendar`}
          role="dialog"
          aria-label={`${label || "Calendario"}`}
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          tabIndex={-1}
          onKeyDown={onCalendarKeyDown}
          style={{
            position: portal ? "fixed" : "absolute",
            zIndex: 1000,
            top: portal ? menuPos.top : "calc(100% + 8px)",
            left: portal ? menuPos.left : 0,
            width: portal ? menuPos.width : "100%",
            maxHeight: menuPos.height,
            overflow: "hidden",
            background: "#ffffff77",
            border: "2px solid rgba(255,255,255,0.18)",
            borderRadius: 12,
            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
            padding: 10,
            backdropFilter: "blur(4px)",
            color: "#7f7d7dff",
            boxSizing: "border-box",
          }}
        >
          {/* Header del mes */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button
              type="button"
              onClick={prevMonth}
              style={navBtnStyle}
              aria-label="Mes anterior"
            >
              ‹
            </button>
            <div style={{ fontWeight: 700 }}>
              {monthLabel(viewMonth)} {viewYear}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              style={navBtnStyle}
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>

          {/* Nombres de días */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6, fontSize: 12, opacity: 0.8 }}>
            {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
              <div key={d} style={{ textAlign: "center" }}>{d}</div>
            ))}
          </div>

          {/* Grilla de días */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
            {weeks.flat().map((d, i) => {
              const disabledDay = isDisabled(d);
              const selected = selectedDate && sameDay(d, selectedDate);
              const activeDay = active && sameDay(d, active);
              const other = isOtherMonth(d);
              const todayMark = isToday(d);

              const baseBg = selected
                ? "rgba(46,163,255,0.25)"
                : activeDay
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.05)";

              const opacity = disabledDay ? 0.35 : other ? 0.55 : 1;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDay(d)}
                  disabled={disabledDay}
                  onMouseEnter={() => setActive(d)}
                  style={{
                    padding: "8px 0",
                    borderRadius: 10,
                    border: selected ? "1px solid #2ea3ff" : "1px solid rgba(255,255,255,0.18)",
                    background: baseBg,
                    color: "#7f7d7dff",
                    cursor: disabledDay ? "not-allowed" : "pointer",
                    opacity,
                  }}
                >
                  <span style={{ fontWeight: todayMark ? 800 : 500 }}>
                    {d.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Acciones rápidas */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <button
              type="button"
              onClick={() => { const t = new Date(); setViewYear(t.getFullYear()); setViewMonth(t.getMonth()); setActive(t); }}
              style={quickBtnStyle}
            >
              Ir a hoy
            </button>
            <button
              type="button"
              onClick={() => { const t = parseISO(todayISO()); if (t && !isDisabled(t)) selectDay(t); }}
              style={quickBtnStyle}
            >
              Seleccionar hoy
            </button>
          </div>
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

      {/* Trigger estilizado como tus inputs */}
      <button
        id={id}
        name={id}
        type="button"
        ref={btnRef}
        disabled={disabled}
        onClick={() => { setOpen((o) => !o); if (!open) measureAndPlace(); }}
        onKeyDown={onTriggerKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          width: "100%",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
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
        <span style={{ color: "#0b1220", flex: "1 1 auto", minWidth: 0 }}>
          {selectedDate ? toISO(selectedDate) : placeholder}
        </span>

        {/* Calendario/Caret */}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "tween", duration: 0.18 }}
          style={{
            marginLeft: "auto",
            marginRight: arrowOffset,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            lineHeight: 0,
            color: "#1f2937",
            pointerEvents: "none",
          }}
        >
          ▾
        </motion.span>
      </button>

      {/* Calendario en portal */}
      {portal ? createPortal(CalendarPanel, document.body) : CalendarPanel}

      {touched && error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}

// Estilos de botones del calendario
const navBtnStyle = {
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.08)",
  color: "#7f7d7dff",
  borderRadius: 10,
  padding: "6px 10px",
  cursor: "pointer",
};

const quickBtnStyle = {
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.08)",
  color: "#7f7d7dff",
  borderRadius: 10,
  padding: "6px 10px",
  cursor: "pointer",
};

// Etiquetas de meses (ES)
function monthLabel(m) {
  return ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][m] || "";
}
