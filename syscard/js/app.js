// =============================================
// js/app.js — v0.3  Main App
// Auth via JWT + Vercel API
// Progression sauvegardée en MongoDB
// =============================================

const NAV = [
  { id:"pack",       label:"PACKS",   icon:"📦", color:"#00ff88" },
  { id:"collection", label:"CARDS",   icon:"📚", color:"#00cfff" },
  { id:"deck",       label:"DECK",    icon:"🃏", color:"#bf44ff" },
  { id:"battle",     label:"BATTLE",  icon:"⚔️", color:"#ff2255" },
  { id:"trade",      label:"TRADE",   icon:"🔄", color:"#ffbb00" },
];

// ── App ───────────────────────────────────────
function App() {
  // Auth
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser]         = useState(null);   // full user object from API
  const [isGuest, setIsGuest]   = useState(false);
  const [loading, setLoading]   = useState(true);   // check saved token on mount

  // UI
  const [screen, setScreen]     = useState("home");
  const [notif, setNotif]       = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [difficulty, setDiff]   = useState("normal");

  // Local card objects (built from user.collection IDs + ALL_CARDS)
  const collection = React.useMemo(() => {
    if (!user?.collection) return [];
    return user.collection.map(id => ALL_CARDS.find(c => c.id === id)).filter(Boolean);
  }, [user?.collection]);

  const deck = React.useMemo(() => {
    if (!user?.deck) return [];
    return user.deck.map(id => ALL_CARDS.find(c => c.id === id)).filter(Boolean);
  }, [user?.deck]);

  // ── Auto-login depuis le token sauvegardé ─
  useEffect(() => {
    const token = localStorage.getItem("syscard_token");
    if (!token) { setLoading(false); return; }
    API.getProfile()
      .then(u => { setUser(u); setLoggedIn(true); })
      .catch(() => {
        // Token expiré ou invalide → déconnexion silencieuse
        localStorage.removeItem("syscard_token");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Refresh du profil toutes les 30s ───────
  // Permet de voir les tokens/coins accordés par un admin
  // sans avoir à se déconnecter/reconnecter
  useEffect(() => {
    if (!loggedIn || isGuest) return;
    const interval = setInterval(async () => {
      try {
        const fresh = await API.getProfile();
        setUser(prev => {
          // Ne mettre à jour que si quelque chose a changé
          // pour éviter des re-renders inutiles
          const changed =
            fresh.packTokens !== prev.packTokens ||
            fresh.coins      !== prev.coins      ||
            fresh.xp         !== prev.xp         ||
            fresh.wins       !== prev.wins        ||
            fresh.role       !== prev.role;
          if (!changed) return prev;
          // Notification si tokens ajoutés par admin
          if (fresh.packTokens > prev.packTokens) {
            notify(`🎁 +${fresh.packTokens - prev.packTokens} token(s) reçu(s) !`, "#ffbb00");
          }
          if (fresh.coins > prev.coins) {
            notify(`💰 +${fresh.coins - prev.coins} coins reçus !`, "#ffbb00");
          }
          return { ...prev, ...fresh };
        });
      } catch {
        // Silencieux — si l'API est down on ne déconnecte pas
      }
    }, 30000); // toutes les 30 secondes

    return () => clearInterval(interval);
  }, [loggedIn, isGuest]);

  // ── Notifications ─────────────────────────
  const notify = (msg, color = "#00ff88") => {
    setNotif({ msg, color });
    setTimeout(() => setNotif(null), 3000);
  };

  // ── Login handler ─────────────────────────
  const handleLogin = (token, userData, bonusMsg) => {
    localStorage.setItem("syscard_token", token);
    setUser(userData);
    setIsGuest(false);
    setLoggedIn(true);
    if (bonusMsg) notify(`🎁 ${bonusMsg}`, "#ffbb00");
    else notify(`> Bienvenue, ${userData.username}${userData.role === "admin" ? " 👑" : ""}`, "#00ff88");
  };

  const handleGuest = () => {
    setIsGuest(true);
    setLoggedIn(true);
    setUser({ username: "Guest", role: "player", collection: [], deck: [],
      xp: 0, level: 1, coins: 0, packTokens: 0, wins: 0, losses: 0 });
    notify("> Mode invité — progression non sauvegardée", "#ffbb00");
  };

  const handleLogout = () => {
    localStorage.removeItem("syscard_token");
    setLoggedIn(false); setUser(null); setIsGuest(false); setScreen("home");
  };

  // ── Pack opened → update user state ──────
  const handlePackOpened = (data) => {
    if (isGuest) {
      // Guest: simulate locally
      notify(`📦 Pack ouvert (guest — non sauvegardé)`, "#ffbb00");
      return;
    }
    setUser(prev => ({ ...prev, ...data.user }));
    const hasLeg = (data.drawn || []).some(c => c.rarity === "Legendary");
    notify(
      `📦 ${data.newCards} nouvelles cartes ! +${data.xpGained} XP${hasLeg ? " 🌟 LÉGENDAIRE !" : ""}`,
      hasLeg ? "#ffbb00" : "#00ff88"
    );
  };

  // ── Admin grant tokens ────────────────────
  const handleAdminGrant = async (targetUser, amount) => {
    try {
      const r = await API.adminAction("grant_tokens", targetUser, amount);
      notify(`👑 ${r.msg}`, "#ffbb00");
    } catch (e) { notify(`⚠ ${e.message}`, "#ff2255"); }
  };

  // ── Deck change → save to API ─────────────
  const handleDeckChange = async (newDeck) => {
    const ids = newDeck.map(c => c.id);
    setUser(prev => ({ ...prev, deck: ids }));
    if (!isGuest) {
      try { await API.updateProfile({ deck: ids }); }
      catch (e) { notify(`Deck sync error: ${e.message}`, "#ff2255"); }
    }
  };

  // ── Trade completed ───────────────────────
  const handleTrade = (data) => {
    setUser(prev => ({ ...prev, collection: data.myNewCollection }));
    notify(`🔄 Échange terminé !`, "#ffbb00");
  };

  // ── Battle win/loss ───────────────────────
  const handleWin = () => {
    setUser(prev => ({
      ...prev,
      wins: (prev.wins || 0) + 1,
      xp: (prev.xp || 0) + 100,
      level: Math.floor(((prev.xp || 0) + 100) / 200) + 1,
      packTokens: (prev.packTokens || 0) + 1,
    }));
    notify("⚔️ VICTOIRE ! +100 XP +1 Token", "#00ff88");
  };
  const handleLoss = () => {
    setUser(prev => ({
      ...prev,
      losses: (prev.losses || 0) + 1,
      xp: (prev.xp || 0) + 20,
    }));
    notify("💀 Défaite. +20 XP — réessaie !", "#ff2255");
  };

  // ── Loading splash ────────────────────────
  if (loading) return null; // le splash HTML natif est affiché

  // ── Login screen ──────────────────────────
  if (!loggedIn) return <ScreenLogin onLogin={handleLogin} onGuest={handleGuest} />;

  // ── Main app ──────────────────────────────
  const level      = Math.floor((user?.xp || 0) / 200) + 1;
  const xpProgress = ((user?.xp || 0) % 200) / 200;
  const dailyAvail = !user?.dailyPackClaimedAt ||
    new Date().toDateString() !== new Date(user.dailyPackClaimedAt).toDateString();

  return (
    <div style={{ width:"100vw", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden", background:"var(--bg)" }}>

      <Notification msg={notif?.msg} color={notif?.color} />

      {/* ── Top bar ── */}
      <div style={{
        background:"rgba(3,3,10,0.98)", borderBottom:"1px solid #0a1a2a",
        padding:"8px 16px", display:"flex", justifyContent:"space-between",
        alignItems:"center", flexShrink:0, gap:12,
      }}>
        {/* Logo */}
        <div style={{ flexShrink:0 }}>
          <div style={{
            fontFamily:"var(--font-d)", fontSize:15, fontWeight:900,
            color:"#00ff88", letterSpacing:4,
            textShadow:"0 0 14px rgba(0,255,136,0.4)",
            animation:"glitch 8s infinite",
          }}>
            SYS://CARD
          </div>
          <div style={{ fontFamily:"var(--font-b)", fontSize:8, color:"#1a2a3a", letterSpacing:2 }}>
            {isGuest ? "GUEST MODE" : `v0.3 BETA`}
          </div>
        </div>

        {/* XP bar — aéré et lisible */}
        <div style={{ flex:1, maxWidth:180 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, gap:4 }}>
            <span style={{
              fontFamily:"var(--font-d)", fontSize:11, color:"#00ff88",
              letterSpacing:1, fontWeight:700,
            }}>
              LVL {level}
            </span>
            <span style={{ fontFamily:"var(--font-b)", fontSize:10, color:"#445566" }}>
              {(user?.xp || 0) % 200} / 200 XP
            </span>
          </div>
          <div style={{
            height:5, background:"#050510", borderRadius:3,
            border:"1px solid #0d1d2d", overflow:"hidden",
          }}>
            <div style={{
              width:`${xpProgress * 100}%`, height:"100%",
              background:"linear-gradient(90deg,#00cc55,#00ff88)",
              borderRadius:3, transition:"width 0.6s ease",
              boxShadow:"0 0 8px rgba(0,255,136,0.5)",
            }} />
          </div>
        </div>

        {/* User info + admin button */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{
              fontFamily:"var(--font-d)", fontSize:9, letterSpacing:1,
              color: isGuest ? "#778899" : user?.role === "admin" ? "#ffbb00" : "#00cfff",
            }}>
              {user?.role === "admin" ? "👑 " : isGuest ? "👤 " : ""}{user?.username}
            </div>
            <div style={{ fontSize:8, color:"#334455", fontFamily:"var(--font-b)" }}>
              💰 {user?.coins || 0} &nbsp;🎫 {user?.packTokens || 0}
            </div>
          </div>
          {user?.role === "admin" && (
            <button onClick={() => setShowAdmin(true)} style={{
              background:"transparent", border:"1px solid #ffbb0044",
              color:"#ffbb00", padding:"4px 8px", borderRadius:3,
              cursor:"pointer", fontFamily:"var(--font-d)", fontSize:8, letterSpacing:1,
            }}>ADMIN</button>
          )}
          <button onClick={handleLogout} style={{
            background:"transparent", border:"1px solid #0a1a2a",
            color:"#334455", padding:"4px 8px", borderRadius:3,
            cursor:"pointer", fontFamily:"var(--font-d)", fontSize:8, letterSpacing:1,
          }}>OUT</button>
        </div>
      </div>

      {/* ── Main dashboard ── */}
      <div style={{ flex:1, overflowY:"auto", padding:14 }}>

        {/* Welcome — si aucune carte */}
        {collection.length === 0 && (
          <div style={{
            padding:28, textAlign:"center", marginBottom:14,
            background:"rgba(0,255,136,0.02)",
            border:"1px dashed rgba(0,255,136,0.1)", borderRadius:8,
            animation:"fadeUp 0.5s ease",
          }}>
            <div style={{ fontSize:46, marginBottom:12 }}>💾</div>
            <div style={{ fontFamily:"var(--font-d)", color:"#00ff88", fontSize:14, letterSpacing:4, marginBottom:6 }}>
              BIENVENUE, HACKER
            </div>
            <div style={{ color:"#334455", fontSize:11 }}>
              Ouvre ton premier pack pour commencer ta collection
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
          {[
            { label:"COLLECTION", value:`${collection.length} / ${ALL_CARDS.length}`, color:"#00cfff", icon:"📚" },
            { label:"DECK",       value:`${deck.length} / 20`,                        color:"#bf44ff", icon:"🃏" },
            { label:"VICTOIRES",  value:`${user?.wins || 0}W — ${user?.losses || 0}L`,color:"#00ff88", icon:"⚔️" },
            { label:"TOKENS",     value:`${user?.packTokens || 0}`,                   color:"#ffbb00", icon:"🎫" },
          ].map(item => (
            <div key={item.label} className="panel" style={{
              border:`1px solid ${item.color}15`, animation:"fadeUp 0.4s ease",
            }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{item.icon}</div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:8, color:"#334455", letterSpacing:2 }}>
                {item.label}
              </div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:14, color:item.color, fontWeight:700, marginTop:3 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Rarity progress */}
        {collection.length > 0 && (
          <div className="panel" style={{ marginBottom:12 }}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:10 }}>
              PROGRESSION COLLECTION
            </div>
            {RARITIES.map(r => {
              const count = collection.filter(c => c.rarity === r.name).length;
              const total = ALL_CARDS.filter(c => c.rarity === r.name).length;
              return (
                <div key={r.name} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, marginBottom:3 }}>
                    <span style={{ color:r.color, fontFamily:"var(--font-d)" }}>{r.name}</span>
                    <span style={{ color:"#1a2a3a" }}>{count} / {total}</span>
                  </div>
                  <div style={{ height:4, background:"#050510", borderRadius:2, overflow:"hidden" }}>
                    <div style={{
                      width:`${total ? (count/total)*100 : 0}%`, height:"100%",
                      background:r.color, borderRadius:2,
                      boxShadow:`0 0 5px ${r.color}`, transition:"width 0.6s",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cartes récentes */}
        {collection.length > 0 && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>
              CARTES RÉCENTES
            </div>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
              {collection.slice(-6).reverse().map(c => (
                <div key={c.id} style={{ flexShrink:0 }}><Card card={c} size="small" /></div>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty selector */}
        <div className="panel" style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>
            DIFFICULTÉ (PvE)
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[["easy","#00ff88","ROOKIE"],["normal","#00cfff","HACKER"],["hard","#ff2255","ELITE"]].map(([d,c,label]) => (
              <button key={d} onClick={() => setDiff(d)} style={{
                flex:1, padding:"7px 4px",
                background:difficulty===d ? `${c}14` : "transparent",
                border:`1px solid ${difficulty===d ? c : "#0a1a2a"}`,
                borderRadius:4, color:difficulty===d ? c : "#334455",
                cursor:"pointer", fontFamily:"var(--font-d)", fontSize:9,
                letterSpacing:1, transition:"all 0.15s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Familles */}
        {collection.length > 0 && (
          <div className="panel">
            <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>
              FAMILLES
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {FAMILIES.map(f => {
                const count = collection.filter(c => c.family === f.name).length;
                return (
                  <div key={f.name} style={{
                    background:`${f.color}0c`, border:`1px solid ${f.color}20`,
                    borderRadius:5, padding:"4px 10px",
                  }}>
                    <span style={{ fontSize:11 }}>{f.icon}</span>
                    <span style={{ fontFamily:"var(--font-d)", fontSize:8, color:f.color, marginLeft:4 }}>{f.name}</span>
                    <span style={{ color:"#1a2a3a", fontSize:8, marginLeft:4 }}>×{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <div style={{
        display:"flex", background:"rgba(3,3,10,0.98)",
        borderTop:"1px solid #0a1a2a", flexShrink:0,
      }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)} style={{
            flex:1, background:"transparent", border:"none", cursor:"pointer",
            padding:"9px 4px 7px", display:"flex", flexDirection:"column",
            alignItems:"center", gap:2,
            borderTop:`2px solid ${item.color}`,
            transition:"filter 0.15s",
          }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>
            <span style={{ fontFamily:"var(--font-d)", fontSize:7, color:item.color, letterSpacing:1 }}>
              {item.label}
            </span>
            {/* Point vert si pack dispo */}
            {item.id === "pack" && (dailyAvail || (user?.packTokens || 0) > 0) && (
              <span style={{
                width:4, height:4, borderRadius:"50%",
                background:"#00ff88", boxShadow:"0 0 5px #00ff88", display:"block",
              }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Overlays ── */}
      {screen === "pack" && (
        <ScreenPackOpen
          user={user || {}}
          onClose={() => setScreen("home")}
          onPackOpened={handlePackOpened}
          isAdmin={user?.role === "admin"}
          onAdminGrant={handleAdminGrant}
        />
      )}
      {screen === "collection" && (
        <ScreenCollection collection={collection} onClose={() => setScreen("home")} />
      )}
      {screen === "deck" && (
        <ScreenDeck
          collection={collection} deck={deck}
          onDeckChange={handleDeckChange} onClose={() => setScreen("home")}
        />
      )}
      {screen === "battle" && (
        <ScreenBattle
          playerDeck={deck} difficulty={difficulty}
          onClose={() => setScreen("home")}
          onWin={handleWin} onLoss={handleLoss}
        />
      )}
      {screen === "trade" && (
        <ScreenTrade
          collection={collection}
          onTrade={handleTrade}
          onClose={() => setScreen("home")}
        />
      )}
      {/* PvP accessible via battle screen ou direct */}
      {screen === "pvp" && (
        <ScreenPvP
          deck={user?.deck || []}
          username={user?.username || "Guest"}
          onClose={() => setScreen("home")}
        />
      )}

      {/* Admin panel */}
      {showAdmin && user?.role === "admin" && (
        <ScreenAdmin username={user.username} onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}

// ── Mount React ───────────────────────────────
const rootEl = document.getElementById("root");
// Vider le splash natif
rootEl.innerHTML = "";
const root = ReactDOM.createRoot(rootEl);
root.render(React.createElement(App));
