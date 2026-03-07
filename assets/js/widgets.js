/**
 * WIDGETS.JS - Spotify + Steam APIs
 * Client-side only (GitHub Pages compatible)
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    spotify: {
        clientId: 'YOUR_SPOTIFY_CLIENT_ID', // À configurer
        redirectUri: window.location.origin,
        scopes: 'user-read-currently-playing user-read-playback-state',
    },
    steam: {
        steamId: '76561198XXXXXXXX', // Ton Steam ID
        apiKey: 'YOUR_STEAM_API_KEY', // À configurer
    }
};

// ============================================
// SPOTIFY NOW PLAYING
// ============================================

class SpotifyWidget {
    constructor() {
        this.accessToken = localStorage.getItem('spotify_access_token');
        this.refreshToken = localStorage.getItem('spotify_refresh_token');
    }

    // Authentification Spotify
    async authenticate() {
        if (!this.accessToken) {
            // Redirect vers Spotify OAuth
            const authUrl = `https://accounts.spotify.com/authorize?` +
                `client_id=${CONFIG.spotify.clientId}&` +
                `response_type=token&` +
                `redirect_uri=${encodeURIComponent(CONFIG.spotify.redirectUri)}&` +
                `scope=${encodeURIComponent(CONFIG.spotify.scopes)}`;
            
            window.location.href = authUrl;
        }
    }

    // Récupérer le token depuis URL (après redirect)
    handleCallback() {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');
        
        if (token) {
            localStorage.setItem('spotify_access_token', token);
            this.accessToken = token;
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Récupérer la track en cours
    async getCurrentTrack() {
        if (!this.accessToken) return null;

        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (response.status === 204) {
                // Rien n'est en lecture
                return { isPlaying: false };
            }

            if (response.status === 401) {
                // Token expiré
                localStorage.removeItem('spotify_access_token');
                this.accessToken = null;
                return null;
            }

            const data = await response.json();
            
            return {
                isPlaying: data.is_playing,
                track: data.item.name,
                artist: data.item.artists.map(a => a.name).join(', '),
                album: data.item.album.name,
                albumArt: data.item.album.images[0]?.url,
                duration: data.item.duration_ms,
                progress: data.progress_ms,
                url: data.item.external_urls.spotify
            };

        } catch (error) {
            console.error('Spotify API Error:', error);
            return null;
        }
    }

    // Mettre à jour le widget
    async updateWidget() {
        const widget = document.getElementById('spotify-widget');
        if (!widget) return;

        const track = await this.getCurrentTrack();

        if (!track || !track.isPlaying) {
            widget.innerHTML = `
                <div class="widget-content">
                    <div class="widget-icon">🎵</div>
                    <div class="widget-info">
                        <div class="widget-label">LISTENING</div>
                        <div class="widget-status">Not playing</div>
                    </div>
                </div>
            `;
            return;
        }

        // Afficher la track
        widget.innerHTML = `
            <div class="widget-content">
                ${track.albumArt ? `<img src="${track.albumArt}" class="album-art" alt="Album">` : '<div class="widget-icon">🎵</div>'}
                <div class="widget-info">
                    <div class="widget-label">LISTENING</div>
                    <div class="track-title">${track.track}</div>
                    <div class="track-artist">${track.artist}</div>
                    ${track.url ? `<a href="${track.url}" target="_blank" class="spotify-link">Open in Spotify →</a>` : ''}
                </div>
            </div>
        `;
    }

    // Démarrer updates automatiques
    startAutoUpdate(interval = 30000) {
        this.updateWidget();
        setInterval(() => this.updateWidget(), interval);
    }
}

// ============================================
// STEAM WIDGET
// ============================================

class SteamWidget {
    constructor() {
        this.steamId = CONFIG.steam.steamId;
        this.apiKey = CONFIG.steam.apiKey;
    }

    // Récupérer jeux récents
    async getRecentGames() {
        try {
            // Note: Steam API a des restrictions CORS
            // On utilise un proxy public ou on cache les données
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const apiUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${this.apiKey}&steamid=${this.steamId}&format=json`;
            
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            const data = await response.json();

            if (!data.response || !data.response.games || data.response.games.length === 0) {
                return null;
            }

            // Jeu le plus récent
            const game = data.response.games[0];
            
            return {
                name: game.name,
                appId: game.appid,
                playtime: Math.round(game.playtime_forever / 60), // en heures
                playtime2weeks: Math.round((game.playtime_2weeks || 0) / 60),
                lastPlayed: new Date(game.rtime_last_played * 1000),
                icon: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
            };

        } catch (error) {
            console.error('Steam API Error:', error);
            return null;
        }
    }

    // Mettre à jour le widget
    async updateWidget() {
        const widget = document.getElementById('steam-widget');
        if (!widget) return;

        const game = await this.getRecentGames();

        if (!game) {
            widget.innerHTML = `
                <div class="widget-content">
                    <div class="widget-icon">🎮</div>
                    <div class="widget-info">
                        <div class="widget-label">PLAYING</div>
                        <div class="widget-status">No recent activity</div>
                    </div>
                </div>
            `;
            return;
        }

        // Calculer "last played"
        const now = new Date();
        const diffMs = now - game.lastPlayed;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        let timeAgo;
        if (diffHours < 1) timeAgo = 'Just now';
        else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
        else timeAgo = `${Math.floor(diffHours / 24)}d ago`;

        widget.innerHTML = `
            <div class="widget-content">
                ${game.icon ? `<img src="${game.icon}" class="game-icon" alt="${game.name}">` : '<div class="widget-icon">🎮</div>'}
                <div class="widget-info">
                    <div class="widget-label">PLAYING</div>
                    <div class="game-title">${game.name}</div>
                    <div class="game-meta">Last played: ${timeAgo}</div>
                    <div class="game-playtime">${game.playtime}h total</div>
                </div>
            </div>
        `;
    }

    // Stats détaillées pour page /gaming
    async getDetailedStats() {
        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${this.apiKey}&steamid=${this.steamId}&include_appinfo=1&format=json`;
            
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            const data = await response.json();

            if (!data.response || !data.response.games) {
                return null;
            }

            const games = data.response.games;
            
            // Calculer stats
            const totalGames = games.length;
            const totalHours = games.reduce((sum, g) => sum + (g.playtime_forever || 0), 0) / 60;
            const topGames = games
                .sort((a, b) => b.playtime_forever - a.playtime_forever)
                .slice(0, 10)
                .map(g => ({
                    name: g.name,
                    hours: Math.round(g.playtime_forever / 60),
                    appId: g.appid
                }));

            return {
                totalGames,
                totalHours: Math.round(totalHours),
                topGames
            };

        } catch (error) {
            console.error('Steam Stats Error:', error);
            return null;
        }
    }

    // Démarrer updates
    startAutoUpdate(interval = 60000) {
        this.updateWidget();
        setInterval(() => this.updateWidget(), interval);
    }
}

// ============================================
// INITIALISATION
// ============================================

let spotify, steam;

window.addEventListener('DOMContentLoaded', () => {
    // Init Spotify
    spotify = new SpotifyWidget();
    spotify.handleCallback(); // Check for OAuth callback
    spotify.startAutoUpdate(30000); // Update every 30s

    // Init Steam
    steam = new SteamWidget();
    steam.startAutoUpdate(60000); // Update every 60s

    // Bouton connexion Spotify (si pas encore connecté)
    const spotifyBtn = document.getElementById('spotify-connect-btn');
    if (spotifyBtn && !spotify.accessToken) {
        spotifyBtn.addEventListener('click', () => spotify.authenticate());
    }
});

// Export pour utilisation ailleurs
window.SpotifyWidget = SpotifyWidget;
window.SteamWidget = SteamWidget;
