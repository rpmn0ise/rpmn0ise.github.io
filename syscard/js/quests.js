// js/quests.js — Écran quêtes quotidiennes

function ScreenQuests({ user, onQuestClaimed, onClose }) {
  const [quests, setQuests]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [msg, setMsg]         = useState(null);

  useEffect(() => { loadQuests(); }, []);

  const loadQuests = async () => {
    setLoading(true);
    try {
      const data = await API.getQuests();
      setQuests(data.quests || []);
    } catch(e) { setMsg({ text: e.message, color:"#ff2255" }); }
    finally { setLoading(false); }
  };

  const claimQuest = async (questId) => {
    setClaiming(questId);
    try {
      const data = await API.claimQuest(questId);
      setMsg({ text: `✅ Récompense réclamée ! +${data.reward.coins} coins${data.reward.tokens > 0 ? ` +${data.reward.tokens} token(s)` : ""}`, color:"#00ff88" });
      loadQuests();
      onQuestClaimed && onQuestClaimed(data);
    } catch(e) { setMsg({ text: e.message, color:"#ff2255" }); }
    finally { setClaiming(null); }
  };

  const totalCompleted = quests.filter(q => q.completed).length;
  const totalClaimed   = quests.filter(q => q.claimed).length;

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div className="screen-hdr">
        <span className="screen-title" style={{ color:"#00ff88" }}>
          📋 QUÊTES DU JOUR
          <span style={{ color:"#334455", fontSize:9, marginLeft:8 }}>
            {totalClaimed}/{quests.length} réclamées
          </span>
        </span>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {msg && (
        <div style={{ padding:"7px 16px", color:msg.color, fontFamily:"var(--font-d)", fontSize:10,
          background:`${msg.color}0a`, borderBottom:"1px solid " + msg.color + "22", flexShrink:0 }}>
          {msg.text}
        </div>
      )}

      {/* Progression globale */}
      <div style={{ padding:"10px 16px", borderBottom:"1px solid #0a1a2a", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#445566", marginBottom:5 }}>
          <span style={{ fontFamily:"var(--font-d)", letterSpacing:1 }}>PROGRESSION DU JOUR</span>
          <span>{totalCompleted}/{quests.length} complétées</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{
            width:`${quests.length > 0 ? (totalCompleted/quests.length)*100 : 0}%`,
            background:"#00ff88", boxShadow:"0 0 6px #00ff88",
          }} />
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:16 }}>
        {loading && (
          <div style={{ color:"#334455", fontSize:11, padding:20, textAlign:"center", fontFamily:"var(--font-d)" }}>
            CHARGEMENT DES QUÊTES...
          </div>
        )}

        {!loading && quests.map(quest => (
          <div key={quest.id} style={{
            padding:"14px 16px", marginBottom:10, borderRadius:8,
            background:"rgba(0,0,0,0.5)",
            border:`1px solid ${quest.claimed ? "#1a2a3a" : quest.completed ? "#00ff8844" : "#0a1a2a"}`,
            opacity: quest.claimed ? 0.5 : 1,
            transition:"all 0.2s",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              {/* Info quête */}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <span style={{ fontSize:18 }}>{quest.icon}</span>
                  <span style={{ fontFamily:"var(--font-d)", fontSize:11,
                    color: quest.claimed ? "#334455" : quest.completed ? "#00ff88" : "#c8d8e8" }}>
                    {quest.label}
                  </span>
                  {quest.claimed && <span style={{ fontSize:9, color:"#334455" }}>✓ RÉCLAMÉE</span>}
                </div>

                {/* Barre de progression */}
                <div style={{ marginBottom:5 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:"#445566", marginBottom:3 }}>
                    <span>Progression</span>
                    <span>{Math.min(quest.progress || 0, quest.target)} / {quest.target}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{
                      width:`${Math.min(100, ((quest.progress||0)/quest.target)*100)}%`,
                      background: quest.completed ? "#00ff88" : "#0099ff",
                    }} />
                  </div>
                </div>

                {/* Récompenses */}
                <div style={{ display:"flex", gap:8 }}>
                  {quest.reward.coins > 0 && (
                    <span style={{ fontSize:9, color:"#ffbb00", background:"rgba(255,187,0,0.08)", padding:"1px 8px", borderRadius:3, border:"1px solid rgba(255,187,0,0.2)" }}>
                      💰 +{quest.reward.coins}
                    </span>
                  )}
                  {quest.reward.tokens > 0 && (
                    <span style={{ fontSize:9, color:"#bf44ff", background:"rgba(191,68,255,0.08)", padding:"1px 8px", borderRadius:3, border:"1px solid rgba(191,68,255,0.2)" }}>
                      🎫 +{quest.reward.tokens}
                    </span>
                  )}
                  {quest.reward.xp > 0 && (
                    <span style={{ fontSize:9, color:"#00ff88", background:"rgba(0,255,136,0.08)", padding:"1px 8px", borderRadius:3, border:"1px solid rgba(0,255,136,0.2)" }}>
                      ⚡ +{quest.reward.xp} XP
                    </span>
                  )}
                </div>
              </div>

              {/* Bouton réclamer */}
              <div style={{ marginLeft:12, flexShrink:0 }}>
                {quest.completed && !quest.claimed && (
                  <Btn color="#00ff88" onClick={() => claimQuest(quest.id)}
                    disabled={claiming === quest.id} sm>
                    {claiming === quest.id ? "..." : "RÉCLAMER"}
                  </Btn>
                )}
                {!quest.completed && (
                  <div style={{ width:60, textAlign:"center", fontSize:9, color:"#334455", fontFamily:"var(--font-d)" }}>
                    EN COURS
                  </div>
                )}
                {quest.claimed && (
                  <div style={{ fontSize:20 }}>✅</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Reset info */}
        <div style={{ textAlign:"center", padding:"12px 0", fontSize:9, color:"#1a2a3a", fontFamily:"var(--font-b)" }}>
          Les quêtes se renouvellent chaque jour à minuit.
        </div>
      </div>
    </div>
  );
}
