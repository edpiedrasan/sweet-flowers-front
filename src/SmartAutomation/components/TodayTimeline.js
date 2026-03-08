import React from "react";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { gpioColors } from "../theme/irrigationTheme";
import { RosePlant } from "./SvgIllustrations";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const TodayTimeline = ({ schedules }) => {
  const today = new Date().getDay();

  const todaySchedules = schedules.filter((s) => {
    if (!s.enabled) return false;
    const days = s.active_days.split(",").map(Number);
    return days.includes(today);
  });

  const gpioIds = [...new Set(todaySchedules.map((s) => s.gpio_id))];
  const gpioColorMap = {};
  gpioIds.forEach((id, idx) => {
    gpioColorMap[id] = gpioColors[idx % gpioColors.length];
  });

  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowPercent = (nowMinutes / (24 * 60)) * 100;

  const sorted = [...todaySchedules].sort(
    (a, b) => (a.time_hour * 60 + a.time_minute) - (b.time_hour * 60 + b.time_minute)
  );

  return (
    <div>
      {/* Header */}
      <div className="irr-flex irr-flex-between irr-flex-center irr-mb-6">
        <div>
          <div className="irr-font-bold irr-text-white" style={{ fontSize: 18 }}>Línea de Tiempo</div>
          <div className="irr-text-sm irr-text-muted">
            {todaySchedules.length} riego{todaySchedules.length !== 1 ? "s" : ""} hoy
          </div>
        </div>
        <div className="irr-pill irr-pill-green">
          <span className="irr-dot irr-dot-on" />
          <span className="irr-font-bold">{formatTime(now.getHours(), now.getMinutes())}</span>
        </div>
      </div>

      {/* Legend chips */}
      {gpioIds.length > 0 && (
        <div className="irr-flex irr-gap-2 irr-flex-wrap irr-mb-4">
          {gpioIds.map((id) => {
            const s = todaySchedules.find((s) => s.gpio_id === id);
            const color = gpioColorMap[id];
            return (
              <div
                key={id}
                className="irr-flex irr-flex-center irr-gap-2"
                style={{
                  background: color + "08",
                  padding: "6px 12px",
                  borderRadius: 100,
                  border: `1px solid ${color}20`,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}40`, display: "inline-block" }} />
                <span className="irr-text-xs irr-text-muted irr-font-medium">
                  {s ? s.gpio_label : `Salida ${id}`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline card */}
      <div className="irr-glass">
        <div className="irr-glass-body">
          {todaySchedules.length === 0 ? (
            <div className="irr-empty">
              <RosePlant size={100} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <div className="irr-text-sm irr-text-muted irr-font-medium">No hay riegos programados para hoy</div>
              <div className="irr-text-xs irr-text-dim irr-mt-1">Crea un horario en la pestaña Programación</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <div style={{ position: "relative", minWidth: 700 }}>
                {/* Hour labels */}
                <div className="irr-flex irr-mb-2">
                  {HOURS.filter((h) => h % 3 === 0).map((h) => (
                    <span
                      key={h}
                      className="irr-text-dim"
                      style={{ fontSize: 10, fontWeight: 500, width: `${(3 / 24) * 100}%`, flexShrink: 0, letterSpacing: "0.02em" }}
                    >
                      {String(h).padStart(2, "0")}
                    </span>
                  ))}
                </div>

                {/* Timeline bar */}
                <div className="irr-timeline-bar">
                  {/* Grid lines */}
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{
                        position: "absolute",
                        left: `${(h / 24) * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        background: h % 6 === 0 ? "rgba(52,211,153,0.08)" : "rgba(52,211,153,0.025)",
                      }}
                    />
                  ))}

                  {/* Schedule blocks */}
                  {sorted.map((s, idx) => {
                    const startMin = s.time_hour * 60 + s.time_minute;
                    const left = `${(startMin / (24 * 60)) * 100}%`;
                    const width = `${Math.max((s.duration_minutes / (24 * 60)) * 100, 0.5)}%`;
                    const color = gpioColorMap[s.gpio_id];
                    const isActive = startMin <= nowMinutes && startMin + s.duration_minutes > nowMinutes;

                    return (
                      <div
                        key={s.id || idx}
                        className="irr-timeline-block"
                        style={{
                          left: left,
                          width: width,
                          background: isActive ? `${color}50` : `${color}25`,
                          border: `1px solid ${isActive ? color + "70" : color + "40"}`,
                          boxShadow: isActive ? `0 0 12px ${color}30` : "none",
                        }}
                        title={`${s.gpio_label}: ${formatTime(s.time_hour, s.time_minute)} — ${s.duration_minutes}min`}
                      >
                        <span style={{ padding: "0 4px", opacity: 0.9 }}>
                          {formatTime(s.time_hour, s.time_minute)}
                        </span>
                      </div>
                    );
                  })}

                  {/* Current time line */}
                  <div className="irr-timeline-now" style={{ left: `${nowPercent}%` }}>
                    <div className="irr-timeline-now-dot" />
                  </div>
                </div>

                {/* Detail cards below */}
                <div className="irr-grid irr-grid-3 irr-mt-3">
                  {sorted.map((s) => {
                    const color = gpioColorMap[s.gpio_id];
                    const startMin = s.time_hour * 60 + s.time_minute;
                    const isPast = startMin + s.duration_minutes < nowMinutes;
                    const isActive = startMin <= nowMinutes && startMin + s.duration_minutes > nowMinutes;

                    return (
                      <div
                        key={s.id}
                        className="irr-flex irr-flex-center irr-gap-3"
                        style={{
                          background: isActive ? `${color}0A` : "rgba(10,30,25,0.8)",
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: `1px solid ${isActive ? color + "30" : "rgba(52,211,153,0.06)"}`,
                          opacity: isPast ? 0.45 : 1,
                          transition: "all 0.25s ease",
                        }}
                      >
                        <span
                          className="irr-dot"
                          style={{
                            background: color,
                            boxShadow: isActive ? `0 0 10px ${color}` : "none",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="irr-flex irr-flex-center irr-gap-2">
                            <span className="irr-text-sm irr-font-bold irr-text-white" style={{ lineHeight: 1 }}>
                              {formatTime(s.time_hour, s.time_minute)}
                            </span>
                            {isActive && (
                              <span
                                className="irr-badge"
                                style={{ background: `${color}15`, color: color, fontSize: 8, letterSpacing: "0.08em" }}
                              >
                                EN CURSO
                              </span>
                            )}
                            {isPast && (
                              <span className="irr-text-dim" style={{ fontSize: 9, fontWeight: 500 }}>Completado</span>
                            )}
                          </div>
                          <div className="irr-text-xs irr-text-muted irr-mt-1" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.gpio_label} — {s.duration_minutes} min
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayTimeline;
