// js/pvp.js — PvP Battle Screen (polling every 2s)

function ScreenPvP({ deck, username, onClose }) {
  const [phase, setPhase]     = useState("lobby");   // lobby|waiting|battle|end
  const [roomId, setRoomId]   = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [openRooms, setOpenRooms] = useState([]);
  const [error, setError]     = useState(null);
  const [myMove, setMyMove]   = useState(null);
  const [busy, setBusy]       = useState(false);
  const pollRef = useRef(null);

  // ── Polling loop ──────────────────────────
  useEffect(() => {
    if ((phase === "waiting" || phase === "battle") && roomId) {
      pollRef.current = setInterval(async () => {
        try {
          const data = await API.pollBattle(roomId);
          setRoomState(data.room);
          if (data.room.status === "active" && phase === "waiting") setPhase("battle");
          if (data.room.winner) { setPhase("end"); clearInterval(pollRef.current); }
        } catch (e) { setError(e.message); }
      }, 2000);
    }
    return () => clearInterval(pollRef.current);
  }, [phase, roomId]);

  // ── Load open rooms ───────────────────────
  const loadRooms = async () => {
    try { const d = await API.listRooms(); setOpenRooms(d.rooms || []); }
    catch (e) { setError(e.message); }
  };

  useEffect(() => { if (phase === "lobby") loadRooms(); }, [phase]);

  // ── Create room ───────────────────────────
  const createRoom = async () => {
    if (deck.length < 4) { setError("Need at least 4 cards in deck"); return; }
    setBusy(true);
    try {
      const d = await API.createBattle(deck);
      setRoomId(d.roomId);
      setPhase("waiting");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  // ── Join room ─────────────────────────────
  const joinRoom = async (rid) => {
    if (deck.length < 4) { setError("Need at least 4 cards in deck"); return; }
    setBusy(true);
    try {
      await API.joinBattle(rid, deck);
      setRoomId(rid);
      const d = await API.pollBattle(rid);
      setRoomState(d.room);
      setPhase("battle");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  // ── Submit move ───────────────────────────
  const submitMove = async (move) => {
    if (busy) return;
    setBusy(true); setMyMove(null);
    try {
      const d = await API.submitMove(roomId, move);
      setRoomState(d.room);
      if (d.room.winner) { setPhase("end"); clearInterval(pollRef.current); }
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const forfeit = async () => {
    await API.forfeit(roomId).catch(() => {});
    clearInterval(pollRef.current);
    onClose();
  };

  const isMyTurn = roomState && roomState.turn === roomState.mySlot && !busy;

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#ff2255" }}>
          ⚔️ PVP BATTLE {roomId && <span style={{ color:"#334455", fontSize:10 }}>#{roomId}</span>}
        </span>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {error && (
        <div style={{ padding:"6px 16px", background:"rgba(255,34,85,0.1)", color:"#ff2255", fontSize:10, fontFamily:"var(--font-d)" }}>
          ⚠ {error} <button onClick={() => setError(null)} style={{ background:"none", border:"none", color:"#ff2255", cursor:"pointer", marginLeft:8 }}>✕</button>
        </div>
      )}

      {/* LOBBY */}
      {phase === "lobby" && (
        <div style={{ flex:1, padding:20, overflowY:"auto" }}>
          <div style={{ display:"flex", gap:12, marginBottom:20 }}>
            <Btn color="#00ff88" onClick={createRoom} disabled={busy}>
              + CREATE ROOM
            </Btn>
            <Btn color="#00cfff" onClick={loadRooms} disabled={busy} sm>
              🔄 REFRESH
            </Btn>
          </div>

          <div style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#334455", letterSpacing:2, marginBottom:10 }}>
            OPEN ROOMS ({openRooms.length})
          </div>

          {openRooms.length === 0 && (
            <div style={{ color:"#1a2a3a", fontSize:11, padding:"20px 0" }}>
              No open rooms. Create one and wait for an opponent!
            </div>
          )}

          {openRooms.map(room => (
            <div key={room.roomId} style={{
              padding:"12px 14px", marginBottom:8, borderRadius:6,
              background:"rgba(0,0,0,0.5)", border:"1px solid #0a1a2a",
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <div>
                <div style={{ fontFamily:"var(--font-d)", fontSize:11, color:"#00cfff" }}>#{room.roomId}</div>
                <div style={{ fontSize:9, color:"#445566" }}>{room.player1} waiting...</div>
              </div>
              <Btn color="#00ff88" onClick={() => joinRoom(room.roomId)} disabled={busy} sm>
                JOIN →
              </Btn>
            </div>
          ))}
        </div>
      )}

      {/* WAITING */}
      {phase === "waiting" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:14, color:"#00ff88", letterSpacing:4 }}>WAITING FOR OPPONENT</div>
          <div style={{ fontFamily:"var(--font-d)", color:"#334455", fontSize:11, letterSpacing:2 }}>
            Room: <span style={{ color:"#00cfff" }}>#{roomId}</span>
          </div>
          <div style={{ color:"#1a2a3a", fontSize:10 }}>Share this room ID with your opponent</div>
          <div style={{ fontFamily:"var(--font-b)", color:"#334455", fontSize:9, animation:"blink 1.2s infinite" }}>
            Polling every 2 seconds...
          </div>
          <Btn color="#ff2255" onClick={forfeit} sm>CANCEL</Btn>
        </div>
      )}

      {/* BATTLE */}
      {phase === "battle" && roomState && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Turn indicator */}
          <div style={{
            padding:"6px 16px", textAlign:"center",
            background: isMyTurn ? "rgba(0,255,136,0.08)" : "rgba(255,34,85,0.06)",
            borderBottom:"1px solid #0a1a2a", fontFamily:"var(--font-d)", fontSize:10, letterSpacing:2,
            color: isMyTurn ? "#00ff88" : "#ff2255",
          }}>
            {isMyTurn ? "YOUR TURN — Choose an action" : "OPPONENT'S TURN — Waiting..."}
            {!isMyTurn && <span style={{ animation:"blink 1.2s infinite", marginLeft:8 }}>●</span>}
          </div>

          {/* Opponent info */}
          <div style={{ padding:"8px 16px", borderBottom:"1px solid #0a1a2a", flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <span style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#ff2255" }}>
                OPPONENT {roomState.opp.handCount !== undefined && `(${roomState.opp.handCount} in hand)`}
              </span>
              <EnergyPips current={roomState.opp.energy || 0} max={6} color="#ff2255" />
            </div>
            {roomState.opp.active ? (
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:28 }}>
                  {FAMILIES.find(f => f.name === roomState.opp.active.family)?.icon || "❓"}
                </div>
                <div>
                  <div style={{ fontFamily:"var(--font-d)", fontSize:10, color:"#ff2255" }}>{roomState.opp.active.family}</div>
                  <HPBar current={roomState.opp.active.hp} max={roomState.opp.active.hp + 30} color="#ff2255" />
                  <div style={{ fontSize:9, color:"#334455" }}>{roomState.opp.active.hp} HP</div>
                </div>
              </div>
            ) : (
              <div style={{ color:"#1a2a3a", fontSize:10 }}>No active card yet</div>
            )}
          </div>

          {/* Battle log */}
          <div style={{ flex:1, overflowY:"auto", padding:"8px 14px" }}>
            {(roomState.log || []).map((e, i) => (
              <div key={i} style={{ color: e.color || "#778899", fontSize:10, lineHeight:1.9 }}>
                {e.msg}
              </div>
            ))}
          </div>

          {/* My zone */}
          <div style={{ padding:"8px 16px", borderTop:"1px solid #0a1a2a", flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontFamily:"var(--font-d)", fontSize:9, color:"#00ff88" }}>YOU</span>
              <EnergyPips current={roomState.me?.energy || 0} max={6} color="#00ff88" />
            </div>

            {/* My active card */}
            {roomState.me?.active && (
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                <div style={{ fontSize:28 }}>
                  {FAMILIES.find(f => f.name === roomState.me.active.family)?.icon || "❓"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"var(--font-d)", fontSize:10, color:"#00ff88" }}>{roomState.me.active.family}</div>
                  <HPBar current={roomState.me.active.hp} max={roomState.me.active.hp + 30} color="#00ff88" />
                  <div style={{ fontSize:9, color:"#334455" }}>{roomState.me.active.hp} HP · ATK {roomState.me.active.atk} · DEF {roomState.me.active.def}</div>
                </div>
              </div>
            )}

            {/* Hand */}
            {(roomState.me?.hand || []).length > 0 && !roomState.me?.active && (
              <div>
                <div style={{ fontSize:9, color:"#334455", fontFamily:"var(--font-d)", marginBottom:6 }}>PLAY A CARD TO START</div>
                <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
                  {roomState.me.hand.map(c => (
                    <div key={c.id} onClick={() => isMyTurn && submitMove({ type:"play", cardId:c.id })}
                      style={{ flexShrink:0, cursor:isMyTurn?"pointer":"default",
                        padding:"8px 12px", background:`rgba(0,0,0,0.5)`, borderRadius:6,
                        border:`1px solid ${FAMILIES.find(f=>f.name===c.family)?.color||"#333"}44`,
                      }}>
                      <div style={{ fontSize:18 }}>{FAMILIES.find(f=>f.name===c.family)?.icon||"❓"}</div>
                      <div style={{ fontSize:8, color:"#445566" }}>{c.family}</div>
                      <div style={{ fontSize:8, color:"#ffaa44" }}>ATK {c.atk}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {roomState.me?.active && (
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <Btn color="#00ff88" onClick={() => submitMove({ type:"attack" })}
                  disabled={!isMyTurn || !roomState.opp.active} sm>
                  ⚔️ ATTACK (1⚡)
                </Btn>
                {(roomState.me.bench || []).map(c => (
                  <Btn key={c.id} color="#ff8c00"
                    onClick={() => submitMove({ type:"retreat", cardId:c.id })}
                    disabled={!isMyTurn || (roomState.me.energy < 2)} sm>
                    🔄 RETREAT ({FAMILIES.find(f=>f.name===c.family)?.icon||"?"})
                  </Btn>
                ))}
                <Btn color="#ff2255" onClick={forfeit} sm>🏳️ FORFEIT</Btn>
              </div>
            )}
          </div>
        </div>
      )}

      {/* END */}
      {phase === "end" && roomState && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
          <div style={{
            fontFamily:"var(--font-d)", fontSize:26, letterSpacing:6,
            color: roomState.winner === roomState.mySlot ? "#00ff88" : "#ff2255",
            animation:"glitch 3s infinite",
          }}>
            {roomState.winner === roomState.mySlot ? "VICTORY!" : "DEFEATED"}
          </div>
          <div style={{ color:"#445566", fontSize:11 }}>
            {roomState.winner === roomState.mySlot ? "+100 XP +1 Pack Token" : "+20 XP"}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <Btn color="#00cfff" onClick={() => { setPhase("lobby"); setRoomId(null); setRoomState(null); }}>
              BACK TO LOBBY
            </Btn>
            <Btn color="#ff2255" onClick={onClose}>EXIT</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
