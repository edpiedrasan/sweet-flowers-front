import React, { useState, useEffect } from "react";
import { FaTint, FaClock, FaLeaf, FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";

const ScheduleForm = ({ isOpen, onClose, onSave, schedule, gpioId, gpioLabel, gpioOptions }) => {
  const [form, setForm] = useState({
    gpio_id: gpioId || 0,
    gpio_label: gpioLabel || "",
    time_hour: 6,
    time_minute: 0,
    duration_minutes: 5,
    active_days: "0,1,2,3,4,5,6",
    enabled: 1,
  });

  const [prevOpen, setPrevOpen] = useState(false);

  useEffect(() => {
    // Only reset form when modal OPENS (transition from closed to open)
    if (isOpen && !prevOpen) {
      if (schedule) {
        setForm({
          gpio_id: schedule.gpio_id,
          gpio_label: schedule.gpio_label,
          time_hour: schedule.time_hour,
          time_minute: schedule.time_minute,
          duration_minutes: schedule.duration_minutes,
          active_days: schedule.active_days,
          enabled: schedule.enabled,
        });
      } else {
        setForm({
          gpio_id: gpioId || 0,
          gpio_label: gpioLabel || "",
          time_hour: 6,
          time_minute: 0,
          duration_minutes: 5,
          active_days: "0,1,2,3,4,5,6",
          enabled: 1,
        });
      }
    }
    setPrevOpen(isOpen);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const handleTimeChange = (e) => {
    const [h, m] = e.target.value.split(":").map(Number);
    setForm({ ...form, time_hour: h || 0, time_minute: m || 0 });
  };

  const handleGpioChange = (e) => {
    const id = parseInt(e.target.value);
    const gpio = gpioOptions ? gpioOptions.find((g) => g[0] === id) : null;
    setForm({ ...form, gpio_id: id, gpio_label: gpio ? gpio[1] : `Salida ${id}` });
  };

  const timeValue = `${String(form.time_hour).padStart(2, "0")}:${String(form.time_minute).padStart(2, "0")}`;

  const isValid = form.duration_minutes >= 1 && form.duration_minutes <= 120 && form.gpio_id > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="irr-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="irr-modal">
        <div className="irr-modal-accent" />

        {/* Header */}
        <div className="irr-modal-header" style={{ position: "relative" }}>
          <div className="irr-icon-box irr-icon-box-green" style={{ width: 44, height: 44, borderRadius: 14, border: "1px solid rgba(0,230,138,0.15)" }}>
            <FaLeaf />
          </div>
          <div>
            <div className="irr-font-bold irr-text-white" style={{ fontSize: 18 }}>
              {schedule ? "Editar Horario" : "Nuevo Horario"}
            </div>
            <div className="irr-text-xs irr-text-muted irr-font-medium">
              Configuración de riego automático
            </div>
          </div>
          <button className="irr-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Body */}
        <div className="irr-modal-body">
          {/* GPIO selector (new schedule only) */}
          {!schedule && gpioOptions && gpioOptions.length > 0 && (
            <div className="irr-mb-4">
              <label className="irr-label" style={{ display: "block", marginBottom: 8 }}>Salida</label>
              <select className="irr-select" value={form.gpio_id} onChange={handleGpioChange}>
                {gpioOptions.map((g) => (
                  <option key={g[0]} value={g[0]}>Salida {g[0]} — {g[1]}</option>
                ))}
              </select>
            </div>
          )}

          {/* Display current GPIO when editing */}
          {schedule && (
            <div className="irr-inner-card irr-mb-4">
              <div className="irr-flex irr-flex-center irr-gap-2">
                <FaTint style={{ color: "#34d399", fontSize: 12 }} />
                <span className="irr-text-sm irr-font-semibold irr-text-white">{form.gpio_label}</span>
                <span className="irr-text-xs irr-text-muted">— Salida {form.gpio_id}</span>
              </div>
            </div>
          )}

          {/* Time */}
          <div className="irr-mb-4">
            <label className="irr-label" style={{ display: "block", marginBottom: 8 }}>Hora de riego</label>
            <div className="irr-flex irr-flex-center irr-gap-3">
              <div className="irr-icon-box irr-icon-box-green" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(52,211,153,0.08)" }}>
                <FaClock style={{ fontSize: 14 }} />
              </div>
              <input type="time" className="irr-input" value={timeValue} onChange={handleTimeChange} style={{ flex: 1 }} />
            </div>
          </div>

          {/* Duration */}
          <div className="irr-mb-4">
            <label className="irr-label" style={{ display: "block", marginBottom: 8 }}>Duración (minutos)</label>
            <div className="irr-flex irr-flex-center irr-gap-2">
              <button
                type="button"
                className="irr-btn irr-btn-outline irr-btn-icon"
                style={{ width: 44, height: 44, borderRadius: 12, fontSize: 14 }}
                onClick={() => setForm({ ...form, duration_minutes: Math.max(1, form.duration_minutes - 1) })}
                disabled={form.duration_minutes <= 1}
              >
                <FaChevronDown />
              </button>
              <div
                className="irr-input"
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  padding: "10px 14px",
                  letterSpacing: "0.02em",
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                {form.duration_minutes} <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>min</span>
              </div>
              <button
                type="button"
                className="irr-btn irr-btn-outline irr-btn-icon"
                style={{ width: 44, height: 44, borderRadius: 12, fontSize: 14 }}
                onClick={() => setForm({ ...form, duration_minutes: Math.min(120, form.duration_minutes + 1) })}
                disabled={form.duration_minutes >= 120}
              >
                <FaChevronUp />
              </button>
            </div>
            {/* Quick presets */}
            <div className="irr-flex irr-gap-2" style={{ marginTop: 8 }}>
              {[3, 5, 10, 15, 30].map((min) => (
                <button
                  key={min}
                  type="button"
                  className={`irr-btn irr-btn-sm ${form.duration_minutes === min ? "irr-btn-green" : "irr-btn-outline"}`}
                  style={{ flex: 1, padding: "6px 0", fontSize: 11 }}
                  onClick={() => setForm({ ...form, duration_minutes: min })}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>

          {/* Info banner */}
          <div className="irr-info irr-mb-4">
            <span className="irr-dot" />
            <span className="irr-text-xs irr-text-green">
              Se ejecutará todos los días. Recibirás una notificación en Telegram 5 minutos antes con opción de cancelar.
            </span>
          </div>

          {/* Enabled toggle */}
          <div className="irr-inner-card">
            <div className="irr-flex irr-flex-between irr-flex-center">
              <div>
                <div className="irr-text-sm irr-font-medium irr-text-white">Habilitado</div>
                <div className="irr-text-xs irr-text-muted">Activar este horario</div>
              </div>
              <label className="irr-switch">
                <input
                  type="checkbox"
                  checked={form.enabled === 1}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked ? 1 : 0 })}
                />
                <span className="irr-switch-track" />
                <span className="irr-switch-thumb" />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="irr-modal-footer">
          <button className="irr-btn irr-btn-outline" style={{ flex: 1, height: 46, fontSize: 14 }} onClick={onClose}>
            Cancelar
          </button>
          <button className="irr-btn irr-btn-green" style={{ flex: 1, height: 46, fontSize: 14, fontWeight: 700 }} onClick={handleSave} disabled={!isValid}>
            {schedule ? "Guardar cambios" : "Crear horario"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
