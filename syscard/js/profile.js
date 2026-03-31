// js/profile.js — Profil public + Leaderboard

// ── Titre selon ELO ───────────────────────────
function getTitle(elo) {
  if (elo >= 2000) return { label:"GRAND MASTER",  color:"#ffbb00", icon:"👑" };
  if (elo >= 1600) return { label:"ELITE HACKER",  color:"#ff2255", icon:"🔴" };
  if (elo >= 1400) return { label:"SENIOR DEV",    color:"#bf44ff", icon:"🟣" };
  if (elo >= 1200) return { label:"CODE WARRIOR",  color:"#0099ff", icon:"🔵" };
  if (elo >= 1100) return { label:"SCRIPT KIDDIE", color:"#00cc55", icon:"🟢" };
  return                  { label:"ROOKIE",         color:"#778899", icon:"⚪" };
}

// ── Mini carte profil (pour leaderboard) ─────
function PlayerRow({ rank, player, isMe, onClick }) {
  const title = getTitle(player.elo || 1000);
  const medalColor = rank === 1 ? "#ffbb00" : rank === 2 ? "#aabbcc" : rank === 3 ? "#ff8c00" : "#334455";
  return (
    <div onClick={() => onClick && onClick(player.username)} style={{
      display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
      marginBottom:4, borderRadius:6, cursor:onClick ? "pointer" : "default",
      background: isMe ? "rgba(0,255,136,0.06)" : "rgba(0,0,0,0.4)",
      border:`1px solid ${isMe ? "#00ff8833" : "#0a1a2a"}`,
      transition:"all 0.15s",
    }}>
      <div style={{ width:28, textAlign:"center", fontFamily:"var(--font-d)", fontSize:11, color:medalColor, fontWeight:700 }}>
        {rank <= 3 ? ["🥇","🥈","🥉"][rank-1] : `#${rank}`}
      </div>
      <div style={{ fontSize:20 }}>{player.avatar || "💾"}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontFamily:"var(--font-d)", fontSize:10, color: isMe ? "#00ff88" : "#c8d8e8" }}>{player.username}</span>
          <span style={{ fontSize:8, color:title.color, fontFamily:"var(--font-d)" }}>{title.icon} {title.label}</span>
        </div>
        <div style={{ fontSize:9, color:"#445566", marginTop:2 }}>
          LVL {player.level} · {player.wins}W {player.losses}L · {player.winRate}% WR
        </div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontFamily:"var(--font-d)", fontSize:13, color:"#ffbb00", fontWeight:700 }}>{player.elo}</div>
        <div style={{ fontSize:8, color:"#334455" }}>ELO</div>
      </div>
    </div>
  );
}

// ── Écran Leaderboard ─────────────────────────
function ScreenLeaderboard({ myUsername, onViewProfile, onClose }) {
  const [tab, setTab]         = useState("leaderboard"); // leaderboard | search
  const [leaderboard, setLb]  = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await API.getLeaderboard();
      setLb(data.leaderboard || []);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const filtered = searchQ.trim()
    ? leaderboard.filter(p => p.username.toLowerCase().includes(searchQ.toLowerCase()))
    : leaderboard;

  const myRank = leaderboard.findIndex(p => p.username === myUsername) + 1;

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#ffbb00" }}>🏆 LEADERBOARD</span>
        {myRank > 0 && (
          <span style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#ffbb00" }}>
            Ton rang : #{myRank}
          </span>
        )}
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {/* Search bar */}
      <div className="filter-bar">
        <input className="input" placeholder="Rechercher un joueur..." value={searchQ}
          onChange={e => setSearchQ(e.target.value)} style={{ flex:1 }} />
        <Btn color="#00cfff" onClick={loadLeaderboard} sm>🔄 REFRESH</Btn>
        <Btn color="#00ff88" onClick={() => onViewProfile && onViewProfile(myUsername)} sm>
          MON PROFIL
        </Btn>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"8px 12px" }}>
        {loading && <div style={{ color:"#334455", fontSize:10, padding:20, textAlign:"center", fontFamily:"var(--font-d)" }}>CHARGEMENT...</div>}
        {error && <div style={{ color:"#ff2255", fontSize:10, padding:12 }}>⚠ {error}</div>}
        {!loading && filtered.map(p => (
          <PlayerRow key={p.username} rank={p.rank} player={p}
            isMe={p.username === myUsername}
            onClick={onViewProfile} />
        ))}
        {!loading && filtered.length === 0 && (
          <div style={{ color:"#1a2a3a", fontSize:11, padding:20, textAlign:"center" }}>
            Aucun joueur trouvé.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Écran Profil Public ───────────────────────
function ScreenProfile({ username, myUsername, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tab, setTab]         = useState("stats"); // stats | collection | deck

  useEffect(() => { loadProfile(); }, [username]);

  const loadProfile = async () => {
    setLoading(true); setError(null);
    try {
      const data = await API.getPublicProfile(username);
      setProfile(data);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const collection = profile ? profile.collection.map(id => ALL_CARDS.find(c => c.id === id)).filter(Boolean) : [];
  const deck       = profile ? profile.deck.map(id => ALL_CARDS.find(c => c.id === id)).filter(Boolean) : [];

  if (loading) return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:110, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"var(--font-d)", color:"#00ff88", fontSize:12, letterSpacing:4 }}>CHARGEMENT PROFIL...</div>
    </div>
  );

  if (error || !profile) return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:110, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ color:"#ff2255", fontFamily:"var(--font-d)", fontSize:12 }}>PROFIL INTROUVABLE</div>
      <Btn color="#ff2255" onClick={onClose} sm>RETOUR</Btn>
    </div>
  );

  const title = profile.title || getTitle(profile.elo || 1000);
  const joinDate = new Date(profile.createdAt).toLocaleDateString("fr-FR");

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:110, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#00cfff" }}>
          {profile.avatar || "💾"} {profile.username}
          {profile.isOwner && <span style={{ color:"#334455", fontSize:9, marginLeft:8 }}>· TOI</span>}
        </span>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {/* Header carte profil */}
      <div style={{
        padding:"16px 20px", background:"rgba(0,0,0,0.5)",
        borderBottom:"1px solid #0a1a2a", flexShrink:0,
        display:"flex", gap:20, alignItems:"center",
      }}>
        {/* Avatar + titre */}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:48 }}>{profile.avatar || "💾"}</div>
          <div style={{
            fontSize:8, color:title.color, fontFamily:"var(--font-d)",
            letterSpacing:1, marginTop:4, border:`1px solid ${title.color}44`,
            padding:"2px 8px", borderRadius:3,
          }}>
            {title.icon} {title.label}
          </div>
        </div>

        {/* Stats principales */}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:15, color:"#c8d8e8", marginBottom:6 }}>
            {profile.username}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              ["ELO",      profile.elo || 1000, "#ffbb00"],
              ["NIVEAU",   profile.level,        "#00ff88"],
              ["VICTOIRES",profile.wins,          "#00cfff"],
              ["DÉFAITES", profile.losses,        "#ff2255"],
              ["WIN RATE", `${profile.winRate}%`, "#bf44ff"],
              ["CARTES",   profile.collectionCount,"#ff8c00"],
            ].map(([label, val, color]) => (
              <div key={label} style={{
                background:"rgba(0,0,0,0.4)", borderRadius:5,
                padding:"6px 8px", textAlign:"center",
                border:`1px solid ${color}18`,
              }}>
                <div style={{ fontFamily:"var(--font-d)", fontSize:7, color:"#334455", letterSpacing:1 }}>{label}</div>
                <div style={{ fontFamily:"var(--font-d)", fontSize:13, color, fontWeight:700, marginTop:2 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:8, color:"#1a2a3a", marginTop:6 }}>
            Membre depuis le {joinDate}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid #0a1a2a", flexShrink:0 }}>
        {[["stats","STATS"],["collection","COLLECTION"],["deck","DECK ACTIF"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab-btn ${tab===t?"active":""}`}
            style={{ color: tab===t ? "#00cfff" : "#334455" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {tab === "stats" && (
          <div style={{ padding:16 }}>
            {/* Barre ELO */}
            <div className="panel" style={{ marginBottom:12 }}>
              <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>PROGRESSION ELO</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#445566", marginBottom:4 }}>
                <span>ROOKIE (1000)</span><span>GRAND MASTER (2000+)</span>
              </div>
              <div style={{ height:8, background:"#050510", borderRadius:4, overflow:"hidden", border:"1px solid #0a1a2a" }}>
                <div style={{
                  width:`${Math.min(100, ((profile.elo||1000) - 1000) / 1000 * 100)}%`,
                  height:"100%", borderRadius:4,
                  background:"linear-gradient(90deg,#778899,#0099ff,#bf44ff,#ff2255,#ffbb00)",
                  transition:"width 0.6s",
                }} />
              </div>
              <div style={{ textAlign:"center", marginTop:6, fontFamily:"var(--font-d)", fontSize:11, color:"#ffbb00" }}>
                {profile.elo || 1000} ELO
              </div>
            </div>

            {/* Familles de cartes */}
            <div className="panel">
              <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>FAMILLES COLLECTÉES</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {FAMILIES.map(f => {
                  const count = collection.filter(c => c.family === f.name).length;
                  return (
                    <div key={f.name} style={{
                      background:`${f.color}0c`, border:`1px solid ${f.color}${count>0?"33":"11"}`,
                      borderRadius:5, padding:"4px 10px", opacity: count>0 ? 1 : 0.4,
                    }}>
                      <span style={{ fontSize:11 }}>{f.icon}</span>
                      <span style={{ fontFamily:"var(--font-d)", fontSize:8, color:count>0?f.color:"#334455", marginLeft:4 }}>{f.name}</span>
                      <span style={{ color:"#1a2a3a", fontSize:8, marginLeft:4 }}>×{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "collection" && (
          <div className="card-grid">
            {collection.slice(0, 100).map(c => <Card key={c.id} card={c} size="small" />)}
            {collection.length > 100 && (
              <div style={{ width:"100%", color:"#334455", fontSize:10, padding:12, fontFamily:"var(--font-d)" }}>
                ... et {collection.length - 100} autres cartes
              </div>
            )}
            {collection.length === 0 && (
              <div style={{ color:"#1a2a3a", fontSize:11, padding:24 }}>Aucune carte dans la collection.</div>
            )}
          </div>
        )}

        {tab === "deck" && (
          <div className="card-grid">
            {deck.map(c => <Card key={c.id} card={c} size="small" />)}
            {deck.length === 0 && (
              <div style={{ color:"#1a2a3a", fontSize:11, padding:24 }}>Deck non configuré.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
