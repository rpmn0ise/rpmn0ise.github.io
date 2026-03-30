// js/api.js — All API calls
// Set this to your Vercel URL after deployment
const API_BASE = "https://syscard-api.vercel.app/api";
// During local dev, use: const API_BASE = "http://localhost:3000/api";

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
  // ── Auth ────────────────────────────────────
  register: (username, password) =>
    apiFetch("/auth", { method: "POST", body: { action: "register", username, password } }),

  login: (username, password) =>
    apiFetch("/auth", { method: "POST", body: { action: "login", username, password } }),

  // ── User ────────────────────────────────────
  getProfile: () => apiFetch("/user"),

  updateProfile: (patch) =>
    apiFetch("/user", { method: "POST", body: patch }),

  // ── Packs ────────────────────────────────────
  openPack: (packType, qty = 1, useTokens = false, family = null) =>
    apiFetch("/packs", { method: "POST", body: { packType, quantity: qty, useTokens, family } }),

  // ── Trades ────────────────────────────────────
  listTrades: (mine = false) =>
    apiFetch(`/trades?mine=${mine ? 1 : 0}`),

  createTrade: (offeredCardId, wantedRarity) =>
    apiFetch("/trades", { method: "POST", body: { action: "create", offeredCardId, wantedRarity } }),

  acceptTrade: (tradeId, myCardId) =>
    apiFetch("/trades", { method: "POST", body: { action: "accept", tradeId, myCardId } }),

  cancelTrade: (tradeId) =>
    apiFetch("/trades", { method: "POST", body: { action: "cancel", tradeId } }),

  // ── Battle ────────────────────────────────────
  createBattle: (deck) =>
    apiFetch("/battle", { method: "POST", body: { action: "create", deck } }),

  joinBattle: (roomId, deck) =>
    apiFetch("/battle", { method: "POST", body: { action: "join", roomId, deck } }),

  pollBattle: (roomId) =>
    apiFetch("/battle", { method: "POST", body: { action: "poll", roomId } }),

  submitMove: (roomId, move) =>
    apiFetch("/battle", { method: "POST", body: { action: "submit", roomId, move } }),

  listRooms: () =>
    apiFetch("/battle", { method: "POST", body: { action: "list" } }),

  forfeit: (roomId) =>
    apiFetch("/battle", { method: "POST", body: { action: "forfeit", roomId } }),

  // ── Admin ────────────────────────────────────
  adminAction: (action, targetUser, value) =>
    apiFetch("/admin", { method: "POST", body: { action, targetUser, value } }),
};

  // ── v0.4 additions ────────────────────────────
  getLeaderboard: () =>
    apiFetch("/profile?leaderboard=1"),

  getProfile: (username) =>
    apiFetch(`/profile?username=${encodeURIComponent(username)}`),

  getQuests: () => apiFetch("/quests"),

  progressQuest: (type, amount = 1) =>
    apiFetch("/quests", { method:"POST", body:{ action:"progress", type, amount } }),

  claimQuest: (questId) =>
    apiFetch("/quests", { method:"POST", body:{ action:"claim", questId } }),

  getShop: () => apiFetch("/shop"),

  buyShopItem: (itemId, quantity = 1) =>
    apiFetch("/shop", { method:"POST", body:{ action:"buy", itemId, quantity } }),

  getTournaments: () =>
    apiFetch("/tournament", { method:"POST", body:{ action:"list" } }),

  joinTournament: (tournamentId) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"join", tournamentId } }),

  leaveTournament: (tournamentId) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"leave", tournamentId } }),

  createTournament: (name, size, prizeCoins, prizeTokens) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"create", name, size, prizeCoins, prizeTokens } }),

  applyElo: (winnerName, loserName) =>
    apiFetch("/tournament", { method:"POST", body:{ action:"apply_elo", winnerName, loserName } }),

  getNotifications: () => apiFetch("/notifications"),

  readAllNotifications: () =>
    apiFetch("/notifications", { method:"POST", body:{ action:"read_all" } }),

  clearNotifications: () =>
    apiFetch("/notifications", { method:"POST", body:{ action:"clear" } }),
