// js/api.js — All API calls — v0.4 merged routes
// ⚠️  Remplace l'URL par celle de ton déploiement Vercel
const API_BASE = "https://syscard-api.vercel.app/api";
// Dev local : const API_BASE = "http://localhost:3000/api";

async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem("syscard_token");
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

const API = {

  // ── Auth (/api/auth) ──────────────────────────
  register: (username, password) =>
    apiFetch("/auth", { method:"POST", body:{ action:"register", username, password } }),

  login: (username, password) =>
    apiFetch("/auth", { method:"POST", body:{ action:"login", username, password } }),

  // ── User — profil perso (/api/user) ───────────
  // GET /api/user → profil du joueur connecté (auto-login)
  getMyProfile: () => apiFetch("/user"),

  // Alias gardé pour compatibilité avec app.js existant
  getProfile: () => apiFetch("/user"),

  updateProfile: (patch) =>
    apiFetch("/user", { method:"POST", body: patch }),

  // ── User — profil PUBLIC (/api/user?profile=) ─
  // GET /api/user?profile=username
  getPublicProfile: (username) =>
    apiFetch(`/user?profile=${encodeURIComponent(username)}`),

  // ── Leaderboard (/api/user?leaderboard=1) ────
  // GET /api/user?leaderboard=1
  getLeaderboard: () => apiFetch("/user?leaderboard=1"),

  // ── Notifications (/api/user?notifs=1) ───────
  // GET /api/user?notifs=1
  getNotifications: () => apiFetch("/user?notifs=1"),

  readAllNotifications: () =>
    apiFetch("/user", { method:"POST", body:{ action:"read_all" } }),

  clearNotifications: () =>
    apiFetch("/user", { method:"POST", body:{ action:"clear" } }),

  // ── Packs (/api/packs) ────────────────────────
  openPack: (packType, qty = 1, useTokens = false, family = null) =>
    apiFetch("/packs", { method:"POST", body:{ packType, quantity:qty, useTokens, family } }),

  // ── Trades (/api/trades) ──────────────────────
  listTrades: (mine = false) =>
    apiFetch(`/trades?mine=${mine ? 1 : 0}`),

  createTrade: (offeredCardId, wantedRarity) =>
    apiFetch("/trades", { method:"POST", body:{ action:"create", offeredCardId, wantedRarity } }),

  acceptTrade: (tradeId, myCardId) =>
    apiFetch("/trades", { method:"POST", body:{ action:"accept", tradeId, myCardId } }),

  cancelTrade: (tradeId) =>
    apiFetch("/trades", { method:"POST", body:{ action:"cancel", tradeId } }),

  // ── Battle PvP (/api/tournament) ─────────────
  // ⚠️  Toutes les actions battle passent maintenant par /tournament
  createBattle: (deck) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"create", deck } }),

  joinBattle: (roomId, deck) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"join", roomId, deck } }),

  pollBattle: (roomId) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"poll", roomId } }),

  submitMove: (roomId, move) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"submit", roomId, move } }),

  listRooms: () =>
    apiFetch("/tournament", { method:"POST", body:{ action:"list" } }),

  forfeit: (roomId) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"forfeit", roomId } }),

  applyElo: (winnerName, loserName) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"apply_elo", winnerName, loserName } }),

  // ── Tournois (/api/tournament) ────────────────
  getTournaments: () =>
    apiFetch("/tournament", { method:"POST", body:{ action:"tournament_list" } }),

  joinTournament: (tournamentId) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"tournament_join", tournamentId } }),

  leaveTournament: (tournamentId) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"tournament_leave", tournamentId } }),

  createTournament: (name, size, prizeCoins, prizeTokens) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"tournament_create", name, size, prizeCoins, prizeTokens } }),

  // ── Admin (/api/admin) ────────────────────────
  adminAction: (action, targetUser, value) =>
    apiFetch("/admin", { method:"POST", body:{ action, targetUser, value } }),

  // ── Quêtes (/api/quests) ──────────────────────
  getQuests: () => apiFetch("/quests"),

  progressQuest: (type, amount = 1) =>
    apiFetch("/quests", { method:"POST", body:{ action:"progress", type, amount } }),

  claimQuest: (questId) =>
    apiFetch("/quests", { method:"POST", body:{ action:"claim", questId } }),

  // ── Boutique (/api/shop) ──────────────────────
  getShop: () => apiFetch("/shop"),

  buyShopItem: (itemId, quantity = 1) =>
    apiFetch("/shop", { method:"POST", body:{ action:"buy", itemId, quantity } }),

};
