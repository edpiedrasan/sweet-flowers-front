import React from "react";

/* Inline SVG illustrations for the irrigation dashboard — no external images needed */

export const RosePlant = ({ size = 180, style }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={style}>
    {/* Stem */}
    <path d="M100 180 C100 140, 95 120, 100 90" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M100 130 C85 115, 70 118, 60 125" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M100 150 C115 135, 130 138, 138 145" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Leaves */}
    <ellipse cx="55" cy="122" rx="18" ry="10" transform="rotate(-25 55 122)" fill="rgba(0,230,138,0.15)" stroke="rgba(0,230,138,0.3)" strokeWidth="1" />
    <path d="M55 122 C50 118, 45 122, 55 122" stroke="rgba(0,230,138,0.25)" strokeWidth="0.8" fill="none" />
    <ellipse cx="143" cy="142" rx="18" ry="10" transform="rotate(25 143 142)" fill="rgba(0,230,138,0.15)" stroke="rgba(0,230,138,0.3)" strokeWidth="1" />
    <path d="M143 142 C148 138, 153 142, 143 142" stroke="rgba(0,230,138,0.25)" strokeWidth="0.8" fill="none" />
    {/* Rose bloom */}
    <circle cx="100" cy="72" r="28" fill="rgba(239,68,68,0.08)" />
    <path d="M100 50 C88 55, 78 65, 80 78 C82 88, 92 92, 100 90 C108 92, 118 88, 120 78 C122 65, 112 55, 100 50Z" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
    <path d="M100 55 C93 60, 87 68, 90 76 C92 82, 97 84, 100 83 C103 84, 108 82, 110 76 C113 68, 107 60, 100 55Z" fill="rgba(251,113,133,0.2)" stroke="rgba(251,113,133,0.3)" strokeWidth="0.8" />
    <path d="M100 60 C96 64, 93 70, 95 74 C97 77, 99 78, 100 77 C101 78, 103 77, 105 74 C107 70, 104 64, 100 60Z" fill="rgba(251,113,133,0.25)" />
    {/* Small thorns */}
    <path d="M97 135 L93 131" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M103 155 L107 151" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
    {/* Ground */}
    <ellipse cx="100" cy="182" rx="30" ry="6" fill="rgba(0,230,138,0.06)" />
  </svg>
);

export const LeafBranch = ({ size = 120, style, flip }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }}>
    <path d="M60 110 C60 80, 55 60, 50 40 C48 30, 55 20, 60 15" stroke="rgba(0,230,138,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <ellipse cx="42" cy="55" rx="20" ry="12" transform="rotate(-30 42 55)" fill="rgba(0,230,138,0.08)" stroke="rgba(0,230,138,0.15)" strokeWidth="0.8" />
    <path d="M42 55 L34 48" stroke="rgba(0,230,138,0.12)" strokeWidth="0.5" />
    <ellipse cx="65" cy="35" rx="18" ry="10" transform="rotate(20 65 35)" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.15)" strokeWidth="0.8" />
    <ellipse cx="48" cy="78" rx="14" ry="8" transform="rotate(-20 48 78)" fill="rgba(0,230,138,0.06)" stroke="rgba(0,230,138,0.12)" strokeWidth="0.8" />
  </svg>
);

export const WaterDrops = ({ size = 60, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={style}>
    <path d="M20 10 C20 10, 10 25, 10 32 C10 38, 14.5 42, 20 42 C25.5 42, 30 38, 30 32 C30 25, 20 10, 20 10Z" fill="rgba(14,165,233,0.12)" stroke="rgba(14,165,233,0.25)" strokeWidth="1" />
    <ellipse cx="17" cy="28" rx="3" ry="4" fill="rgba(14,165,233,0.15)" />
    <path d="M42 22 C42 22, 36 31, 36 35 C36 39, 38.7 41, 42 41 C45.3 41, 48 39, 48 35 C48 31, 42 22, 42 22Z" fill="rgba(0,230,138,0.1)" stroke="rgba(0,230,138,0.2)" strokeWidth="0.8" />
    <path d="M30 35 C30 35, 27 40, 27 42 C27 44, 28.3 45, 30 45 C31.7 45, 33 44, 33 42 C33 40, 30 35, 30 35Z" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.2)" strokeWidth="0.6" />
  </svg>
);

export const SmallLeaf = ({ size = 40, color = "rgba(0,230,138,0.15)", style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
    <path d="M20 35 C20 35, 20 20, 12 8 C12 8, 25 12, 28 25 C30 32, 22 36, 20 35Z" fill={color} stroke="rgba(0,230,138,0.2)" strokeWidth="0.8" />
    <path d="M20 35 C19 25, 16 16, 12 8" stroke="rgba(0,230,138,0.15)" strokeWidth="0.5" fill="none" />
  </svg>
);

export const RoseIcon = ({ size = 24, color = "#f87171" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3 C9 5, 6 9, 7 13 C7.5 15, 9 17, 12 17 C15 17, 16.5 15, 17 13 C18 9, 15 5, 12 3Z" fill={color} opacity="0.3" />
    <path d="M12 5 C10 7, 8.5 10, 9 12.5 C9.3 14, 10.5 15, 12 15 C13.5 15, 14.7 14, 15 12.5 C15.5 10, 14 7, 12 5Z" fill={color} opacity="0.5" />
    <path d="M12 17 L12 22" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 19 C10 17.5, 8 18, 7 19" stroke="#059669" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

export const CardPlantDecor = ({ variant = 0 }) => {
  const variants = [
    // Leaf pattern bottom-right
    <svg key="0" width="100" height="80" viewBox="0 0 100 80" fill="none" style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.6 }}>
      <ellipse cx="85" cy="65" rx="30" ry="18" transform="rotate(-15 85 65)" fill="rgba(0,230,138,0.04)" />
      <ellipse cx="70" cy="55" rx="22" ry="13" transform="rotate(-25 70 55)" fill="rgba(0,230,138,0.05)" stroke="rgba(0,230,138,0.08)" strokeWidth="0.5" />
      <path d="M75 75 C72 60, 80 50, 90 45" stroke="rgba(0,230,138,0.08)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>,
    // Water ripples
    <svg key="1" width="90" height="70" viewBox="0 0 90 70" fill="none" style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.5 }}>
      <circle cx="70" cy="55" r="15" stroke="rgba(14,165,233,0.08)" strokeWidth="0.8" fill="none" />
      <circle cx="70" cy="55" r="25" stroke="rgba(14,165,233,0.05)" strokeWidth="0.6" fill="none" />
      <circle cx="70" cy="55" r="35" stroke="rgba(14,165,233,0.03)" strokeWidth="0.5" fill="none" />
      <circle cx="70" cy="55" r="4" fill="rgba(14,165,233,0.08)" />
    </svg>,
    // Small rose
    <svg key="2" width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ position: "absolute", bottom: -5, right: -5, opacity: 0.5 }}>
      <path d="M60 30 C54 34, 48 40, 50 48 C51 52, 55 55, 60 55 C65 55, 69 52, 70 48 C72 40, 66 34, 60 30Z" fill="rgba(251,113,133,0.06)" stroke="rgba(251,113,133,0.1)" strokeWidth="0.8" />
      <path d="M60 55 L60 72" stroke="rgba(0,230,138,0.1)" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="52" cy="64" rx="8" ry="4" transform="rotate(-20 52 64)" fill="rgba(0,230,138,0.05)" />
    </svg>,
    // Dots pattern
    <svg key="3" width="80" height="60" viewBox="0 0 80 60" fill="none" style={{ position: "absolute", bottom: 5, right: 5, opacity: 0.4 }}>
      {[0,1,2,3,4].map(i => [0,1,2,3].map(j => (
        <circle key={`${i}-${j}`} cx={10 + i * 16} cy={10 + j * 14} r="1.5" fill="rgba(0,230,138,0.1)" />
      )))}
    </svg>,
  ];
  return variants[variant % variants.length];
};

/* Large tropical leaf for hero */
export const TropicalLeaf = ({ size = 300, style, flip }) => (
  <svg width={size} height={size} viewBox="0 0 300 300" fill="none" style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }}>
    {/* Main leaf */}
    <path d="M150 280 C150 280, 145 200, 120 140 C100 95, 60 60, 30 40 C60 55, 110 50, 140 70 C155 80, 148 110, 150 140" stroke="rgba(0,230,138,0.25)" strokeWidth="2" fill="rgba(0,230,138,0.06)" strokeLinecap="round" />
    <path d="M150 280 C150 280, 155 200, 180 140 C200 95, 240 60, 270 40 C240 55, 190 50, 160 70 C145 80, 152 110, 150 140" stroke="rgba(0,230,138,0.2)" strokeWidth="2" fill="rgba(0,230,138,0.04)" strokeLinecap="round" />
    {/* Leaf veins */}
    <path d="M150 260 C150 260, 140 200, 110 150" stroke="rgba(0,230,138,0.1)" strokeWidth="1" fill="none" />
    <path d="M150 260 C150 260, 160 200, 190 150" stroke="rgba(0,230,138,0.1)" strokeWidth="1" fill="none" />
    <path d="M150 220 C140 200, 120 180, 90 165" stroke="rgba(0,230,138,0.07)" strokeWidth="0.8" fill="none" />
    <path d="M150 220 C160 200, 180 180, 210 165" stroke="rgba(0,230,138,0.07)" strokeWidth="0.8" fill="none" />
    {/* Second smaller leaf */}
    <path d="M120 270 C120 270, 100 220, 70 180 C55 160, 30 150, 15 145 C35 155, 65 150, 85 165 C95 172, 105 200, 120 230" stroke="rgba(20,184,166,0.2)" strokeWidth="1.5" fill="rgba(20,184,166,0.04)" strokeLinecap="round" />
    {/* Third leaf */}
    <path d="M180 265 C180 265, 200 215, 230 185 C245 170, 265 165, 280 162 C262 170, 240 168, 220 178 C210 184, 195 205, 180 235" stroke="rgba(0,230,138,0.15)" strokeWidth="1.2" fill="rgba(0,230,138,0.03)" strokeLinecap="round" />
  </svg>
);

export const HeroBanner = ({ activeCount, totalGpios, enabledSchedules, nextIrrigation }) => (
  <div style={{ position: "relative", overflow: "hidden", borderRadius: 18, marginBottom: 16 }}>
    <div style={{
      background: "linear-gradient(135deg, rgba(8,40,32,0.9) 0%, rgba(12,48,38,0.85) 50%, rgba(10,42,34,0.9) 100%)",
      border: "1px solid rgba(0,230,138,0.15)",
      borderRadius: 18,
      padding: "20px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative leaf - right side only */}
      <TropicalLeaf size={200} style={{ position: "absolute", top: -50, right: -30, opacity: 0.6 }} />

      {/* Glow */}
      <div style={{ position: "absolute", top: 0, right: "10%", width: 150, height: 150, background: "radial-gradient(circle, rgba(0,230,138,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Floating particles */}
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        <circle cx="80%" cy="30%" r="1.5" fill="rgba(0,230,138,0.15)">
          <animate attributeName="cy" values="30%;25%;30%" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="60%" cy="60%" r="1.2" fill="rgba(20,184,166,0.12)">
          <animate attributeName="cy" values="60%;55%;60%" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        {/* Left: Rose + info */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="irr-hero-plant" style={{ flexShrink: 0 }}>
            <RosePlant size={80} style={{ filter: "drop-shadow(0 0 20px rgba(0,230,138,0.1))" }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f0fdf4", lineHeight: 1.2, marginBottom: 4 }}>
              Jardín de Rosas
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
              Controla las salidas y programa horarios de riego
            </div>
          </div>
        </div>

        {/* Right: Quick stats */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: activeCount > 0 ? "#34d399" : "#64748b" }}>{activeCount}<span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>/{totalGpios}</span></div>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>Encendidas</div>
          </div>
          <div style={{ width: 1, height: 30, background: "rgba(52,211,153,0.12)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#2dd4bf" }}>{enabledSchedules}</div>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>Horarios</div>
          </div>
          {nextIrrigation && (
            <>
              <div style={{ width: 1, height: 30, background: "rgba(52,211,153,0.12)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>
                  {String(nextIrrigation.time_hour).padStart(2, "0")}:{String(nextIrrigation.time_minute).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>Próximo</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
