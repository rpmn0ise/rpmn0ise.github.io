// =============================================
// js/battle.js — v0.2  Full Battle Engine
// Inspired by Pokémon TCG:
//   - Energy system (gain 1-2/turn, spend to play cards)
//   - Active + bench cards (retreat mechanic)
//   - Type weaknesses/resistances
//   - Special abilities with real effects
//   - Status effects: poison, stun, shield, reflect
// =============================================

const MAX_ENERGY = 6;
const BENCH_SIZE = 3;
const STARTING_HP = 30; // Player/AI base HP (damage flows to here when active fainted)

// ── Status effect helpers ─────────────────────
function applyEffect(effect, attacker, defender, state) {
  const logs = [];
  switch (effect) {
    case "poison":
      logs.push({ msg: `☠️ ${defender.name} is POISONED — 10 dmg/turn for 3 turns`, color: "#bf44ff" });
      return { defenderStatus: { ...defender.status, poison: 3 }, logs };
    case "shield":
      logs.push({ msg: `🛡️ ${attacker.name} raised FIREWALL — next hit blocked!`, color: "#00cfff" });
      return { attackerStatus: { ...attacker.status, shield: true }, logs };
    case "double":
      logs.push({ msg: `⚡ DUAL STRIKE — attacking twice!`, color: "#ffe100" });
      return { doubleStrike: true, logs };
    case "heal":
      const healAmt = 20;
      logs.push({ msg: `💊 ${attacker.name} restored ${healAmt} HP`, color: "#00ff88" });
      return { healSelf: healAmt, logs };
    case "drain":
      const drainAmt = 15;
      logs.push({ msg: `🩸 DATA DRAIN — stole ${drainAmt} HP`, color: "#ff2255" });
      return { drainHp: drainAmt, logs };
    case "weaken":
      logs.push({ msg: `🔓 ROOT OVERRIDE — enemy ATK -10 next turn`, color: "#ff8c00" });
      return { defenderStatus: { ...defender.status, weaken: true }, logs };
    case "stun":
      logs.push({ msg: `💀 KERNEL PANIC — enemy stunned, skips next turn!`, color: "#ff2255" });
      return { defenderStatus: { ...defender.status, stunned: true }, logs };
    case "reflect":
      logs.push({ msg: `🔄 PACKET MIRROR — reflecting 50% dmg next hit`, color: "#00cfff" });
      return { attackerStatus: { ...attacker.status, reflect: true }, logs };
    case "boost":
      logs.push({ msg: `🚀 OVERCLOCK — ATK +20 this turn!`, color: "#ff6eb0" });
      return { atkBoost: 20, logs };
    case "resurrect":
      logs.push({ msg: `♻️ BACKUP RESTORE — will survive one fatal blow!`, color: "#ffbb00" });
      return { attackerStatus: { ...attacker.status, resurrect: true }, logs };
    default:
      return { logs };
  }
}

// ── Full ScreenBattle component ────────────────
function ScreenBattle({ playerDeck, onClose, onWin, onLoss, difficulty = "normal" }) {
  // Battle state
  const [phase, setPhase]         = useState("setup"); // setup | battle | end
  const [turn, setTurn]           = useState("player");
  const [winner, setWinner]       = useState(null);
  const [busy, setBusy]           = useState(false);
  const [log, setLog]             = useState([]);
  const [animHit, setAnimHit]     = useState(null); // "player" | "enemy"

  // Player state
  const [pActive, setPActive]     = useState(null);   // active card
  const [pBench, setPBench]       = useState([]);     // bench (up to 3)
  const [pHand, setPHand]         = useState([]);     // hand
  const [pEnergy, setPEnergy]     = useState(0);
  const [pHP, setPHP]             = useState(30);     // player base HP
  const [pStatus, setPStatus]     = useState({});     // poison, shield, etc.
  const [pActiveHP, setPActiveHP] = useState(0);

  // Enemy state
  const [eActive, setEActive]     = useState(null);
  const [eBench, setEBench]       = useState([]);
  const [eEnergy, setEEnergy]     = useState(0);
  const [eStatus, setEStatus]     = useState({});
  const [eActiveHP, setEActiveHP] = useState(0);

  const [selectedAction, setSelectedAction] = useState(null); // "attack"|"ability"|"retreat"

  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const addLog = useCallback((msg, color = "#778899") => {
    setLog(prev => [...prev.slice(-40), { msg, color, id: Date.now() + Math.random() }]);
  }, []);

  // ── Init ──────────────────────────────────────
  const initBattle = () => {
    if (playerDeck.length < 4) return;
    const shuffled = [...playerDeck].sort(() => Math.random() - 0.5);
    const active = { ...shuffled[0] };
    const bench  = shuffled.slice(1, 4).map(c => ({ ...c }));
    const hand   = shuffled.slice(4, 8).map(c => ({ ...c }));

    const aiDeck = buildAiDeck(difficulty);
    const eAct   = { ...aiDeck[0] };
    const eBch   = aiDeck.slice(1, 4).map(c => ({ ...c }));

    setPActive(active); setPBench(bench); setPHand(hand);
    setEActive(eAct);   setEBench(eBch);
    setPActiveHP(active.hp); setEActiveHP(eAct.hp);
    setPHP(30); setEEnergy(2); setPEnergy(2);
    setPStatus({}); setEStatus({});
    setLog([]); setTurn("player"); setWinner(null); setBusy(false);
    setPhase("battle"); setSelectedAction(null);

    addLog("━━━ BATTLE INITIATED ━━━", "#00ff88");
    addLog(`> Your active: [${active.name}]`, "#00cfff");
    addLog(`> Enemy active: [${eAct.name}]`, "#ff2255");
    addLog("> Turn 1 — YOUR TURN. Choose an action.", "#778899");
  };

  // ── Compute damage ────────────────────────────
  const calcDmg = (attacker, defender, attackerStatus = {}, defenderStatus = {}) => {
    let atk = attacker.atk + (attackerStatus.atkBoost || 0);
    let def = defender.def;
    if (defenderStatus.weaken) atk = Math.max(1, atk - 10);
    const mult = getTypeMultiplier(attacker.family, defender.family);
    let dmg = Math.max(1, Math.round((atk - def * 0.5) * mult));
    // reflect
    let reflectDmg = 0;
    if (defenderStatus.reflect) { reflectDmg = Math.round(dmg * 0.5); dmg = Math.round(dmg * 0.5); }
    const effective = mult > 1 ? "SUPER EFFECTIVE" : mult < 1 ? "NOT VERY EFFECTIVE" : null;
    return { dmg, reflectDmg, effective };
  };

  // ── Player attacks ────────────────────────────
  const playerAttack = () => {
    if (busy || turn !== "player" || !pActive) return;
    if (pEnergy < 1) { addLog("> Not enough energy to attack!", "#ff2255"); return; }
    setBusy(true); setSelectedAction(null);

    const { dmg, reflectDmg, effective } = calcDmg(pActive, eActive, pStatus, eStatus);
    setPEnergy(e => Math.max(0, e - 1));

    if (effective) addLog(`> ⚡ ${effective}! ×${effective === "SUPER EFFECTIVE" ? "1.5" : "0.7"}`, effective === "SUPER EFFECTIVE" ? "#ffbb00" : "#778899");
    addLog(`> [${pActive.name}] attacks [${eActive.name}] for ${dmg} DMG`, "#00cfff");
    setAnimHit("enemy");
    setTimeout(() => setAnimHit(null), 450);

    // Apply dmg + status effects
    let newEHP = eActiveHP - dmg;
    // Drain
    if (pStatus.drain) { setPActiveHP(h => Math.min(pActive.hp, h + 15)); addLog(`> DATA DRAIN recovered 15 HP`, "#00ff88"); }
    // Reflect
    if (reflectDmg > 0) { addLog(`> 🔄 Reflected ${reflectDmg} dmg back at you!`, "#ff8c00"); setPActiveHP(h => h - reflectDmg); }
    setEStatus(s => { const n = { ...s }; delete n.reflect; delete n.weaken; return n; });

    if (newEHP <= 0) {
      setEActiveHP(0);
      addLog(`> [${eActive.name}] FAINTED!`, "#ff2255");
      setTimeout(() => promoteEnemyBench(), 500);
    } else {
      setEActiveHP(newEHP);
      // Poison tick
      if (eStatus.poison > 0) {
        setTimeout(() => {
          setEActiveHP(h => { const nh = Math.max(0, h - 10); addLog(`> ☠️ Poison deals 10 DMG [${nh} HP left]`, "#bf44ff"); return nh; });
          setEStatus(s => ({ ...s, poison: s.poison - 1 }));
        }, 200);
      }
      setTimeout(() => enemyTurn(), 900);
    }
  };

  // ── Player uses special ability ────────────────
  const playerAbility = () => {
    if (!pActive?.special || busy || turn !== "player") return;
    const cost = pActive.special.energyCost;
    if (pEnergy < cost) { addLog(`> Need ${cost} energy for ${pActive.special.name}!`, "#ff2255"); return; }
    setBusy(true); setSelectedAction(null);
    setPEnergy(e => Math.max(0, e - cost));
    addLog(`> [${pActive.name}] uses ${pActive.special.icon} ${pActive.special.name}!`, "#ffbb00");

    const result = applyEffect(pActive.special.effect, pActive, eActive, {});
    result.logs.forEach(l => addLog(l.msg, l.color));

    if (result.attackerStatus) setPStatus(s => ({ ...s, ...result.attackerStatus }));
    if (result.defenderStatus) setEStatus(s => ({ ...s, ...result.defenderStatus }));
    if (result.healSelf) setPActiveHP(h => Math.min(pActive.hp, h + result.healSelf));
    if (result.drainHp) { setEActiveHP(h => h - result.drainHp); setPActiveHP(h => Math.min(pActive.hp, h + result.drainHp)); }
    if (result.atkBoost) setPStatus(s => ({ ...s, atkBoost: result.atkBoost }));

    if (result.doubleStrike) {
      // attack twice immediately
      const { dmg: d1 } = calcDmg(pActive, eActive, { ...pStatus, atkBoost: 0 }, eStatus);
      const { dmg: d2 } = calcDmg(pActive, eActive, { ...pStatus, atkBoost: 0 }, eStatus);
      addLog(`> Strike 1: ${d1} DMG — Strike 2: ${d2} DMG`, "#ffe100");
      setEActiveHP(h => Math.max(0, h - d1 - d2));
    }

    setTimeout(() => enemyTurn(), 1000);
  };

  // ── Player retreat ─────────────────────────────
  const playerRetreat = (benchCard) => {
    if (busy || turn !== "player" || pEnergy < 2) { addLog("> Retreat costs 2 energy!", "#ff2255"); return; }
    if (!pBench.length) { addLog("> No bench cards to retreat to!", "#ff2255"); return; }
    setBusy(true); setSelectedAction(null);
    setPEnergy(e => e - 2);
    const oldActive = pActive;
    setPActive({ ...benchCard });
    setPActiveHP(benchCard.hp);
    setPBench(b => [...b.filter(c => c.id !== benchCard.id), oldActive]);
    addLog(`> 🔄 Retreated [${oldActive.name}] → [${benchCard.name}] active!`, "#00ff88");
    setTimeout(() => enemyTurn(), 800);
  };

  // ── Promote bench after faint ──────────────────
  const promoteEnemyBench = () => {
    if (eBench.length === 0) {
      addLog("━━━ ENEMY HAS NO MORE CARDS — VICTORY! ━━━", "#00ff88");
      setWinner("player"); setPhase("end"); setBusy(false);
      onWin?.(); return;
    }
    const next = eBench[0];
    setEActive({ ...next }); setEActiveHP(next.hp);
    setEBench(b => b.slice(1));
    setEStatus({});
    addLog(`> Enemy sends [${next.name}]!`, "#ff2255");
    setTimeout(() => { setTurn("player"); setBusy(false); addLog("> YOUR TURN", "#778899"); }, 500);
  };

  const promotePlayerBench = () => {
    if (pBench.length === 0) {
      addLog("━━━ YOU HAVE NO MORE CARDS — DEFEAT ━━━", "#ff2255");
      setWinner("ai"); setPhase("end"); setBusy(false);
      onLoss?.(); return;
    }
    const next = pBench[0];
    setPActive({ ...next }); setPActiveHP(next.hp);
    setPBench(b => b.slice(1));
    setPStatus({});
    addLog(`> You send [${next.name}]!`, "#00cfff");
  };

  // ── Enemy AI turn ──────────────────────────────
  const enemyTurn = useCallback(() => {
    setTurn("ai");
    setPStatus(s => { const n = { ...s }; delete n.atkBoost; return n; });

    setTimeout(() => {
      setEActive(eAct => {
        setEStatus(eStat => {
          // Stun check
          if (eStat.stunned) {
            addLog(`> 💀 Enemy is STUNNED — skips turn!`, "#bf44ff");
            const n = { ...eStat }; delete n.stunned;
            setEStatus(n);
            setEEnergy(e => Math.min(MAX_ENERGY, e + 2));
            setTurn("player"); setBusy(false);
            addLog("> YOUR TURN", "#778899");
            return n;
          }

          // Gain energy
          const gain = 1 + Math.floor(Math.random() * 2);
          setEEnergy(e => {
            const newE = Math.min(MAX_ENERGY, e + gain);

            // AI decision: use special if energy allows and hp < 50%
            setPActiveHP(pHP => {
              setEActiveHP(eHP => {
                const useSpecial = eAct?.special && newE >= eAct.special.energyCost && eHP < eAct.hp * 0.5 && Math.random() > 0.4;

                if (useSpecial) {
                  addLog(`> AI uses ${eAct.special.icon} ${eAct.special.name}!`, "#ff8c00");
                  setEEnergy(ee => Math.max(0, ee - eAct.special.energyCost));
                  const r = applyEffect(eAct.special.effect, eAct, { name: "You" }, {});
                  r.logs.forEach(l => addLog(l.msg, l.color));
                  if (r.healSelf) { addLog(`> Enemy restored ${r.healSelf} HP`, "#ff2255"); return eHP; }
                } else if (newE >= 1) {
                  // Normal attack
                  setPActive(pAct => {
                    if (!pAct) return pAct;
                    const { dmg, reflectDmg, effective } = calcDmg(eAct, pAct, eStat, pStatus);
                    setEEnergy(ee => Math.max(0, ee - 1));
                    if (effective) addLog(`> AI: ⚡ ${effective}!`, effective === "SUPER EFFECTIVE" ? "#ffbb00" : "#778899");
                    addLog(`> AI [${eAct.name}] attacks [${pAct.name}] for ${dmg} DMG`, "#ff2255");
                    setAnimHit("player");
                    setTimeout(() => setAnimHit(null), 450);

                    let newPHP = pHP - dmg;
                    if (reflectDmg > 0) { addLog(`> 🔄 Reflected ${reflectDmg} back at enemy!`, "#00cfff"); setEActiveHP(h => h - reflectDmg); }

                    // Poison tick on player
                    if (pStatus?.poison > 0) {
                      newPHP -= 10;
                      addLog(`> ☠️ Your card takes 10 poison DMG`, "#bf44ff");
                      setPStatus(s => ({ ...s, poison: s.poison - 1 }));
                    }

                    if (newPHP <= 0) {
                      addLog(`> [${pAct.name}] FAINTED!`, "#ff2255");
                      setTimeout(() => promotePlayerBench(), 400);
                    }
                    return pHP; // we'll update through setPActiveHP
                  });
                  return Math.max(0, pHP - (calcDmg(eAct, pActive || {atk:10,def:5,family:"Common"}, eStat, pStatus).dmg));
                }
                return pHP;
              });
              return pHP;
            });

            return newE;
          });

          setTimeout(() => {
            setTurn("player"); setBusy(false);
            addLog("> YOUR TURN", "#778899");
          }, 600);
          return eStat;
        });
        return eAct;
      });
    }, 800);
  }, [pStatus, eStatus, pActive]);

  // ── Start of turn: gain energy ─────────────────
  useEffect(() => {
    if (phase === "battle" && turn === "player" && !busy) {
      const gain = 1 + Math.floor(Math.random() * 2);
      setPEnergy(e => Math.min(MAX_ENERGY, e + gain));
      if (gain > 1) addLog(`> +${gain} energy gained`, "#334455");
    }
  }, [turn, phase]);

  const diffLabel = { easy: "ROOKIE", normal: "HACKER", hard: "ELITE" }[difficulty] || "HACKER";

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 100, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="screen-hdr">
        <span className="screen-title" style={{ color: "#ff2255" }}>⚔️ BATTLE — {diffLabel}</span>
        <Btn color="#ff2255" onClick={onClose} sm>EXIT</Btn>
      </div>

      {/* SETUP */}
      {phase === "setup" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 24 }}>
          <div style={{ fontFamily: "var(--font-d)", fontSize: 22, color: "#ff2255", letterSpacing: 4, animation: "glitch 4s infinite" }}>
            SYS://BATTLE
          </div>
          <div style={{ color: "#445566", fontSize: 11, fontFamily: "var(--font-d)" }}>DIFFICULTY: {diffLabel}</div>
          {playerDeck.length >= 4 ? (
            <>
              <div style={{ color: "#445566", fontSize: 11 }}>Deck: {playerDeck.length} cards ready</div>
              <Btn color="#ff2255" onClick={initBattle}>INITIATE BATTLE</Btn>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#ff2255", fontSize: 12, marginBottom: 8, fontFamily: "var(--font-d)" }}>INSUFFICIENT DECK</div>
              <div style={{ color: "#334455", fontSize: 10 }}>Build a deck of at least 4 cards first.</div>
            </div>
          )}
        </div>
      )}

      {/* BATTLE */}
      {(phase === "battle" || phase === "end") && (
        <div className="battle-field">
          {/* Enemy zone */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #0a1a2a", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "#ff2255", letterSpacing: 2 }}>ENEMY</div>
              <EnergyPips current={Math.min(eEnergy, MAX_ENERGY)} max={MAX_ENERGY} color="#ff2255" />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* Enemy bench */}
              <div style={{ display: "flex", gap: 6 }}>
                {eBench.map((c, i) => <Card key={i} card={c} size="small" />)}
                {Array.from({ length: Math.max(0, 3 - eBench.length) }).map((_, i) => (
                  <div key={`ep${i}`} style={{ width: 87, height: 127, border: "1px dashed #0a1a2a", borderRadius: 7 }} />
                ))}
              </div>
              {/* Enemy active */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {eActive && (
                  <>
                    <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
                      {eStatus.poison > 0 && <span className="status-badge" style={{ color: "#bf44ff" }}>POISON {eStatus.poison}</span>}
                      {eStatus.shield && <span className="status-badge" style={{ color: "#00cfff" }}>SHIELD</span>}
                      {eStatus.stunned && <span className="status-badge" style={{ color: "#ff2255" }}>STUN</span>}
                    </div>
                    <Card card={eActive} size="battle" hitting={animHit === "enemy"} />
                    <HPBar current={eActiveHP} max={eActive.hp} color={eActive.rarityColor} />
                    <div style={{ fontSize: 9, color: "#445566" }}>{eActiveHP}/{eActive.hp} HP</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Battle log */}
          <div ref={logRef} style={{
            flex: 1, padding: "8px 14px", overflowY: "auto",
            background: "rgba(0,0,0,0.3)", fontFamily: "var(--font-b)",
          }}>
            {log.map(e => (
              <div key={e.id} style={{ color: e.color, fontSize: 10, lineHeight: 2, borderBottom: "1px solid #05050f" }}>
                {e.msg}
              </div>
            ))}
          </div>

          {/* Player zone */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #0a1a2a", flexShrink: 0 }}>
            {/* Player active + energy */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "#00ff88", letterSpacing: 2 }}>YOU</div>
              <EnergyPips current={Math.min(pEnergy, MAX_ENERGY)} max={MAX_ENERGY} color="#00ff88" />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* Player active */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {pActive && (
                  <>
                    <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
                      {pStatus.poison > 0 && <span className="status-badge" style={{ color: "#bf44ff" }}>POISON {pStatus.poison}</span>}
                      {pStatus.shield && <span className="status-badge" style={{ color: "#00cfff" }}>SHIELD</span>}
                      {pStatus.reflect && <span className="status-badge" style={{ color: "#00cfff" }}>REFLECT</span>}
                    </div>
                    <Card card={pActive} size="battle" hitting={animHit === "player"} />
                    <HPBar current={pActiveHP} max={pActive.hp} color={pActive.rarityColor} />
                    <div style={{ fontSize: 9, color: "#445566" }}>{pActiveHP}/{pActive.hp} HP</div>
                  </>
                )}
              </div>

              {/* Player bench */}
              <div style={{ display: "flex", gap: 6 }}>
                {pBench.map((c, i) => (
                  <div key={i} style={{ cursor: selectedAction === "retreat" ? "pointer" : "default" }}
                    onClick={() => selectedAction === "retreat" && playerRetreat(c)}>
                    <Card card={c} size="small" selected={selectedAction === "retreat"} />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - pBench.length) }).map((_, i) => (
                  <div key={`pp${i}`} style={{ width: 87, height: 127, border: "1px dashed #0a1a2a", borderRadius: 7 }} />
                ))}
              </div>
            </div>

            {/* Action buttons */}
            {phase === "battle" && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <Btn color="#00ff88" onClick={playerAttack} disabled={busy || turn !== "player" || pEnergy < 1} sm>
                  ⚔️ ATTACK (1⚡)
                </Btn>
                {pActive?.special && (
                  <Btn color={pActive.familyColor} onClick={playerAbility}
                    disabled={busy || turn !== "player" || pEnergy < pActive.special.energyCost} sm>
                    {pActive.special.icon} {pActive.special.name} ({pActive.special.energyCost}⚡)
                  </Btn>
                )}
                <Btn color="#ff8c00"
                  onClick={() => setSelectedAction(a => a === "retreat" ? null : "retreat")}
                  disabled={busy || turn !== "player" || pEnergy < 2 || pBench.length === 0} sm>
                  🔄 RETREAT (2⚡)
                </Btn>
              </div>
            )}
            {selectedAction === "retreat" && (
              <div style={{ fontSize: 9, color: "#ff8c00", marginTop: 4, fontFamily: "var(--font-d)" }}>
                ↑ Click a bench card to retreat to it
              </div>
            )}
          </div>
        </div>
      )}

      {/* END screen — overlay absolu sur le battle-field */}
      {phase === "end" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
          background: "rgba(3,3,10,0.97)",
          padding: 32,
        }}>
          {/* Résultat */}
          <div style={{
            fontFamily: "var(--font-d)", fontSize: 32,
            color: winner === "player" ? "#00ff88" : "#ff2255",
            letterSpacing: 6,
            textShadow: `0 0 30px ${winner === "player" ? "#00ff8866" : "#ff225566"}`,
            animation: "glitch 3s infinite",
          }}>
            {winner === "player" ? "VICTORY!" : "DEFEATED"}
          </div>

          {/* Sous-titre */}
          <div style={{ color: "#445566", fontSize: 12, fontFamily: "var(--font-d)", letterSpacing: 2 }}>
            {winner === "player"
              ? "ROOT ACCESS GRANTED — +100 XP +1 TOKEN"
              : "CONNECTION LOST — +20 XP"}
          </div>

          {/* Stats de la bataille */}
          <div style={{
            padding: "16px 24px", borderRadius: 8,
            background: "rgba(0,0,0,0.5)", border: "1px solid #0a1a2a",
            display: "flex", gap: 32, textAlign: "center",
          }}>
            {[
              ["RÉSULTAT", winner === "player" ? "WIN" : "LOSS", winner === "player" ? "#00ff88" : "#ff2255"],
              ["XP GAGNÉ", winner === "player" ? "+100" : "+20", "#ffbb00"],
              ["TOKEN", winner === "player" ? "+1" : "+0", "#bf44ff"],
            ].map(([label, val, color]) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-d)", fontSize: 8, color: "#334455", letterSpacing: 2, marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: "var(--font-d)", fontSize: 18, color, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Boutons */}
          <div style={{ display: "flex", gap: 16 }}>
            <Btn color="#00cfff" onClick={initBattle}>⚔️ REVANCHE</Btn>
            <Btn color="#ff2255" onClick={onClose}>EXIT</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
