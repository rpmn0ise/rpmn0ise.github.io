// js/packscreen.js — Multi-pack opening with accelerated animation

const PACK_DEFS = [
  { type:"standard", label:"STANDARD",  icon:"📦", cards:5,  coinCost:0,    tokenCost:1, color:"#00ff88",  desc:"5 cards · 1 token or daily free" },
  { type:"mini",     label:"MINI",       icon:"🗃️", cards:3,  coinCost:80,   tokenCost:0, color:"#00cfff",  desc:"3 cards · 80 coins" },
  { type:"mega",     label:"MEGA",       icon:"📫", cards:10, coinCost:300,  tokenCost:3, color:"#bf44ff",  desc:"10 cards · 300 coins or 3 tokens · boosted rates" },
  { type:"ultra",    label:"ULTRA",      icon:"🗄️", cards:20, coinCost:500,  tokenCost:5, color:"#ffbb00",  desc:"20 cards · 500 coins or 5 tokens · best rates" },
  { type:"thematic", label:"THEMATIC",   icon:"🎴", cards:8,  coinCost:250,  tokenCost:2, color:"#ff6eb0",  desc:"8 cards · same family · 250 coins or 2 tokens" },
];

const FAMILIES_LIST = ["Virus","Daemon","Hacker","Protocol","Distro","Command","AI/Bot","Hardware"];

function ScreenPackOpen({ user, onClose, onPackOpened, isAdmin, onAdminGrant }) {
  const [phase, setPhase]         = useState("shop");   // shop | opening | done
  const [selected, setSelected]   = useState(PACK_DEFS[0]);
  const [qty, setQty]             = useState(1);
  const [useTokens, setUseTokens] = useState(false);
  const [family, setFamily]       = useState("Virus");
  const [drawn, setDrawn]         = useState([]);
  const [revealed, setRevealed]   = useState(0);  // number revealed so far
  const [adminTarget, setAdminTarget] = useState("");
  const [adminTokenAmt, setAdminTokenAmt] = useState(5);
  const [msg, setMsg]             = useState(null);
  const [busy, setBusy]           = useState(false);

  const dailyAvail = !user.dailyPackClaimedAt ||
    new Date().toDateString() !== new Date(user.dailyPackClaimedAt).toDateString();

  const canOpen = () => {
    if (selected.type === "standard" && !useTokens && dailyAvail) return true;
    if (useTokens && user.packTokens >= selected.tokenCost * qty) return true;
    if (!useTokens && user.coins >= selected.coinCost * qty) return true;
    return false;
  };

  const openPacks = async () => {
    if (!canOpen() || busy) return;
    setBusy(true);
    try {
      const fam = selected.type === "thematic" ? family : null;
      const data = await API.openPack(selected.type, qty, useTokens, fam);

      // Build card objects from IDs (mirrors server logic)
      const cards = (data.drawn || []).map(c => ALL_CARDS.find(x => x.id === c.id) || ALL_CARDS.find(x => x.rarity === c.rarity) || ALL_CARDS[0]);
      setDrawn(cards);
      setRevealed(0);
      setPhase("opening");

      // Accelerated reveal animation
      const totalMs = Math.min(3000, cards.length * 120);
      const step = totalMs / cards.length;
      for (let i = 1; i <= cards.length; i++) {
        await new Promise(r => setTimeout(r, step));
        setRevealed(i);
      }
      setPhase("done");
      onPackOpened(data);
    } catch (e) { setMsg({ text: e.message, color: "#ff2255" }); }
    finally { setBusy(false); }
  };

  const totalCoinCost  = selected.coinCost  * qty;
  const totalTokenCost = selected.tokenCost * qty;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.96)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#00ff88" }}>📦 PACK SHOP</span>
        <Btn color="#ff2255" onClick={onClose} sm>✕ CLOSE</Btn>
      </div>

      {msg && (
        <div style={{ padding:"6px 16px", color:msg.color, fontFamily:"var(--font-d)", fontSize:10 }}>{msg.text}</div>
      )}

      {/* SHOP */}
      {phase === "shop" && (
        <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:16 }}>
          {/* Player resources */}
          <div style={{ display:"flex", gap:12, padding:"10px 14px", background:"rgba(0,0,0,0.5)", borderRadius:6, border:"1px solid #0a1a2a" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#334455", fontFamily:"var(--font-d)" }}>COINS</div>
              <div style={{ fontSize:16, color:"#ffbb00", fontFamily:"var(--font-d)" }}>💰 {user.coins}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#334455", fontFamily:"var(--font-d)" }}>TOKENS</div>
              <div style={{ fontSize:16, color:"#bf44ff", fontFamily:"var(--font-d)" }}>🎫 {user.packTokens}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#334455", fontFamily:"var(--font-d)" }}>DAILY</div>
              <div style={{ fontSize:12, color: dailyAvail?"#00ff88":"#334455", fontFamily:"var(--font-d)" }}>
                {dailyAvail ? "✓ READY" : "✗ CLAIMED"}
              </div>
            </div>
          </div>

          {/* Pack selector */}
          <div>
            <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>SELECT PACK TYPE</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {PACK_DEFS.map(p => (
                <div key={p.type} onClick={() => setSelected(p)} style={{
                  padding:"12px 14px", borderRadius:6, cursor:"pointer",
                  background: selected.type===p.type ? `${p.color}10` : "rgba(0,0,0,0.5)",
                  border:`1px solid ${selected.type===p.type ? p.color : "#0a1a2a"}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  transition:"all 0.15s",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontFamily:"var(--font-d)", fontSize:11, color:p.color }}>{p.label}</div>
                      <div style={{ fontSize:9, color:"#445566" }}>{p.desc}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    {p.coinCost > 0 && <div style={{ fontSize:9, color:"#ffbb00" }}>💰 {p.coinCost}</div>}
                    {p.tokenCost > 0 && <div style={{ fontSize:9, color:"#bf44ff" }}>🎫 {p.tokenCost}</div>}
                    {p.type==="standard" && dailyAvail && <div style={{ fontSize:9, color:"#00ff88" }}>FREE (daily)</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thematic family selector */}
          {selected.type === "thematic" && (
            <div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:6 }}>SELECT FAMILY</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {FAMILIES.map(f => (
                  <button key={f.name} onClick={() => setFamily(f.name)} style={{
                    padding:"5px 10px", borderRadius:4, cursor:"pointer",
                    background: family===f.name ? `${f.color}18` : "transparent",
                    border:`1px solid ${family===f.name ? f.color : "#0a1a2a"}`,
                    color: family===f.name ? f.color : "#445566",
                    fontFamily:"var(--font-d)", fontSize:9,
                  }}>{f.icon} {f.name}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + payment */}
          <div style={{ display:"flex", gap:12, alignItems:"flex-end", flexWrap:"wrap" }}>
            <div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:6 }}>QUANTITY</div>
              <div style={{ display:"flex", gap:6 }}>
                {[1,2,3,5,10].map(n => (
                  <button key={n} onClick={() => setQty(n)} style={{
                    padding:"6px 12px", borderRadius:4, cursor:"pointer",
                    background: qty===n ? "rgba(0,255,136,0.1)" : "transparent",
                    border:`1px solid ${qty===n ? "#00ff88" : "#0a1a2a"}`,
                    color: qty===n ? "#00ff88" : "#445566",
                    fontFamily:"var(--font-d)", fontSize:10,
                  }}>×{n}</button>
                ))}
              </div>
            </div>

            {selected.tokenCost > 0 && (
              <div>
                <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:6 }}>PAY WITH</div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => setUseTokens(false)} style={{
                    padding:"6px 12px", borderRadius:4, cursor:"pointer",
                    background:!useTokens?"rgba(255,187,0,0.1)":"transparent",
                    border:`1px solid ${!useTokens?"#ffbb00":"#0a1a2a"}`,
                    color:!useTokens?"#ffbb00":"#445566", fontFamily:"var(--font-d)", fontSize:9,
                  }}>💰 COINS</button>
                  <button onClick={() => setUseTokens(true)} style={{
                    padding:"6px 12px", borderRadius:4, cursor:"pointer",
                    background:useTokens?"rgba(191,68,255,0.1)":"transparent",
                    border:`1px solid ${useTokens?"#bf44ff":"#0a1a2a"}`,
                    color:useTokens?"#bf44ff":"#445566", fontFamily:"var(--font-d)", fontSize:9,
                  }}>🎫 TOKENS</button>
                </div>
              </div>
            )}
          </div>

          {/* Cost summary + open button */}
          <div style={{ padding:"12px 14px", background:"rgba(0,0,0,0.5)", borderRadius:6, border:"1px solid #0a1a2a" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:"var(--font-d)", fontSize:10, color:"#00ff88" }}>
                  {qty} × {selected.label} = {selected.cards * qty} cards
                </div>
                <div style={{ fontSize:9, color:"#445566", marginTop:3 }}>
                  Cost: {selected.type==="standard" && !useTokens && dailyAvail
                    ? "FREE (daily)"
                    : useTokens
                    ? `${totalTokenCost} tokens`
                    : `${totalCoinCost} coins`}
                </div>
              </div>
              <Btn color={canOpen() ? "#00ff88" : "#334455"} onClick={openPacks} disabled={!canOpen() || busy}>
                {busy ? "OPENING..." : `OPEN ${qty > 1 ? qty+"×" : ""} PACK${qty>1?"S":""}`}
              </Btn>
            </div>
          </div>

          {/* Admin panel */}
          {isAdmin && (
            <div style={{ padding:"12px 14px", border:"1px solid #ffbb0033", borderRadius:6, background:"rgba(255,187,0,0.03)" }}>
              <div style={{ fontFamily:"var(--font-d)", color:"#ffbb00", fontSize:9, letterSpacing:2, marginBottom:8 }}>
                👑 ADMIN — GRANT TOKENS TO USER
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input className="input" placeholder="username" value={adminTarget}
                  onChange={e => setAdminTarget(e.target.value)} style={{ flex:1 }} />
                <input type="number" value={adminTokenAmt} onChange={e => setAdminTokenAmt(parseInt(e.target.value)||1)}
                  className="input" style={{ width:55 }} min={1} max={100} />
                <Btn color="#ffbb00" onClick={() => onAdminGrant(adminTarget, adminTokenAmt)} sm>GRANT</Btn>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OPENING animation */}
      {(phase === "opening" || phase === "done") && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:16, overflowY:"auto" }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:16, color:"#00ff88", letterSpacing:4 }}>
            {phase === "opening" ? "DECRYPTING..." : "PACK OPENED!"}
          </div>

          {/* Progress bar */}
          {phase === "opening" && (
            <div style={{ width:"100%", maxWidth:400 }}>
              <div className="bar-track">
                <div className="bar-fill" style={{ width:`${(revealed/drawn.length)*100}%`, background:"#00ff88" }} />
              </div>
              <div style={{ fontSize:9, color:"#334455", textAlign:"center", marginTop:4, fontFamily:"var(--font-d)" }}>
                {revealed} / {drawn.length}
              </div>
            </div>
          )}

          {/* Cards grid */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
            {drawn.slice(0, revealed).map((card, i) => (
              <div key={i} style={{ animation:"cardReveal 0.35s ease", flexShrink:0 }}>
                <Card card={card} size="small" />
              </div>
            ))}
            {/* Unrevealed backs */}
            {drawn.slice(revealed).map((_, i) => (
              <div key={`back${i}`} style={{ flexShrink:0 }}>
                <Card card={drawn[0]} showBack size="small" />
              </div>
            ))}
          </div>

          {phase === "done" && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              {/* Rarity summary */}
              <div style={{ display:"flex", gap:10 }}>
                {RARITIES.map(r => {
                  const count = drawn.filter(c => c.rarity === r.name).length;
                  if (!count) return null;
                  return (
                    <div key={r.name} style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"var(--font-d)", fontSize:14, color:r.color }}>{count}</div>
                      <div style={{ fontSize:8, color:"#334455" }}>{r.name}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <Btn color="#00ff88" onClick={onClose}>COLLECT CARDS ✓</Btn>
                <Btn color="#00cfff" onClick={() => setPhase("shop")} sm>OPEN MORE</Btn>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
