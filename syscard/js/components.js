// =============================================
// js/components.js — v0.2  UI Primitives
// =============================================
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ── Btn ───────────────────────────────────────
function Btn({ color = "#00ff88", onClick, disabled, children, sm, full }) {
  return (
    <button className={`btn${sm ? " btn-sm" : ""}`} onClick={onClick} disabled={disabled}
      style={{ color, borderColor: color, width: full ? "100%" : undefined }}>
      {children}
    </button>
  );
}

// ── Notification ──────────────────────────────
function Notification({ msg, color = "#00ff88" }) {
  if (!msg) return null;
  return (
    <div className="notif" style={{ borderColor: color, color, boxShadow: `0 0 24px ${color}44` }}>
      {msg}
    </div>
  );
}

// ── HPBar ─────────────────────────────────────
function HPBar({ current, max, color }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const c = pct > 50 ? color : pct > 25 ? "#ffbb00" : "#ff2255";
  return (
    <div className="bar-track" style={{ border: `1px solid ${c}22` }}>
      <div className="bar-fill" style={{ width: `${pct}%`, background: c, boxShadow: `0 0 6px ${c}` }} />
    </div>
  );
}

// ── EnergyPips ────────────────────────────────
function EnergyPips({ current, max, color }) {
  return (
    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="energy-pip"
          style={{ color, background: i < current ? color : "transparent", boxShadow: i < current ? `0 0 5px ${color}` : "none" }} />
      ))}
    </div>
  );
}

// ── TypeBadge ─────────────────────────────────
function TypeBadge({ family }) {
  const fam = FAMILIES.find(f => f.name === family);
  if (!fam) return null;
  return (
    <span className="type-badge" style={{ background: `${fam.color}18`, border: `1px solid ${fam.color}55`, color: fam.color }}>
      {fam.icon} {fam.name}
    </span>
  );
}

// ── Card Art ──────────────────────────────────
function CardArt({ card, scale = 1 }) {
  const SYMBOLS = { Virus:"⬡", Daemon:"◈", Hacker:"◉", Protocol:"⬢", Distro:"◆", Command:"▣", "AI/Bot":"◎", Hardware:"⬟" };
  const w = 118 * scale, h = 76 * scale;
  return (
    <div style={{
      width: w, height: h, borderRadius: 4 * scale, flexShrink: 0, overflow: "hidden", position: "relative",
      background: `radial-gradient(ellipse at 25% 25%, ${card.familyColor}28, ${card.familyDark}ee)`,
      border: `1px solid ${card.familyColor}33`,
    }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `linear-gradient(${card.familyColor} 1px, transparent 1px), linear-gradient(90deg, ${card.familyColor} 1px, transparent 1px)`,
        backgroundSize: `${14 * scale}px ${14 * scale}px`,
      }} />
      {/* Big symbol */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 28 * scale, opacity: 0.12, fontFamily: "monospace", transform: "rotate(-10deg)" }}>
          {SYMBOLS[card.family] || "◈"}
        </div>
      </div>
      {/* Icon */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 24 * scale }}>{card.familyIcon}</div>
      </div>
      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "2px 4px",
        background: "rgba(0,0,0,0.65)", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 6.5 * scale, color: card.familyColor, fontFamily: "var(--font-d)", letterSpacing: 1 }}>
          {card.family.toUpperCase()}
        </span>
        {card.special && (
          <span style={{ fontSize: 6 * scale }}>{card.special.icon}</span>
        )}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────
function Card({ card, onClick, selected, inDeck, size = "normal", showBack = false, hitting = false }) {
  const scale = size === "small" ? 0.62 : size === "large" ? 1.2 : size === "battle" ? 0.85 : 1;
  const w = 140 * scale, h = 204 * scale;
  const isLeg = card?.rarity === "Legendary";
  const isEpic = card?.rarity === "Epic";

  if (showBack) return (
    <div style={{
      width: w, height: h, borderRadius: 10 * scale, flexShrink: 0,
      background: "linear-gradient(145deg, #04040f, #0a0a22)",
      border: "2px solid #1a2a3a", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 28 * scale, userSelect: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.8)",
    }}>💾</div>
  );

  if (!card) return null;

  return (
    <div onClick={() => onClick?.(card)} style={{
      width: w, height: h, borderRadius: 10 * scale, flexShrink: 0,
      cursor: onClick ? "pointer" : "default", userSelect: "none",
      background: `linear-gradient(155deg, #05050f 0%, #080818 45%, ${card.familyDark}88 100%)`,
      border: `2px solid ${selected ? card.rarityColor : card.rarityBorder}`,
      boxShadow: selected
        ? `0 0 28px ${card.rarityGlow}, 0 0 56px ${card.rarityGlow}55`
        : `0 0 8px ${card.rarityGlow}55, 0 6px 20px rgba(0,0,0,0.7)`,
      display: "flex", flexDirection: "column", padding: 8 * scale, gap: 5 * scale,
      transition: "all 0.2s",
      transform: hitting ? "none" : selected ? `translateY(${-6 * scale}px) scale(1.03)` : "none",
      animation: hitting ? "hit 0.4s ease" : "none",
      outline: inDeck ? `2px solid ${card.rarityColor}` : "none",
      position: "relative", overflow: "hidden",
    }}>
      {/* Legendary shimmer overlay */}
      {(isLeg || isEpic) && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `linear-gradient(110deg, transparent 35%, ${card.rarityColor}20 50%, transparent 65%)`,
          backgroundSize: "200% 100%", animation: "shimmer 2.5s linear infinite",
        }} />
      )}
      {/* Rarity glow border for legendary */}
      {isLeg && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 9 * scale, pointerEvents: "none",
          boxShadow: `inset 0 0 12px ${card.rarityColor}30`,
        }} />
      )}

      {/* Header: rarity + ID */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: 7.5 * scale, fontWeight: "700", letterSpacing: 1.5,
          fontFamily: "var(--font-d)",
          ...(isLeg ? {} : { color: card.rarityColor }),
          ...(isLeg ? { background: "linear-gradient(90deg,#ffbb00,#ff8800,#ffee00,#ffbb00)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 2.5s linear infinite" } : {}),
        }}>
          {card.rarity.toUpperCase()}
        </span>
        <span style={{ fontSize: 7 * scale, color: "#334455", fontFamily: "var(--font-b)" }}>
          #{String(card.id).padStart(4, "0")}
        </span>
      </div>

      {/* Art */}
      <CardArt card={card} scale={scale} />

      {/* Name */}
      <div style={{
        fontSize: 9.5 * scale, fontFamily: "var(--font-d)", fontWeight: "700",
        lineHeight: 1.2, textAlign: "center", color: "#ddeeff",
        textShadow: `0 0 10px ${card.familyColor}99`,
      }}>
        {card.name}
      </div>

      {/* Energy cost */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <span style={{ fontSize: 7 * scale, color: "#334455" }}>COST</span>
        <EnergyPips current={card.energyCost} max={card.energyCost} color={card.energyColor} />
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 3 * scale }}>
        {[["❤️", card.hp, "#ff6677"], ["⚔️", card.atk, "#ffaa44"], ["🛡️", card.def, "#44aaff"]].map(([ico, val, c]) => (
          <div key={ico} style={{
            flex: 1, background: "rgba(0,0,0,0.5)", borderRadius: 4 * scale,
            padding: `3px ${3 * scale}px`, textAlign: "center", border: `1px solid ${c}22`,
          }}>
            <div style={{ fontSize: 8 * scale }}>{ico}</div>
            <div style={{ fontSize: 10 * scale, color: c, fontFamily: "var(--font-d)", fontWeight: "700" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Special ability */}
      {card.special && (
        <div style={{
          fontSize: 7 * scale, borderRadius: 3 * scale, padding: `2px ${5 * scale}px`,
          background: `${card.familyColor}18`, border: `1px solid ${card.familyColor}44`,
          color: card.familyColor, textAlign: "center", fontFamily: "var(--font-d)",
          letterSpacing: 0.5,
        }}>
          {card.special.icon} {card.special.name}
        </div>
      )}
    </div>
  );
}

// ── FilterBar ─────────────────────────────────
function FilterBar({ filter, onFilter, rarFilter, onRar, famFilter, onFam }) {
  return (
    <div className="filter-bar">
      <input className="input" placeholder="Search cards..." value={filter}
        onChange={e => onFilter(e.target.value)} style={{ flex: 1, minWidth: 120 }} />
      <select className="input" value={rarFilter} onChange={e => onRar(e.target.value)} style={{ width: "auto", flex: "0 0 auto" }}>
        <option value="All">All Rarities</option>
        {RARITIES.map(r => <option key={r.name}>{r.name}</option>)}
      </select>
      <select className="input" value={famFilter} onChange={e => onFam(e.target.value)} style={{ width: "auto", flex: "0 0 auto" }}>
        <option value="All">All Families</option>
        {FAMILIES.map(f => <option key={f.name} value={f.name}>{f.icon} {f.name}</option>)}
      </select>
    </div>
  );
}

// ── StatRow ───────────────────────────────────
function StatRow({ label, value, color = "#778899" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, borderBottom: "1px solid #0a1a2a", padding: "5px 0" }}>
      <span style={{ color: "#334455", fontFamily: "var(--font-d)", fontSize: 8, letterSpacing: 1 }}>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}

// ── Matrix rain background (for login) ────────
function MatrixRain() {
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ";
  const cols = Math.floor(window.innerWidth / 18);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.4 }}>
      {Array.from({ length: Math.min(cols, 40) }).map((_, i) => {
        const len = 8 + Math.floor(Math.random() * 16);
        const text = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("\n");
        return (
          <div key={i} className="matrix-col" style={{
            left: `${i * (100 / Math.min(cols, 40))}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 4}s`,
          }}>{text}</div>
        );
      })}
    </div>
  );
}
