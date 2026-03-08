import React, { useState, useEffect } from "react";
import { FaPowerOff, FaRegLightbulb, FaClock, FaTint, FaHourglass } from "react-icons/fa";
import { HeroBanner, CardPlantDecor, SmallLeaf } from "./SvgIllustrations";

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
        {/* Skeleton hero slim */}
        <div className="irr-skeleton" style={{ height: 80, borderRadius: 18, marginBottom: 16 }} />
        {/* Skeleton GPIO cards */}
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
      {/* Slim Hero Banner with stats */}
      <HeroBanner
        activeCount={activeCount}
        totalGpios={gpioStatus.length}
        enabledSchedules={enabledSchedules}
        nextIrrigation={nextIrrigation}
      />

      {/* Section title */}
      <div className="irr-flex irr-flex-between irr-flex-center irr-mb-3">
        <div className="irr-flex irr-flex-center irr-gap-3">
          <SmallLeaf size={24} style={{ opacity: 0.7 }} />
          <div>
            <div className="irr-font-bold irr-text-white" style={{ fontSize: 14 }}>Salidas GPIO</div>
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
                <div className="irr-flex irr-flex-between irr-mb-3" style={{ alignItems: "flex-start" }}>
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
                  <div className="irr-flex irr-flex-center irr-gap-2 irr-mb-3">
                    <FaClock style={{ color: "#2dd4bf", fontSize: 12 }} />
                    <span className="irr-text-xs irr-text-teal irr-font-medium">
                      {scheduleCount} horario{scheduleCount > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : !irrigationEnd ? (
                  <div className="irr-mb-3" />
                ) : null}

                {/* Buttons */}
                <div className="irr-flex irr-flex-col irr-gap-2">
                  <button
                    className={`irr-btn irr-btn-full ${isOn ? "irr-btn-red" : "irr-btn-green"}`}
                    disabled={isToggling}
                    onClick={() => onToggleGpio(gpioId, isOn ? 0 : 1, label)}
                    style={{ height: 38 }}
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
                    style={{ height: 36 }}
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
