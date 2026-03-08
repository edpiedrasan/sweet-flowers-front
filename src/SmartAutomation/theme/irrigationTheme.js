// Irrigation Dark Theme Colors & Styles
export const colors = {
  bg: {
    primary: "#0d1117",
    secondary: "#1a2332",
    card: "#1d2a3a",
    cardHover: "#243347",
    input: "#0d1117",
  },
  accent: {
    green: "#1DB954",
    greenDark: "#17a348",
    blue: "#1E90FF",
    blueDark: "#1a7de6",
    red: "#E74C3C",
    orange: "#F39C12",
    purple: "#9B59B6",
    cyan: "#00D4AA",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#8B949E",
    muted: "#6B7280",
  },
  border: {
    default: "#30363D",
    active: "#1DB954",
    hover: "#484F58",
  },
};

export const cardStyle = {
  bg: colors.bg.card,
  borderRadius: "12px",
  border: "1px solid",
  borderColor: colors.border.default,
  p: 4,
  transition: "all 0.3s ease",
  _hover: {
    borderColor: colors.border.hover,
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },
};

export const cardActiveStyle = {
  ...cardStyle,
  borderColor: colors.accent.green,
  boxShadow: `0 0 15px rgba(29, 185, 84, 0.15)`,
};

export const actionBadgeColors = {
  NOTIFICATION_SENT: { bg: "#1E90FF20", color: "#1E90FF" },
  CANCELLED: { bg: "#E74C3C20", color: "#E74C3C" },
  STARTED: { bg: "#1DB95420", color: "#1DB954" },
  COMPLETED: { bg: "#00D4AA20", color: "#00D4AA" },
  ERROR: { bg: "#E74C3C20", color: "#E74C3C" },
  MANUAL_ON: { bg: "#F39C1220", color: "#F39C12" },
  MANUAL_OFF: { bg: "#9B59B620", color: "#9B59B6" },
};

export const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const dayValues = [0, 1, 2, 3, 4, 5, 6];
