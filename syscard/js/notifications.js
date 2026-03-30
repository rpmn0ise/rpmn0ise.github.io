// js/notifications.js — Écran notifications

function ScreenNotifications({ onClose }) {
  const [notifs, setNotifs]   = useState([]);
  const [unread, setUnread]   = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifs();
    // Marquer comme lues
    API.readAllNotifications().catch(() => {});
  }, []);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const data = await API.getNotifications();
      setNotifs(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {}
    finally { setLoading(false); }
  };

  const clearAll = async () => {
    await API.clearNotifications().catch(() => {});
    setNotifs([]);
  };

  const TYPE_ICONS = {
    quest:      "📋",
    shop:       "🛒",
    elo:        "📊",
    tournament: "🏆",
    trade:      "🔄",
    admin:      "👑",
    pack:       "📦",
  };
  const TYPE_COLORS = {
    quest: "#00ff88", shop: "#ffbb00", elo: "#0099ff",
    tournament: "#ffbb00", trade: "#ff8c00", admin: "#ffbb00", pack: "#00ff88",
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#00cfff" }}>
          🔔 NOTIFICATIONS
          {unread > 0 && <span style={{ color:"#ff2255", marginLeft:8, fontSize:9 }}>{unread} non lues</span>}
        </span>
        <div style={{ display:"flex", gap:8 }}>
          {notifs.length > 0 && <Btn color="#334455" onClick={clearAll} sm>TOUT SUPPRIMER</Btn>}
          <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"8px 12px" }}>
        {loading && <div style={{ color:"#334455", fontSize:11, padding:20, textAlign:"center", fontFamily:"var(--font-d)" }}>CHARGEMENT...</div>}

        {!loading && notifs.length === 0 && (
          <div style={{ color:"#1a2a3a", fontSize:11, padding:32, textAlign:"center", fontFamily:"var(--font-d)" }}>
            Aucune notification.
          </div>
        )}

        {notifs.map((n, i) => {
          const color = TYPE_COLORS[n.type] || "#778899";
          const icon  = TYPE_ICONS[n.type]  || "🔔";
          const date  = new Date(n.at).toLocaleString("fr-FR", { hour:"2-digit", minute:"2-digit", day:"2-digit", month:"2-digit" });
          return (
            <div key={n.id || i} style={{
              padding:"10px 14px", marginBottom:6, borderRadius:6,
              background:`${color}08`, border:`1px solid ${color}22`,
              display:"flex", gap:10, alignItems:"flex-start",
              opacity: n.read ? 0.7 : 1,
            }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:n.read ? "#445566" : "#c8d8e8", lineHeight:1.6 }}>{n.msg}</div>
                <div style={{ fontSize:8, color:"#334455", marginTop:3 }}>{date}</div>
              </div>
              {!n.read && <span style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0, marginTop:4 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
