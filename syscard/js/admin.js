// js/admin.js — Admin Panel Screen

function ScreenAdmin({ username, onClose }) {
  const [users, setUsers]         = useState([]);
  const [logs, setLogs]           = useState([]);
  const [target, setTarget]       = useState("");
  const [tokenAmt, setTokenAmt]   = useState(5);
  const [coinAmt, setCoinAmt]     = useState(200);
  const [msg, setMsg]             = useState(null);
  const [loading, setLoading]     = useState(false);
  const [tab, setTab]             = useState("users");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [u, l] = await Promise.all([
        API.adminAction("list_users"),
        API.adminAction("get_log"),
      ]);
      setUsers(u.users || []);
      setLogs(l.logs || []);
    } catch (e) { setMsg({ text: e.message, color: "#ff2255" }); }
  };

  const doAction = async (action, value) => {
    if (!target) { setMsg({ text: "Select a user first", color: "#ff2255" }); return; }
    setLoading(true);
    try {
      const r = await API.adminAction(action, target, value);
      setMsg({ text: r.msg || "Done", color: "#00ff88" });
      loadData();
    } catch (e) { setMsg({ text: e.message, color: "#ff2255" }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:200, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#ffbb00" }}>👑 ADMIN PANEL</span>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid #0a1a2a" }}>
        {[["users","USERS"],["logs","LOGS"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:"8px 20px", background:tab===t?"rgba(255,187,0,0.1)":"transparent",
            border:"none", borderBottom:tab===t?"2px solid #ffbb00":"2px solid transparent",
            color:tab===t?"#ffbb00":"#334455", cursor:"pointer", fontFamily:"var(--font-d)", fontSize:10, letterSpacing:2,
          }}>{l}</button>
        ))}
      </div>

      {msg && (
        <div style={{ padding:"8px 16px", background:msg.color+"18", color:msg.color, fontFamily:"var(--font-d)", fontSize:10, letterSpacing:1 }}>
          {msg.text}
        </div>
      )}

      {tab === "users" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* User list */}
          <div style={{ flex:1, overflowY:"auto", padding:12 }}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>
              {users.length} REGISTERED USERS
            </div>
            {users.map(u => (
              <div key={u.username} onClick={() => setTarget(u.username)} style={{
                padding:"10px 12px", marginBottom:6, borderRadius:6, cursor:"pointer",
                background: target===u.username ? "rgba(255,187,0,0.08)" : "rgba(0,0,0,0.4)",
                border:`1px solid ${target===u.username ? "#ffbb00" : "#0a1a2a"}`,
                transition:"all 0.15s",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <span style={{ fontFamily:"var(--font-d)", fontSize:11, color: u.role==="admin" ? "#ffbb00" : "#00cfff" }}>
                      {u.role==="admin" ? "👑 " : ""}{u.username}
                    </span>
                    <span style={{ fontSize:9, color:"#334455", marginLeft:8 }}>Lv.{u.level}</span>
                  </div>
                  <div style={{ fontSize:9, color:"#334455", textAlign:"right" }}>
                    <div>🎫 {u.packTokens} tokens</div>
                    <div>💰 {u.coins} coins</div>
                    <div>⚔️ {u.wins}W / {u.losses}L</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action panel */}
          <div style={{ width:220, borderLeft:"1px solid #0a1a2a", padding:16, display:"flex", flexDirection:"column", gap:14, flexShrink:0 }}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2 }}>ACTIONS</div>
            {target ? (
              <div style={{ fontFamily:"var(--font-d)", color:"#ffbb00", fontSize:11 }}>→ {target}</div>
            ) : (
              <div style={{ color:"#1a2a3a", fontSize:10 }}>Select a user ←</div>
            )}

            {/* Grant tokens */}
            <div>
              <div style={{ fontSize:9, color:"#445566", marginBottom:6 }}>GRANT TOKENS</div>
              <div style={{ display:"flex", gap:6 }}>
                <input type="number" value={tokenAmt} onChange={e => setTokenAmt(parseInt(e.target.value)||1)}
                  className="input" style={{ width:60 }} min={1} max={100} />
                <Btn color="#ffbb00" onClick={() => doAction("grant_tokens", tokenAmt)} disabled={loading || !target} sm>
                  GRANT
                </Btn>
              </div>
            </div>

            {/* Grant coins */}
            <div>
              <div style={{ fontSize:9, color:"#445566", marginBottom:6 }}>GRANT COINS</div>
              <div style={{ display:"flex", gap:6 }}>
                <input type="number" value={coinAmt} onChange={e => setCoinAmt(parseInt(e.target.value)||1)}
                  className="input" style={{ width:60 }} min={1} max={10000} />
                <Btn color="#ffbb00" onClick={() => doAction("grant_coins", coinAmt)} disabled={loading || !target} sm>
                  GRANT
                </Btn>
              </div>
            </div>

            {/* Role management */}
            <div>
              <div style={{ fontSize:9, color:"#445566", marginBottom:6 }}>ROLE MANAGEMENT</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <Btn color="#ffbb00" onClick={() => doAction("promote")} disabled={loading || !target} sm>
                  👑 PROMOTE TO ADMIN
                </Btn>
                <Btn color="#ff2255" onClick={() => doAction("demote")} disabled={loading || !target} sm>
                  DEMOTE TO PLAYER
                </Btn>
              </div>
            </div>

            <div style={{ marginTop:"auto", fontSize:9, color:"#1a2a3a", lineHeight:1.7 }}>
              All actions are logged.<br/>
              You cannot demote yourself.
            </div>
          </div>
        </div>
      )}

      {tab === "logs" && (
        <div style={{ flex:1, overflowY:"auto", padding:12 }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:8 }}>
            LAST 50 ADMIN ACTIONS
          </div>
          {logs.length === 0 && <div style={{ color:"#1a2a3a", fontSize:10 }}>No actions yet.</div>}
          {logs.map((l, i) => (
            <div key={i} style={{ padding:"6px 10px", marginBottom:4, background:"rgba(0,0,0,0.4)", borderRadius:4, border:"1px solid #0a1a2a" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9 }}>
                <span style={{ color:"#ffbb00", fontFamily:"var(--font-d)" }}>{l.adminUser}</span>
                <span style={{ color:"#1a2a3a" }}>{new Date(l.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize:9, color:"#445566", marginTop:2 }}>
                {l.action} → <span style={{ color:"#00cfff" }}>{l.targetUser}</span>
                {l.value !== undefined ? <span style={{ color:"#ffbb00" }}> ({l.value})</span> : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
