import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSync, FaUserCircle } from "react-icons/fa";
import { actionBadgeColors } from "../theme/irrigationTheme";
import { WaterDrops } from "./SvgIllustrations";
import { getLogs } from "actions/irrigation";

const actionLabels = {
  NOTIFICATION_SENT: "Notificación",
  CANCELLED: "Cancelado",
  STARTED: "Iniciado",
  COMPLETED: "Completado",
  ERROR: "Error",
  MANUAL_ON: "Manual ON",
  MANUAL_OFF: "Manual OFF",
};

const PAGE_SIZE = 15;

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "Ahora";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
  if (diff < 172800) return "Ayer";
  return d.toLocaleDateString("es-CR", { day: "2-digit", month: "short" });
};

const IrrigationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getLogs(100, 0);
      if (res && res.data && res.data.payload) {
        setLogs(res.data.payload);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = filterAction
    ? logs.filter((l) => l.action === filterAction)
    : logs;

  const paginatedLogs = filteredLogs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="irr-flex irr-flex-between irr-flex-center irr-flex-wrap irr-gap-3 irr-mb-6">
        <div>
          <div className="irr-font-bold irr-text-white" style={{ fontSize: 18 }}>Historial</div>
          <div className="irr-text-sm irr-text-muted">
            {filteredLogs.length} registro{filteredLogs.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="irr-flex irr-gap-2 irr-flex-center">
          <select
            className="irr-select"
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(0); }}
            style={{ width: 160, height: 36, fontSize: 12, padding: "8px 36px 8px 12px" }}
          >
            <option value="">Todas las acciones</option>
            {Object.entries(actionLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            className="irr-btn irr-btn-outline irr-btn-icon"
            onClick={fetchLogs}
            disabled={loading}
            style={{ width: 36, height: 36 }}
            title="Refrescar"
          >
            {loading ? <span className="irr-spinner" /> : <FaSync style={{ fontSize: 12 }} />}
          </button>
        </div>
      </div>

      {/* Log list */}
      <div className="irr-glass" style={{ overflow: "hidden" }}>
        {loading && logs.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 20px", gap: 12 }}>
            <span className="irr-spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            <span className="irr-text-xs irr-text-muted">Cargando historial...</span>
          </div>
        ) : paginatedLogs.length === 0 ? (
          <div className="irr-empty">
            <WaterDrops size={70} style={{ margin: "0 auto 12px", opacity: 0.6 }} />
            <div className="irr-text-sm irr-text-muted irr-font-medium">Sin registros</div>
            <div className="irr-text-xs irr-text-dim irr-mt-1">
              {filterAction ? "Prueba cambiando el filtro" : "Los eventos de riego aparecerán aquí"}
            </div>
          </div>
        ) : (
          <div>
            {paginatedLogs.map((log) => {
              const badge = actionBadgeColors[log.action] || { bg: "rgba(100,116,139,0.1)", color: "#64748b" };

              return (
                <div key={log.id} className="irr-log-row">
                  {/* Color dot */}
                  <span
                    className="irr-dot"
                    style={{ background: badge.color, boxShadow: `0 0 6px ${badge.color}30` }}
                  />

                  {/* Time ago */}
                  <span className="irr-text-xs irr-text-dim irr-font-medium" style={{ minWidth: 80, flexShrink: 0 }}>
                    {timeAgo(log.executed_at)}
                  </span>

                  {/* GPIO */}
                  <span className="irr-text-sm irr-text-white irr-font-medium" style={{ minWidth: 90, flexShrink: 0 }}>
                    {log.gpio_label || `Salida ${log.gpio_id}`}
                  </span>

                  {/* Action badge */}
                  <span
                    className="irr-badge"
                    style={{ background: badge.bg, color: badge.color, flexShrink: 0 }}
                  >
                    {actionLabels[log.action] || log.action}
                  </span>

                  {/* Message */}
                  <span className="irr-text-xs irr-text-muted" style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {log.message || ""}
                  </span>

                  {/* Created by */}
                  <span className="irr-badge" style={{ background: "rgba(20,184,166,0.1)", color: "#2dd4bf", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <FaUserCircle style={{ fontSize: 10 }} />
                    {log.created_by || "Sistema"}
                  </span>

                  {/* Cancelled by */}
                  {log.cancelled_by && (
                    <span className="irr-text-xs irr-text-red irr-font-medium" style={{ flexShrink: 0 }}>
                      {log.cancelled_by}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="irr-pagination">
            <button
              className="irr-page-btn"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <FaChevronLeft style={{ fontSize: 10 }} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i;
              } else if (page < 4) {
                pageNum = i;
              } else if (page > totalPages - 5) {
                pageNum = totalPages - 7 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`irr-page-btn${pageNum === page ? " active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              className="irr-page-btn"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              <FaChevronRight style={{ fontSize: 10 }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IrrigationLogs;
