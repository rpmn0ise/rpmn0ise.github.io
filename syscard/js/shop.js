// js/shop.js — Boutique in-game

function ScreenShop({ user, onBuy, onClose }) {
  const [catalog, setCatalog]   = useState([]);
  const [playerCoins, setCoins] = useState(user?.coins || 0);
  const [currentAvatar, setAvatar] = useState(user?.avatar || "💾");
  const [currentBorder, setBorder] = useState(user?.borderStyle || "default");
  const [tab, setTab]           = useState("packs"); // packs | tokens | cosmetics
  const [loading, setLoading]   = useState(true);
  const [buying, setBuying]     = useState(null);
  const [msg, setMsg]           = useState(null);
  const [qty, setQty]           = useState(1);

  useEffect(() => { loadShop(); }, []);

  const loadShop = async () => {
    setLoading(true);
    try {
      const data = await API.getShop();
      setCatalog(data.items || []);
      setCoins(data.playerCoins);
      setAvatar(data.currentAvatar);
      setBorder(data.currentBorder);
    } catch(e) { setMsg({ text:e.message, color:"#ff2255" }); }
    finally { setLoading(false); }
  };

  const buyItem = async (item) => {
    const total = item.coinCost * (item.type === "cosmetic" ? 1 : qty);
    if (playerCoins < total) {
      setMsg({ text:`Pas assez de coins ! (${playerCoins}/${total})`, color:"#ff2255" });
      return;
    }
    setBuying(item.id);
    try {
      const data = await API.buyShopItem(item.id, item.type === "cosmetic" ? 1 : qty);
      setCoins(data.coins);
      if (data.avatar)      setAvatar(data.avatar);
      if (data.borderStyle) setBorder(data.borderStyle);
      setMsg({ text:`✅ ${item.name} acheté !`, color:"#00ff88" });
      onBuy && onBuy(data);
    } catch(e) { setMsg({ text:e.message, color:"#ff2255" }); }
    finally { setBuying(null); }
  };

  const tabs = [
    { id:"packs",     label:"PACKS",      icon:"📦" },
    { id:"tokens",    label:"TOKENS",     icon:"🎫" },
    { id:"cosmetics", label:"COSMÉTIQUES",icon:"✨" },
  ];

  const filtered = catalog.filter(i => {
    if (tab === "packs")     return i.type === "pack";
    if (tab === "tokens")    return i.type === "token";
    if (tab === "cosmetics") return i.type === "cosmetic";
    return true;
  });

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#ffbb00" }}>🏪 BOUTIQUE</span>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontFamily:"var(--font-d)", fontSize:10, color:"#ffbb00" }}>💰 {playerCoins}</span>
        </div>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {msg && (
        <div style={{ padding:"7px 16px", color:msg.color, fontFamily:"var(--font-d)", fontSize:10,
          background:`${msg.color}0a`, borderBottom:`1px solid ${msg.color}22`, flexShrink:0 }}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid #0a1a2a", flexShrink:0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn ${tab===t.id?"active":""}`}
            style={{ color: tab===t.id ? "#ffbb00" : "#334455" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Qty selector pour packs/tokens */}
      {(tab === "packs" || tab === "tokens") && (
        <div style={{ padding:"8px 16px", borderBottom:"1px solid #0a1a2a", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <span style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2 }}>QUANTITÉ</span>
          {[1,2,3,5].map(n => (
            <button key={n} onClick={() => setQty(n)} style={{
              padding:"4px 12px", borderRadius:4, cursor:"pointer",
              background:qty===n?"rgba(255,187,0,0.1)":"transparent",
              border:`1px solid ${qty===n?"#ffbb00":"#0a1a2a"}`,
              color:qty===n?"#ffbb00":"#445566",
              fontFamily:"var(--font-d)", fontSize:9,
            }}>×{n}</button>
          ))}
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto", padding:14 }}>
        {loading && <div style={{ color:"#334455", fontSize:11, padding:20, textAlign:"center", fontFamily:"var(--font-d)" }}>CHARGEMENT...</div>}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:10 }}>
          {filtered.map(item => {
            const totalCost = item.coinCost * (item.type === "cosmetic" ? 1 : qty);
            const canAfford = playerCoins >= totalCost;
            const isEquipped = (item.cosmeticKey === `avatar_${currentAvatar}`) ||
                               (item.cosmeticKey === currentBorder);

            return (
              <div key={item.id} style={{
                background:"rgba(0,0,0,0.5)", borderRadius:8,
                border:`1px solid ${canAfford ? "#1a2a3a" : "#0a0a0a"}`,
                padding:14, display:"flex", flexDirection:"column", gap:8,
                opacity: canAfford ? 1 : 0.6, transition:"all 0.15s",
              }}>
                <div style={{ fontSize:32, textAlign:"center" }}>{item.icon}</div>
                <div style={{ fontFamily:"var(--font-d)", fontSize:10, color:"#c8d8e8", textAlign:"center" }}>
                  {item.name}
                </div>
                <div style={{ fontSize:9, color:"#445566", textAlign:"center", lineHeight:1.5 }}>
                  {item.desc}
                </div>
                {isEquipped && (
                  <div style={{ textAlign:"center", fontSize:8, color:"#00ff88", fontFamily:"var(--font-d)" }}>
                    ✓ ÉQUIPÉ
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto" }}>
                  <span style={{ fontFamily:"var(--font-d)", fontSize:11, color:"#ffbb00", fontWeight:700 }}>
                    💰 {totalCost}
                  </span>
                  {!isEquipped && (
                    <Btn color={canAfford ? "#ffbb00" : "#334455"}
                      onClick={() => canAfford && buyItem(item)}
                      disabled={!canAfford || buying === item.id} sm>
                      {buying === item.id ? "..." : "ACHETER"}
                    </Btn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
