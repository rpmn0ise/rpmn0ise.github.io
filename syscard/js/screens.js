// =============================================
// js/screens.js — v0.3
// Login connecté à l'API Vercel
// Collection, Deck, Trade inchangés (v0.2)
// =============================================

// ── LOGIN ─────────────────────────────────────
function ScreenLogin({ onLogin, onGuest }) {
  const [mode, setMode]       = useState("welcome"); // welcome | login | register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [busy, setBusy]       = useState(false);
  const [booting, setBooting] = useState(true);
  const [bootLines, setBootLines] = useState([]);

  const BOOT = [
    { text: "SYS://CARD v0.3 — BOOT SEQUENCE INITIATED", color: "#00ff88",  delay: 0   },
    { text: "Loading card database............. [OK]",    color: "#334455",  delay: 280 },
    { text: "Connecting to Vercel API.......... [OK]",    color: "#334455",  delay: 560 },
    { text: "Connecting to MongoDB Atlas....... [OK]",    color: "#334455",  delay: 840 },
    { text: "Checking authentication........... [REQUIRED]", color: "#ffbb00", delay: 1100 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",        color: "#0a1a2a",  delay: 1380 },
    { text: "IDENTIFY YOURSELF, HACKER.",                  color: "#ff2255",  delay: 1650 },
  ];

  useEffect(() => {
    BOOT.forEach(({ text, color, delay }) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, { text, color }]);
        if (delay === 1650) setTimeout(() => setBooting(false), 350);
      }, delay);
    });
  }, []);

  const doAuth = async (action) => {
    if (!username.trim()) { setError("Username requis"); return; }
    if (!password)        { setError("Password requis"); return; }
    setBusy(true); setError("");
    try {
      const data = action === "login"
        ? await API.login(username.trim(), password)
        : await API.register(username.trim(), password);
      onLogin(data.token, data.user, data.bonusMsg || null);
    } catch (e) {
      setError(e.message || "Erreur réseau");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-bg">
      <MatrixRain />
      <div className="login-box" style={{ position:"relative", zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{
            fontFamily:"var(--font-d)", fontSize:26, fontWeight:900,
            color:"#00ff88", letterSpacing:6,
            textShadow:"0 0 30px rgba(0,255,136,0.4)",
            animation:"glitch 6s infinite",
          }}>SYS://CARD</div>
          <div style={{ color:"#1a2a3a", fontSize:9, letterSpacing:3, marginTop:4, fontFamily:"var(--font-d)" }}>
            HACKER TCG — v0.3
          </div>
        </div>

        {/* Boot sequence */}
        {booting && (
          <div style={{
            marginBottom:20, padding:"12px 14px",
            background:"rgba(0,0,0,0.6)", borderRadius:4, border:"1px solid #0a1a2a",
          }}>
            {bootLines.map((l, i) => (
              <div key={i} style={{ fontSize:10, color:l.color, lineHeight:1.9, fontFamily:"var(--font-b)", animation:"scanBoot 0.2s ease" }}>
                {l.text}
              </div>
            ))}
            <span style={{ fontSize:11, color:"#00ff88", animation:"blink 1s infinite" }}>█</span>
          </div>
        )}

        {!booting && (
          <>
            {/* Tabs */}
            {mode !== "welcome" && (
              <div style={{ display:"flex", borderBottom:"1px solid #0a1a2a", marginBottom:20 }}>
                {[["login","LOGIN"],["register","REGISTER"]].map(([m,l]) => (
                  <button key={m} onClick={() => { setMode(m); setError(""); }} className={`tab-btn ${mode===m?"active":""}`}
                    style={{ color: mode===m ? "#00ff88" : "#334455" }}>
                    {l}
                  </button>
                ))}
              </div>
            )}

            {/* Welcome */}
            {mode === "welcome" && (
              <div style={{ display:"flex", flexDirection:"column", gap:12, animation:"fadeUp 0.4s ease" }}>
                <Btn color="#00ff88" onClick={() => setMode("login")} sm={false}>
                  🔐 CONNEXION
                </Btn>
                <Btn color="#00cfff" onClick={() => setMode("register")}>
                  📝 CRÉER UN COMPTE
                </Btn>
                <div style={{ textAlign:"center", margin:"8px 0" }}>
                  <div style={{ height:1, background:"#0a1a2a", marginBottom:14 }} />
                  <button onClick={onGuest} style={{
                    background:"transparent", border:"none",
                    color:"#334455", cursor:"pointer",
                    fontFamily:"var(--font-d)", fontSize:9, letterSpacing:2,
                    textDecoration:"underline", textDecorationColor:"#1a2a3a",
                  }}>
                    CONTINUER EN INVITÉ (limité)
                  </button>
                </div>
                <div style={{ fontSize:8, color:"#1a2a3a", textAlign:"center", lineHeight:1.8, fontFamily:"var(--font-b)" }}>
                  Comptes sauvegardés sur MongoDB Atlas<br/>
                  Progression conservée entre sessions<br/>
                  Admin promu manuellement par rpmn0ise
                </div>
              </div>
            )}

            {/* Login / Register form */}
            {(mode === "login" || mode === "register") && (
              <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeUp 0.3s ease" }}>
                <div>
                  <label style={{ fontFamily:"var(--font-d)", fontSize:8, color:"#445566", letterSpacing:2, display:"block", marginBottom:6 }}>
                    USERNAME
                  </label>
                  <input className="input" value={username} autoFocus
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doAuth(mode)}
                    placeholder="hacker_name" />
                </div>
                <div>
                  <label style={{ fontFamily:"var(--font-d)", fontSize:8, color:"#445566", letterSpacing:2, display:"block", marginBottom:6 }}>
                    PASSWORD {mode === "register" && <span style={{ color:"#1a2a3a" }}>(6+ chars)</span>}
                  </label>
                  <input className="input" type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doAuth(mode)}
                    placeholder="••••••••" />
                </div>
                {error && (
                  <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#ff2255", letterSpacing:1 }}>
                    ⚠ {error}
                  </div>
                )}
                <Btn color="#00ff88" onClick={() => doAuth(mode)} disabled={busy}>
                  {busy ? "CONNECTING..." : mode === "login" ? "CONNECT →" : "CREATE ACCOUNT →"}
                </Btn>
                <button onClick={() => { setMode("welcome"); setError(""); }} style={{
                  background:"transparent", border:"none", color:"#334455",
                  cursor:"pointer", fontFamily:"var(--font-d)", fontSize:9, letterSpacing:2,
                }}>← RETOUR</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── COLLECTION ────────────────────────────────
function ScreenCollection({ collection, onClose }) {
  const [filter, setFilter]     = useState("");
  const [rarFil, setRarFil]     = useState("All");
  const [famFil, setFamFil]     = useState("All");
  const [selected, setSelected] = useState(null);
  const [sort, setSort]         = useState("id");

  const filtered = useMemo(() => {
    let arr = collection.filter(c =>
      (rarFil === "All" || c.rarity === rarFil) &&
      (famFil === "All" || c.family === famFil) &&
      (c.name.toLowerCase().includes(filter.toLowerCase()) || c.family.toLowerCase().includes(filter.toLowerCase()))
    );
    if (sort === "rarity") arr = arr.sort((a,b) => RARITIES.findIndex(r=>r.name===b.rarity) - RARITIES.findIndex(r=>r.name===a.rarity));
    else if (sort === "atk") arr = arr.sort((a,b) => b.atk - a.atk);
    else if (sort === "hp")  arr = arr.sort((a,b) => b.hp  - a.hp);
    return arr;
  }, [collection, filter, rarFil, famFil, sort]);

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#00cfff" }}>
          📚 COLLECTION
          <span style={{ color:"#334455", fontSize:10, marginLeft:8 }}>
            {collection.length}/{ALL_CARDS.length}
          </span>
        </span>
        <div style={{ display:"flex", gap:10 }}>
          {RARITIES.map(r => (
            <span key={r.name} style={{ fontSize:9, color:r.color, fontFamily:"var(--font-d)" }}>
              {r.name[0]}: {collection.filter(c => c.rarity === r.name).length}
            </span>
          ))}
        </div>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      <div className="filter-bar">
        <input className="input" placeholder="Rechercher..." value={filter}
          onChange={e => setFilter(e.target.value)} style={{ flex:1, minWidth:100 }} />
        <select className="input" value={rarFil} onChange={e => setRarFil(e.target.value)} style={{ width:"auto" }}>
          <option value="All">Toutes raretés</option>
          {RARITIES.map(r => <option key={r.name}>{r.name}</option>)}
        </select>
        <select className="input" value={famFil} onChange={e => setFamFil(e.target.value)} style={{ width:"auto" }}>
          <option value="All">Toutes familles</option>
          {FAMILIES.map(f => <option key={f.name}>{f.icon} {f.name}</option>)}
        </select>
        <select className="input" value={sort} onChange={e => setSort(e.target.value)} style={{ width:"auto" }}>
          <option value="id">Tri: #ID</option>
          <option value="rarity">Tri: Rareté</option>
          <option value="atk">Tri: ATK</option>
          <option value="hp">Tri: HP</option>
        </select>
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ flex:1, overflowY:"auto" }}>
          <div className="card-grid">
            {filtered.map(c => (
              <Card key={c.id} card={c} size="small"
                selected={selected?.id === c.id}
                onClick={x => setSelected(p => p?.id === x.id ? null : x)} />
            ))}
            {filtered.length === 0 && (
              <div style={{ color:"#1a2a3a", fontSize:12, padding:24, fontFamily:"var(--font-d)" }}>
                AUCUNE CARTE — OUVRE DES PACKS !
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div style={{ width:195, borderLeft:"1px solid #0a1a2a", padding:14, overflowY:"auto", flexShrink:0, display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
            <Card card={selected} size="normal" />
            <div style={{ width:"100%" }}>
              <StatRow label="FAMILLE" value={selected.family}  color={selected.familyColor} />
              <StatRow label="RARETÉ"  value={selected.rarity}  color={selected.rarityColor} />
              <StatRow label="HP"      value={selected.hp}      color="#ff6677" />
              <StatRow label="ATK"     value={selected.atk}     color="#ffaa44" />
              <StatRow label="DEF"     value={selected.def}     color="#44aaff" />
              <StatRow label="ÉNERGIE" value={`${selected.energyCost}⚡`} color={selected.energyColor} />
              <StatRow label="DUST"    value={`${selected.dustVal} 🧱`}  color="#778899" />
              {selected.special && (
                <>
                  <div style={{ marginTop:10, fontSize:9, color:"#334455", fontFamily:"var(--font-d)", letterSpacing:1 }}>CAPACITÉ SPÉCIALE</div>
                  <div style={{ background:`${selected.familyColor}15`, border:`1px solid ${selected.familyColor}33`, borderRadius:4, padding:8, marginTop:4, width:"100%" }}>
                    <div style={{ fontSize:10, color:selected.familyColor, fontFamily:"var(--font-d)" }}>
                      {selected.special.icon} {selected.special.name}
                    </div>
                    <div style={{ fontSize:9, color:"#445566", marginTop:3 }}>{selected.special.desc}</div>
                    <div style={{ fontSize:8, color:selected.energyColor, marginTop:3 }}>Coût: {selected.special.energyCost}⚡</div>
                  </div>
                </>
              )}
              {selected.typeChart && (
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:9, color:"#334455", fontFamily:"var(--font-d)", letterSpacing:1, marginBottom:4 }}>TYPE</div>
                  <div style={{ fontSize:9, color:"#00ff88" }}>✓ Fort: {selected.typeChart.strong?.join(", ")}</div>
                  <div style={{ fontSize:9, color:"#ff2255", marginTop:2 }}>✗ Faible: {selected.typeChart.weak?.join(", ")}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DECK BUILDER ──────────────────────────────
function ScreenDeck({ collection, deck, onDeckChange, onClose }) {
  const [filter, setFilter] = useState("");
  const [rarFil, setRarFil] = useState("All");
  const [famFil, setFamFil] = useState("All");

  const filtered = collection.filter(c =>
    (rarFil === "All" || c.rarity === rarFil) &&
    (famFil === "All" || c.family === famFil) &&
    (c.name.toLowerCase().includes(filter.toLowerCase()) || c.family.toLowerCase().includes(filter.toLowerCase()))
  );

  const toggle = c => {
    if (deck.some(d => d.id === c.id)) onDeckChange(deck.filter(d => d.id !== c.id));
    else if (deck.length < 20) onDeckChange([...deck, c]);
  };

  const avgAtk = deck.length ? Math.round(deck.reduce((s,c) => s+c.atk,0)/deck.length) : 0;
  const avgHp  = deck.length ? Math.round(deck.reduce((s,c) => s+c.hp, 0)/deck.length) : 0;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.96)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#bf44ff" }}>🃏 DECK — {deck.length}/20</span>
        <span style={{ fontSize:9, color:"#334455", fontFamily:"var(--font-b)" }}>
          ATK moy: <span style={{ color:"#ffaa44" }}>{avgAtk}</span> &nbsp;
          HP moy: <span style={{ color:"#ff6677" }}>{avgHp}</span>
        </span>
        <Btn color="#00ff88" onClick={onClose} sm>SAUVEGARDER</Btn>
      </div>

      <FilterBar filter={filter} onFilter={setFilter} rarFilter={rarFil} onRar={setRarFil} famFilter={famFil} onFam={setFamFil} />

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ flex:1, overflowY:"auto" }}>
          <div className="card-grid">
            {filtered.map(c => (
              <Card key={c.id} card={c} size="small"
                selected={deck.some(d => d.id === c.id)}
                inDeck={deck.some(d => d.id === c.id)}
                onClick={toggle} />
            ))}
          </div>
        </div>
        <div style={{ width:175, borderLeft:"1px solid #0a1a2a", padding:12, overflowY:"auto", flexShrink:0 }}>
          <div style={{ color:"#334455", fontSize:9, letterSpacing:2, fontFamily:"var(--font-d)", marginBottom:8 }}>MON DECK</div>
          {deck.length === 0 && <div style={{ color:"#1a2a3a", fontSize:10 }}>Clique des cartes →</div>}
          {deck.map(c => (
            <div key={c.id} onClick={() => toggle(c)} style={{
              display:"flex", alignItems:"center", gap:6, marginBottom:5, cursor:"pointer",
              padding:"4px 6px", borderRadius:4,
              background:`${c.rarityColor}0a`, border:`1px solid ${c.rarityColor}1a`,
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:12 }}>{c.familyIcon}</span>
              <div style={{ flex:1, overflow:"hidden" }}>
                <div style={{ fontSize:8, color:c.rarityColor, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"var(--font-d)" }}>{c.name}</div>
                <div style={{ fontSize:8, color:"#334455" }}>⚔{c.atk} ❤{c.hp}</div>
              </div>
              <span style={{ color:"#ff2255", fontSize:10 }}>✕</span>
            </div>
          ))}
          {deck.length > 0 && <div style={{ fontSize:9, color:"#1a2a3a", marginTop:8 }}>{20-deck.length} slots libres</div>}
        </div>
      </div>
    </div>
  );
}

// ── TRADE ─────────────────────────────────────
function ScreenTrade({ collection, onTrade, onClose }) {
  const [tab, setTab]        = useState("market"); // market | mine | create
  const [openTrades, setOpenTrades] = useState([]);
  const [myTrades, setMyTrades]     = useState([]);
  const [offer, setOffer]    = useState(null);
  const [wantedRarity, setWantedRarity] = useState("Any");
  const [filter, setFilter]  = useState("");
  const [loading, setLoading]= useState(false);
  const [msg, setMsg]        = useState(null);
  const [myCardOffer, setMyCardOffer] = useState(null); // pour accepter un trade

  useEffect(() => { loadTrades(); }, [tab]);

  const loadTrades = async () => {
    setLoading(true);
    try {
      if (tab === "market") {
        const d = await API.listTrades(false);
        setOpenTrades(d.trades || []);
      } else if (tab === "mine") {
        const d = await API.listTrades(true);
        setMyTrades(d.trades || []);
      }
    } catch (e) { setMsg({ text: e.message, color:"#ff2255" }); }
    finally { setLoading(false); }
  };

  const createTrade = async () => {
    if (!offer) { setMsg({ text:"Sélectionne une carte à offrir", color:"#ff2255" }); return; }
    setLoading(true);
    try {
      await API.createTrade(offer.id, wantedRarity === "Any" ? null : wantedRarity);
      setMsg({ text:"Offre créée !", color:"#00ff88" });
      setOffer(null); setTab("mine");
    } catch (e) { setMsg({ text: e.message, color:"#ff2255" }); }
    finally { setLoading(false); }
  };

  const acceptTrade = async (trade) => {
    if (!myCardOffer) { setMsg({ text:"Sélectionne une de tes cartes à échanger", color:"#ff2255" }); return; }
    setLoading(true);
    try {
      const data = await API.acceptTrade(trade._id, myCardOffer.id);
      onTrade(data);
      setMsg({ text:`Échange réussi !`, color:"#00ff88" });
      setMyCardOffer(null); loadTrades();
    } catch (e) { setMsg({ text: e.message, color:"#ff2255" }); }
    finally { setLoading(false); }
  };

  const cancelTrade = async (tradeId) => {
    try {
      await API.cancelTrade(tradeId);
      setMsg({ text:"Offre annulée", color:"#ffbb00" });
      loadTrades();
    } catch (e) { setMsg({ text: e.message, color:"#ff2255" }); }
  };

  const filteredCollection = collection.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.family.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.96)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#ffbb00" }}>🔄 MARCHÉ</span>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid #0a1a2a", flexShrink:0 }}>
        {[["market","MARCHÉ"],["mine","MES OFFRES"],["create","+ CRÉER"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab-btn ${tab===t?"active":""}`}
            style={{ color: tab===t ? "#ffbb00" : "#334455" }}>
            {l}
          </button>
        ))}
        <button onClick={loadTrades} style={{
          marginLeft:"auto", background:"transparent", border:"none",
          color:"#334455", cursor:"pointer", padding:"8px 14px",
          fontFamily:"var(--font-d)", fontSize:9,
        }}>🔄</button>
      </div>

      {msg && (
        <div style={{ padding:"6px 16px", color:msg.color, fontFamily:"var(--font-d)", fontSize:10, background:`${msg.color}0a`, flexShrink:0 }}>
          {msg.text}
        </div>
      )}

      {/* MARCHÉ — offres des autres */}
      {tab === "market" && (
        <div style={{ flex:1, overflowY:"auto", padding:12 }}>
          {loading && <div style={{ color:"#334455", fontSize:10, padding:12 }}>Chargement...</div>}
          {!loading && openTrades.length === 0 && (
            <div style={{ color:"#1a2a3a", fontSize:11, padding:20 }}>Aucune offre disponible.</div>
          )}
          {openTrades.map(trade => {
            const offeredCard = ALL_CARDS.find(c => c.id === trade.offeredCardId);
            return (
              <div key={trade._id} style={{
                padding:"12px 14px", marginBottom:8, borderRadius:6,
                background:"rgba(0,0,0,0.5)", border:"1px solid #0a1a2a",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    {offeredCard && <Card card={offeredCard} size="small" />}
                    <div>
                      <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#00cfff" }}>{trade.fromUser}</div>
                      <div style={{ fontSize:9, color:"#445566", marginTop:3 }}>
                        Veut: <span style={{ color: trade.wantedRarity ? RARITIES.find(r=>r.name===trade.wantedRarity)?.color : "#778899" }}>
                          {trade.wantedRarity || "n'importe quelle carte"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                    <Btn color="#ffbb00" onClick={() => setMyCardOffer(myCardOffer?.tradeId === trade._id ? null : { tradeId: trade._id })} sm>
                      {myCardOffer?.tradeId === trade._id ? "ANNULER" : "ACCEPTER"}
                    </Btn>
                  </div>
                </div>
                {/* Ma sélection pour accepter */}
                {myCardOffer?.tradeId === trade._id && (
                  <div style={{ marginTop:10, padding:10, background:"rgba(0,0,0,0.4)", borderRadius:4 }}>
                    <div style={{ fontSize:9, color:"#445566", marginBottom:6 }}>Choisis une de tes cartes :</div>
                    <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
                      {collection.slice(0,10).map(c => (
                        <div key={c.id} onClick={() => setMyCardOffer({ tradeId:trade._id, ...c })} style={{ flexShrink:0 }}>
                          <Card card={c} size="small" selected={myCardOffer?.id === c.id} />
                        </div>
                      ))}
                    </div>
                    {myCardOffer?.id && (
                      <div style={{ marginTop:8 }}>
                        <Btn color="#00ff88" onClick={() => acceptTrade(trade)} disabled={loading} sm>
                          CONFIRMER L'ÉCHANGE
                        </Btn>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MES OFFRES */}
      {tab === "mine" && (
        <div style={{ flex:1, overflowY:"auto", padding:12 }}>
          {loading && <div style={{ color:"#334455", fontSize:10, padding:12 }}>Chargement...</div>}
          {!loading && myTrades.length === 0 && (
            <div style={{ color:"#1a2a3a", fontSize:11, padding:20 }}>Pas d'offres actives.</div>
          )}
          {myTrades.map(trade => {
            const offeredCard = ALL_CARDS.find(c => c.id === trade.offeredCardId);
            return (
              <div key={trade._id} style={{
                padding:"12px 14px", marginBottom:8, borderRadius:6,
                background:"rgba(0,0,0,0.5)", border:`1px solid ${trade.status === "open" ? "#0a1a2a" : "#334455"}`,
                display:"flex", justifyContent:"space-between", alignItems:"center", gap:10,
              }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  {offeredCard && <Card card={offeredCard} size="small" />}
                  <div>
                    <div style={{ fontFamily:"var(--font-d)", fontSize:9, color: trade.status==="open" ? "#00ff88" : "#778899" }}>
                      {trade.status.toUpperCase()}
                    </div>
                    <div style={{ fontSize:9, color:"#445566" }}>
                      Veut: {trade.wantedRarity || "any"}
                    </div>
                  </div>
                </div>
                {trade.status === "open" && (
                  <Btn color="#ff2255" onClick={() => cancelTrade(trade._id)} sm>ANNULER</Btn>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CRÉER une offre */}
      {tab === "create" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"8px 14px", borderBottom:"1px solid #0a1a2a", flexShrink:0 }}>
              <div style={{ fontSize:9, color:"#334455", fontFamily:"var(--font-d)", letterSpacing:2, marginBottom:6 }}>
                CARTE À OFFRIR
              </div>
              <input className="input" placeholder="Filtrer..." value={filter}
                onChange={e => setFilter(e.target.value)} />
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              <div className="card-grid">
                {filteredCollection.map(c => (
                  <Card key={c.id} card={c} size="small"
                    selected={offer?.id === c.id} onClick={setOffer} />
                ))}
              </div>
            </div>
          </div>
          {/* Panneau droite */}
          <div style={{ width:220, borderLeft:"1px solid #0a1a2a", padding:16, display:"flex", flexDirection:"column", gap:14, flexShrink:0 }}>
            <div style={{ fontFamily:"var(--font-d)", color:"#ffbb00", fontSize:9, letterSpacing:2 }}>
              NOUVELLE OFFRE
            </div>
            {offer
              ? <Card card={offer} size="small" />
              : <div style={{ width:87, height:127, border:"1px dashed #0a1a2a", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", color:"#1a2a3a", fontSize:9 }}>← CHOISIR</div>
            }
            <div>
              <div style={{ fontSize:9, color:"#445566", fontFamily:"var(--font-d)", marginBottom:6 }}>JE VEUX</div>
              <select className="input" value={wantedRarity} onChange={e => setWantedRarity(e.target.value)}>
                <option value="Any">N'importe quoi</option>
                {RARITIES.map(r => <option key={r.name}>{r.name}</option>)}
              </select>
            </div>
            <Btn color="#ffbb00" onClick={createTrade} disabled={!offer || loading}>
              PUBLIER L'OFFRE
            </Btn>
            <div style={{ fontSize:9, color:"#1a2a3a", lineHeight:1.7 }}>
              Max 5 offres actives simultanées.<br/>
              Expiration auto après 7 jours.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
