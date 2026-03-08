// Irrigation Premium Plant-Care Dark Theme
export const colors = {
  bg: {
    deep: "#061212",
    primary: "#0a1a1a",
    secondary: "#0f2420",
    card: "rgba(16, 52, 44, 0.55)",
    cardSolid: "#0f2e26",
    cardHover: "rgba(20, 65, 54, 0.65)",
    glass: "rgba(16, 58, 48, 0.35)",
    glassHover: "rgba(20, 72, 58, 0.5)",
    input: "rgba(10, 30, 25, 0.8)",
    overlay: "rgba(4, 12, 10, 0.85)",
  },
  green: {
    50: "#e6fff5",
    100: "#b3ffe0",
    200: "#66ffc2",
    300: "#33ffad",
    400: "#00e68a",
    500: "#00cc7a",
    600: "#00b36b",
    700: "#009959",
    800: "#006b3e",
    900: "#003d23",
    glow: "#00e68a",
    neon: "#00ff94",
    soft: "#34d399",
    muted: "#2dd4a0",
    deep: "#059669",
  },
  teal: {
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    glow: "#14b8a6",
  },
  text: {
    primary: "#f0fdf4",
    secondary: "#94a3b8",
    muted: "#64748b",
    accent: "#34d399",
    dim: "#475569",
  },
  border: {
    default: "rgba(52, 211, 153, 0.12)",
    active: "rgba(0, 230, 138, 0.4)",
    subtle: "rgba(52, 211, 153, 0.06)",
    glow: "rgba(0, 230, 138, 0.25)",
  },
  status: {
    on: "#00e68a",
    off: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
};

export const gradients = {
  bg: "linear-gradient(160deg, #061212 0%, #0a1f1a 40%, #0d2818 100%)",
  card: "linear-gradient(135deg, rgba(16, 52, 44, 0.6) 0%, rgba(10, 36, 30, 0.4) 100%)",
  cardActive: "linear-gradient(135deg, rgba(0, 230, 138, 0.12) 0%, rgba(16, 52, 44, 0.5) 100%)",
  cardHover: "linear-gradient(135deg, rgba(20, 65, 54, 0.7) 0%, rgba(14, 42, 36, 0.5) 100%)",
  greenButton: "linear-gradient(135deg, #00cc7a 0%, #059669 100%)",
  greenButtonHover: "linear-gradient(135deg, #00e68a 0%, #06a871 100%)",
  redButton: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  header: "linear-gradient(135deg, #00e68a 0%, #14b8a6 50%, #0ea5e9 100%)",
  tabActive: "linear-gradient(135deg, rgba(0, 230, 138, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%)",
  timeline: "linear-gradient(90deg, rgba(0, 230, 138, 0.08) 0%, rgba(20, 184, 166, 0.04) 100%)",
  glow: "radial-gradient(ellipse at center, rgba(0, 230, 138, 0.15) 0%, transparent 70%)",
};

export const glassCard = {
  bg: gradients.card,
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid",
  borderColor: colors.border.default,
  overflow: "hidden",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const glassCardHover = {
  borderColor: colors.border.glow,
  transform: "translateY(-4px)",
  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 230, 138, 0.06)`,
};

export const actionBadgeColors = {
  NOTIFICATION_SENT: { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", icon: "bell" },
  CANCELLED: { bg: "rgba(239, 68, 68, 0.15)", color: "#f87171", icon: "x" },
  STARTED: { bg: "rgba(0, 230, 138, 0.15)", color: "#00e68a", icon: "play" },
  COMPLETED: { bg: "rgba(20, 184, 166, 0.15)", color: "#2dd4bf", icon: "check" },
  ERROR: { bg: "rgba(239, 68, 68, 0.15)", color: "#f87171", icon: "alert" },
  MANUAL_ON: { bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", icon: "zap" },
  MANUAL_OFF: { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", icon: "power" },
};

export const gpioColors = [
  "#00e68a",
  "#14b8a6",
  "#0ea5e9",
  "#f59e0b",
  "#a78bfa",
  "#f87171",
  "#fb923c",
  "#34d399",
];
