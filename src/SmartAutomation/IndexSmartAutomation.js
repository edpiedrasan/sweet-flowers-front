import React, { useState, useEffect, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  FaArrowLeft,
  FaThLarge,
  FaClock,
  FaChartLine,
  FaHistory,
  FaLeaf,
} from "react-icons/fa";
import GpioDashboard from "./components/GpioDashboard";
import ScheduleManager from "./components/ScheduleManager";
import TodayTimeline from "./components/TodayTimeline";
import IrrigationLogs from "./components/IrrigationLogs";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
  getGpioStatus,
  toggleGpio,
} from "actions/irrigation";

import "./Irrigation.css";

const tabItems = [
  { label: "Dashboard", icon: FaThLarge },
  { label: "Programación", icon: FaClock },
  { label: "Timeline", icon: FaChartLine },
  { label: "Historial", icon: FaHistory },
];

const REFRESH_INTERVAL = 15000;

/* ---- Simple toast ---- */
const ToastMessage = ({ toast, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const bg =
    toast.status === "success"
      ? "rgba(0,230,138,0.18)"
      : toast.status === "error"
      ? "rgba(239,68,68,0.18)"
      : "rgba(20,184,166,0.15)";
  const border =
    toast.status === "success"
      ? "rgba(0,230,138,0.4)"
      : toast.status === "error"
      ? "rgba(239,68,68,0.4)"
      : "rgba(20,184,166,0.35)";
  const color =
    toast.status === "success"
      ? "#34d399"
      : toast.status === "error"
      ? "#f87171"
      : "#2dd4bf";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "14px 20px",
        backdropFilter: "blur(20px)",
        animation: "slideUp 0.3s ease",
        maxWidth: 320,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, color, marginBottom: 2 }}>
        {toast.title}
      </div>
      {toast.desc && (
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{toast.desc}</div>
      )}
    </div>
  );
};

export const IndexSmartAutomation = () => {
  const history = useHistory();
  const refreshRef = useRef(null);

  const [gpioStatus, setGpioStatus] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (title, desc, status) => {
    setToast({ title, desc, status });
  };

  const fetchGpioStatus = useCallback(async (silent = false) => {
    try {
      const res = await getGpioStatus();
      if (res && res.data && res.data.payload) {
        setGpioStatus(res.data.payload);
      } else {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) setGpioStatus(await response.json());
      }
    } catch (error) {
      try {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) setGpioStatus(await response.json());
      } catch (err) {
        if (!silent) console.error("Error fetching GPIO:", err);
      }
    }
    if (!silent) setLoading(false);
  }, []);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await getSchedules();
      if (res && res.data && res.data.payload) {
        setSchedules(res.data.payload);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }, []);

  useEffect(() => {
    fetchGpioStatus();
    fetchSchedules();
  }, [fetchGpioStatus, fetchSchedules]);

  useEffect(() => {
    refreshRef.current = setInterval(() => {
      fetchGpioStatus(true);
    }, REFRESH_INTERVAL);
    return () => clearInterval(refreshRef.current);
  }, [fetchGpioStatus]);

  const handleToggleGpio = async (gpioId, turn, label) => {
    try {
      setTogglingId(gpioId);
      await toggleGpio(gpioId, turn, label);
      await fetchGpioStatus();
      showToast(
        turn === 1 ? "Encendido" : "Apagado",
        `${label} (Salida ${gpioId})`,
        turn === 1 ? "success" : "info"
      );
    } catch (error) {
      showToast("Error", "No se pudo cambiar el estado", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenSchedule = (gpioId, label) => {
    setTabIndex(1);
  };

  const handleCreateSchedule = async (data) => {
    try {
      await createSchedule(data);
      await fetchSchedules();
      showToast("Horario creado", `${data.gpio_label} a las ${String(data.time_hour).padStart(2, "0")}:${String(data.time_minute).padStart(2, "0")}`, "success");
    } catch (error) {
      showToast("Error", "No se pudo crear el horario", "error");
    }
  };

  const handleUpdateSchedule = async (id, data) => {
    try {
      await updateSchedule(id, data);
      await fetchSchedules();
      showToast("Actualizado", "Horario modificado con éxito", "success");
    } catch (error) {
      showToast("Error", "No se pudo actualizar", "error");
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      await fetchSchedules();
      showToast("Eliminado", "Horario removido", "info");
    } catch (error) {
      showToast("Error", "No se pudo eliminar", "error");
    }
  };

  const handleToggleSchedule = async (id, enabled) => {
    try {
      await toggleSchedule(id, enabled);
      await fetchSchedules();
    } catch (error) {
      showToast("Error", "No se pudo cambiar estado", "error");
    }
  };

  const getNextIrrigation = () => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = now.getDay();
    const enabled = schedules.filter((s) => {
      if (!s.enabled) return false;
      const days = s.active_days.split(",").map(Number);
      return days.includes(today);
    });
    const upcoming = enabled
      .filter((s) => s.time_hour * 60 + s.time_minute > nowMin)
      .sort((a, b) => (a.time_hour * 60 + a.time_minute) - (b.time_hour * 60 + b.time_minute));
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const nextIrrigation = getNextIrrigation();
  const activeCount = gpioStatus.filter((g) => g[2] === 1).length;
  const enabledSchedules = schedules.filter((s) => s.enabled).length;

  const panels = [
    <GpioDashboard
      key="dash"
      gpioStatus={gpioStatus}
      loading={loading}
      togglingId={togglingId}
      onToggleGpio={handleToggleGpio}
      onOpenSchedule={handleOpenSchedule}
      schedules={schedules}
      nextIrrigation={nextIrrigation}
    />,
    <ScheduleManager
      key="sched"
      schedules={schedules}
      onUpdate={handleUpdateSchedule}
      onDelete={handleDeleteSchedule}
      onToggle={handleToggleSchedule}
      onCreate={handleCreateSchedule}
      gpioStatus={gpioStatus}
    />,
    <TodayTimeline key="tl" schedules={schedules} />,
    <IrrigationLogs key="logs" />,
  ];

  return (
    <div className="irr">
      <div className="irr-content">
        {/* Header */}
        <div className="irr-header">
          <div className="irr-header-left">
            <div className="irr-header-icon">
              <FaLeaf />
            </div>
            <div>
              <h1 className="irr-header-title irr-gradient-text">Control de Riego</h1>
              <div className="irr-header-meta">
                <span className={activeCount > 0 ? "dot" : ""} style={activeCount === 0 ? { width: 6, height: 6, borderRadius: "50%", background: "#475569", display: "inline-block" } : undefined} />
                <span>{activeCount} activas</span>
                <span className="sep">|</span>
                <span><FaClock style={{ display: "inline", verticalAlign: "middle", marginRight: 4, fontSize: 10 }} />{enabledSchedules} horarios</span>
                {nextIrrigation && (
                  <>
                    <span className="sep">|</span>
                    <span className="next">
                      Próximo: {String(nextIrrigation.time_hour).padStart(2, "0")}:{String(nextIrrigation.time_minute).padStart(2, "0")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="irr-btn irr-btn-ghost irr-btn-sm" onClick={() => history.goBack()}>
            <FaArrowLeft size={10} /> Volver
          </button>
        </div>

        {/* Tabs */}
        <div className="irr-tabs">
          {tabItems.map((tab, idx) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={idx}
                className={`irr-tab${tabIndex === idx ? " active" : ""}`}
                onClick={() => setTabIndex(idx)}
              >
                <TabIcon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="irr-panel" key={tabIndex}>
          {panels[tabIndex]}
        </div>
      </div>

      {/* Toast */}
      {toast && <ToastMessage toast={toast} onDone={() => setToast(null)} />}
    </div>
  );
};
