import React, { useState, useEffect } from "react";
import { FaPowerOff, FaRegLightbulb, FaClock, FaTint, FaWater, FaBell, FaHourglass } from "react-icons/fa";
import { HeroBanner, CardPlantDecor, SmallLeaf, WaterDrops, RoseIcon } from "./SvgIllustrations";

/* Live countdown for active irrigations */
const CountdownTimer = ({ endTime }) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = endTime - now;
      if (diff <= 0) {
        setRemaining("Finalizando...");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${mins}:${String(secs).padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="irr-countdown">
      <FaHourglass style={{ fontSize: 10, color: "#fbbf24" }} />
      <span className="irr-countdown-time">{remaining}</span>
      <span className="irr-text-xxs irr-text-muted">restante</span>
    </div>
  );
};

const GpioDashboard = ({ gpioStatus, loading, togglingId, onToggleGpio, onOpenSchedule, schedules, nextIrrigation }) => {
  const activeCount = gpioStatus.filter((g) => g[2] === 1).length;
  const enabledSchedules = schedules ? schedules.filter(s => s.enabled).length : 0;

  const getScheduleCount = (gpioId) => {
    if (!schedules) return 0;
    return schedules.filter((s) => s.gpio_id === gpioId && s.enabled).length;
  };

  /* Check if a GPIO is currently running a scheduled irrigation, return end time */
  const getActiveIrrigationEnd = (gpioId) => {
    if (!schedules) return null;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = now.getDay();

    for (const s of schedules) {
      if (s.gpio_id !== gpioId || !s.enabled) continue;
      const days = s.active_days.split(",").map(Number);
      if (!days.includes(today)) continue;

      const startMin = s.time_hour * 60 + s.time_minute;
      const endMin = startMin + s.duration_minutes;

      if (nowMin >= startMin && nowMin < endMin) {
        const endTime = new Date();
        endTime.setHours(Math.floor(endMin / 60), endMin % 60, 0, 0);
        return endTime;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div>
        {/* Skeleton hero */}
        <div className="irr-skeleton" style={{ height: 160, borderRadius: 24, marginBottom: 24 }} />
        <div className="irr-grid irr-grid-summary irr-mb-6">
          <div className="irr-skeleton" style={{ height: 100, borderRadius: 20 }} />
          <div className="irr-skeleton" style={{ height: 100, borderRadius: 20 }} />
        </div>
        <div className="irr-grid irr-grid-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="irr-glass">
              <div className="irr-glass-accent" />
              <div className="irr-glass-body">
                <div className="irr-flex irr-flex-between irr-mb-4">
                  <div>
                    <div className="irr-skeleton" style={{ width: 60, height: 10, marginBottom: 8 }} />
                    <div className="irr-skeleton" style={{ width: 100, height: 16 }} />
                  </div>
                  <div className="irr-skeleton" style={{ width: 38, height: 38, borderRadius: 12 }} />
                </div>
                <div className="irr-skeleton irr-mb-4" style={{ width: 80, height: 12 }} />
                <div className="irr-skeleton irr-mb-2" style={{ width: "100%", height: 40, borderRadius: 12 }} />
                <div className="irr-skeleton" style={{ width: "100%", height: 38, borderRadius: 12 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Summary Row */}
      <div className="irr-grid irr-grid-summary irr-mb-6">
        {/* Status card */}
        <div className="irr-glass irr-summary-card">
          <CardPlantDecor variant={1} />
          <div className="irr-glass-body" style={{ position: "relative", zIndex: 1 }}>
            <div className="irr-flex irr-flex-between irr-flex-center">
              <div className="irr-flex irr-flex-center irr-gap-4">
                <div className={`irr-icon-box irr-icon-box-lg ${activeCount > 0 ? "irr-icon-box-green" : "irr-icon-box-muted"}`}>
                  <FaWater />
                </div>
                <div>
                  <div className="irr-text-big irr-text-white">
                    {activeCount}
                    <span className="irr-text-sm irr-font-medium irr-text-muted" style={{ marginLeft: 8 }}>
                      / {gpioStatus.length} encendidas
                    </span>
                  </div>
                  <div className="irr-text-xs irr-text-muted irr-mt-1">
                    {enabledSchedules} programaciones activas
                  </div>
                </div>
              </div>
              <div className={activeCount > 0 ? "irr-pill irr-pill-green" : "irr-pill irr-pill-muted"}>
                <span className={`irr-dot ${activeCount > 0 ? "irr-dot-on" : ""}`} style={activeCount === 0 ? { background: "#64748b" } : undefined} />
                {activeCount > 0 ? "Activo" : "Inactivo"}
              </div>
            </div>
          </div>
        </div>

        {/* Next irrigation / Quick stats card */}
        {nextIrrigation ? (
          <div className="irr-glass irr-summary-card" style={{ borderColor: "rgba(20,184,166,0.15)" }}>
            <CardPlantDecor variant={2} />
            <div className="irr-glass-body" style={{ position: "relative", zIndex: 1 }}>
              <div className="irr-flex irr-flex-center irr-gap-4">
                <div className="irr-icon-box irr-icon-box-lg irr-icon-box-teal">
                  <FaBell />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="irr-label">Próximo riego</div>
                  <div className="irr-text-big irr-text-white irr-mt-1">
                    {String(nextIrrigation.time_hour).padStart(2, "0")}:{String(nextIrrigation.time_minute).padStart(2, "0")}
                  </div>
                  <div className="irr-text-xs irr-text-teal irr-mt-1">
                    <RoseIcon size={12} color="#2dd4bf" />{" "}
                    {nextIrrigation.gpio_label} — {nextIrrigation.duration_minutes} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="irr-glass irr-summary-card">
            <CardPlantDecor variant={3} />
            <div className="irr-glass-body" style={{ position: "relative", zIndex: 1 }}>
              <div className="irr-flex irr-flex-center irr-gap-4">
                <div className="irr-icon-box irr-icon-box-lg irr-icon-box-teal">
                  <FaClock />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="irr-label">Horarios</div>
                  <div className="irr-text-big irr-text-white irr-mt-1">
                    {enabledSchedules}
                    <span className="irr-text-sm irr-font-medium irr-text-muted" style={{ marginLeft: 8 }}>activos</span>
                  </div>
                  <div className="irr-text-xs irr-text-muted irr-mt-1">
                    {schedules ? schedules.length : 0} totales configurados
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section title */}
      <div className="irr-flex irr-flex-between irr-flex-center irr-mb-4">
        <div className="irr-flex irr-flex-center irr-gap-3">
          <SmallLeaf size={28} style={{ opacity: 0.7 }} />
          <div>
            <div className="irr-font-bold irr-text-white" style={{ fontSize: 16 }}>Salidas GPIO</div>
            <div className="irr-text-xs irr-text-muted">{gpioStatus.length} zona{gpioStatus.length !== 1 ? "s" : ""} de riego</div>
          </div>
        </div>
      </div>

      {/* GPIO Cards */}
      <div className="irr-grid irr-grid-4">
        {gpioStatus.map((gpio, idx) => {
          const isOn = gpio[2] === 1;
          const gpioId = gpio[0];
          const label = gpio[1];
          const scheduleCount = getScheduleCount(gpioId);
          const isToggling = togglingId === gpioId;
          const irrigationEnd = isOn ? getActiveIrrigationEnd(gpioId) : null;

          return (
            <div key={gpioId} className={`irr-glass irr-gpio-card${isOn ? " active" : ""}`}>
              <CardPlantDecor variant={idx} />
              <div className="irr-glass-accent" />
              <div className="irr-glass-body" style={{ position: "relative", zIndex: 1 }}>
                <div className="irr-flex irr-flex-between irr-mb-4" style={{ alignItems: "flex-start" }}>
                  <div>
                    <div className="irr-label irr-mb-1">Salida {gpioId}</div>
                    <div className="irr-font-bold irr-text-white" style={{ fontSize: 15, lineHeight: 1.2 }}>{label}</div>
                  </div>
                  <div className={`irr-icon-box ${isOn ? "irr-icon-box-green" : "irr-icon-box-muted"}`}>
                    <FaTint />
                  </div>
                </div>

                {/* Status */}
                <div className="irr-flex irr-flex-center irr-gap-2 irr-mb-3">
                  <span className={`irr-dot ${isOn ? "irr-dot-on" : "irr-dot-off"}`} />
                  <span className={`irr-text-sm irr-font-semibold ${isOn ? "irr-text-green" : "irr-text-red"}`}>
                    {isOn ? "Encendido" : "Apagado"}
                  </span>
                </div>

                {/* Countdown timer when active irrigation */}
                {irrigationEnd && <CountdownTimer endTime={irrigationEnd} />}

                {/* Schedule count */}
                {!irrigationEnd && scheduleCount > 0 ? (
                  <div className="irr-flex irr-flex-center irr-gap-2 irr-mb-4">
                    <FaClock style={{ color: "#2dd4bf", fontSize: 12 }} />
                    <span className="irr-text-xs irr-text-teal irr-font-medium">
                      {scheduleCount} horario{scheduleCount > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : !irrigationEnd ? (
                  <div className="irr-mb-4" />
                ) : null}

                {/* Buttons */}
                <div className="irr-flex irr-flex-col irr-gap-2">
                  <button
                    className={`irr-btn irr-btn-full ${isOn ? "irr-btn-red" : "irr-btn-green"}`}
                    disabled={isToggling}
                    onClick={() => onToggleGpio(gpioId, isOn ? 0 : 1, label)}
                    style={{ height: 40 }}
                  >
                    {isToggling ? (
                      <><span className="irr-spinner" /> {isOn ? "Apagando..." : "Encendiendo..."}</>
                    ) : (
                      <>{isOn ? <FaPowerOff size={12} /> : <FaRegLightbulb size={12} />} {isOn ? "Apagar" : "Encender"}</>
                    )}
                  </button>
                  <button
                    className="irr-btn irr-btn-outline irr-btn-full"
                    onClick={() => onOpenSchedule(gpioId, label)}
                    style={{ height: 38 }}
                  >
                    <FaClock size={11} /> Programar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GpioDashboard;
