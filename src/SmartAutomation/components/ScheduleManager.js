import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaClock, FaTint, FaHourglass, FaCalendarAlt, FaTimes } from "react-icons/fa";
import ScheduleForm from "./ScheduleForm";

const ScheduleManager = ({ schedules, onUpdate, onDelete, onToggle, onCreate, gpioStatus }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedGpio, setSelectedGpio] = useState({ id: 0, label: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedGpio({ id: schedule.gpio_id, label: schedule.gpio_label });
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    if (gpioStatus && gpioStatus.length > 0) {
      setSelectedGpio({ id: gpioStatus[0][0], label: gpioStatus[0][1] });
    }
    setFormOpen(true);
  };

  const handleSave = (formData) => {
    if (editingSchedule) {
      onUpdate(editingSchedule.id, formData);
    } else {
      onCreate(formData);
    }
  };

  const executeDelete = () => {
    if (deleteConfirm) onDelete(deleteConfirm);
    setDeleteConfirm(null);
  };

  const enabledCount = schedules.filter((s) => s.enabled).length;

  return (
    <div>
      {/* Header */}
      <div className="irr-flex irr-flex-between irr-flex-center irr-mb-6">
        <div>
          <div className="irr-font-bold irr-text-white" style={{ fontSize: 18 }}>Programación</div>
          <div className="irr-text-sm irr-text-muted">{enabledCount} de {schedules.length} activos</div>
        </div>
        <button className="irr-btn irr-btn-green irr-btn-sm" onClick={handleAdd}>
          <FaPlus size={10} /> Nuevo horario
        </button>
      </div>

      {/* Empty state */}
      {schedules.length === 0 ? (
        <div className="irr-glass">
          <div className="irr-empty">
            <div className="irr-empty-icon"><FaCalendarAlt /></div>
            <div className="irr-text-sm irr-text-muted irr-font-medium">No hay horarios programados</div>
            <div className="irr-text-xs irr-text-dim irr-mt-1" style={{ maxWidth: 260, margin: "6px auto 0" }}>
              Crea un horario para automatizar el riego de tus salidas GPIO
            </div>
            <button className="irr-btn irr-btn-green irr-btn-sm irr-mt-3" onClick={handleAdd}>
              <FaPlus size={10} /> Crear primer horario
            </button>
          </div>
        </div>
      ) : (
        <div className="irr-grid irr-grid-3">
          {schedules.map((s) => (
            <div
              key={s.id}
              className={`irr-glass${s.enabled ? " active" : ""}`}
            >
              <div className="irr-glass-accent" />
              <div className="irr-glass-body">
                {/* Header: label + toggle */}
                <div className="irr-flex irr-flex-between irr-mb-4" style={{ alignItems: "flex-start" }}>
                  <div className="irr-flex irr-flex-center irr-gap-3">
                    <div className={`irr-icon-box ${s.enabled ? "irr-icon-box-green" : "irr-icon-box-muted"}`}>
                      <FaTint />
                    </div>
                    <div>
                      <div className="irr-text-sm irr-font-semibold irr-text-white">{s.gpio_label}</div>
                      <div className="irr-label">Salida {s.gpio_id}</div>
                    </div>
                  </div>
                  <label className="irr-switch">
                    <input
                      type="checkbox"
                      checked={s.enabled === 1}
                      onChange={() => onToggle(s.id, s.enabled === 1 ? 0 : 1)}
                    />
                    <span className="irr-switch-track" />
                    <span className="irr-switch-thumb" />
                  </label>
                </div>

                {/* Time & Duration pills */}
                <div className="irr-flex irr-gap-3 irr-mb-4">
                  <div className="irr-inner-card">
                    <div className="irr-flex irr-flex-center irr-gap-2 irr-mb-1">
                      <FaClock style={{ color: "#34d399", fontSize: 10 }} />
                      <span className="irr-label">Hora</span>
                    </div>
                    <div className="irr-text-xl irr-text-white">{formatTime(s.time_hour, s.time_minute)}</div>
                  </div>
                  <div className="irr-inner-card">
                    <div className="irr-flex irr-flex-center irr-gap-2 irr-mb-1">
                      <FaHourglass style={{ color: "#2dd4bf", fontSize: 10 }} />
                      <span className="irr-label">Duración</span>
                    </div>
                    <div className="irr-text-xl irr-text-white">
                      {s.duration_minutes}
                      <span className="irr-text-xs irr-text-muted irr-font-medium" style={{ marginLeft: 4 }}>min</span>
                    </div>
                  </div>
                </div>

                {/* Footer: info + actions */}
                <div className="irr-flex irr-flex-between irr-flex-center">
                  <div className="irr-flex irr-flex-center irr-gap-2">
                    <FaCalendarAlt style={{ color: "#475569", fontSize: 10 }} />
                    <span className="irr-text-xs irr-text-muted">Todos los días</span>
                  </div>
                  <div className="irr-flex irr-gap-2">
                    <button
                      className="irr-btn irr-btn-icon irr-btn-outline"
                      style={{ color: "#2dd4bf", borderColor: "transparent" }}
                      onClick={() => handleEdit(s)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="irr-btn irr-btn-icon irr-btn-outline"
                      style={{ color: "#ef4444", borderColor: "transparent" }}
                      onClick={() => setDeleteConfirm(s.id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule form modal */}
      <ScheduleForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        schedule={editingSchedule}
        gpioId={selectedGpio.id}
        gpioLabel={selectedGpio.label}
        gpioOptions={gpioStatus}
      />

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div className="irr-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="irr-modal" style={{ maxWidth: 380 }}>
            <div className="irr-modal-header">
              <div className="irr-font-bold irr-text-white" style={{ fontSize: 16 }}>Eliminar horario</div>
            </div>
            <div className="irr-modal-body">
              <div className="irr-text-sm irr-text-muted">
                ¿Estás seguro? Esta acción no se puede deshacer.
              </div>
            </div>
            <div className="irr-modal-footer">
              <button className="irr-btn irr-btn-outline" style={{ flex: 1, fontSize: 14 }} onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="irr-btn irr-btn-red" style={{ flex: 1, fontSize: 14, fontWeight: 600 }} onClick={executeDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
