const PLAYLIST_DATA = [
    { title: "Like a Boss ", artist: "Holy Priest", url: "https://file.garden/aV0_VKVaP2fvnrU0/HOLY%20PRIEST%2C%20Lil%20Texas%20-%20Like%20A%20Boss.mp3" },
    { title: "Parisienne", artist: "Gims", url: "https://file.garden/aV0_VKVaP2fvnrU0/GIMS%20-%20PARISIENNE.mp3" },
    { title: "Overton", artist: "Gims", url: "https://file.garden/aV0_VKVaP2fvnrU0/GIMS%20-%20OVERTON.mp3" },
];

class AudioEngine {
    constructor(playlist) {
        this.playlist = playlist;
        this.currentIndex = 0;
        this.isPlaying = false;

        // Éléments DOM
        this.audio = document.getElementById('main-audio');
        this.playBtn = document.getElementById('play-pause-btn');
        this.seekSlider = document.getElementById('seek-slider');
        this.volSlider = document.getElementById('volume-slider');
        this.titleDisplay = document.getElementById('track-title');
        this.artistDisplay = document.getElementById('track-artist');
        this.listContainer = document.getElementById('playlist-list');

        this.init();
    }

    init() {
        this.renderPlaylist();
        this.loadTrack(this.currentIndex);
        this.setupEventListeners();
    }

    renderPlaylist() {
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${track.title}`;
            li.dataset.index = index;
            li.addEventListener('click', () => this.jumpTo(index));
            this.listContainer.appendChild(li);
        });
    }

    loadTrack(index) {
        this.currentIndex = index;
        const track = this.playlist[index];
        this.audio.src = track.url;
        this.titleDisplay.textContent = track.title;
        this.artistDisplay.textContent = track.artist;
        
        // Mise à jour visuelle de la playlist
        Array.from(this.listContainer.children).forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
    }

    setupEventListeners() {
        // Lecture / Pause
        this.playBtn.addEventListener('click', () => this.togglePlay());

        // Navigation
        document.getElementById('next-btn').addEventListener('click', () => this.next());
        document.getElementById('prev-btn').addEventListener('click', () => this.prev());

        // Mise à jour du temps de lecture
        this.audio.addEventListener('timeupdate', () => {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.seekSlider.value = progress || 0;
            this.updateTimeLabels();
        });

        // Recherche manuelle
        this.seekSlider.addEventListener('input', () => {
            const time = (this.seekSlider.value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        });

        // Volume
        this.volSlider.addEventListener('input', () => {
            this.audio.volume = this.volSlider.value / 100;
        });

        // Enchaînement automatique
        this.audio.addEventListener('ended', () => this.next(true));
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play().catch(e => console.error("Interaction requise"));
            this.playBtn.textContent = "Pause";
        } else {
            this.audio.pause();
            this.playBtn.textContent = "Play";
        }
    }

    next(auto = false) {
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentIndex);
        if (auto || !this.audio.paused) this.audio.play();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentIndex);
        this.audio.play();
    }

    jumpTo(index) {
        this.loadTrack(index);
        this.audio.play();
        this.playBtn.textContent = "Pause";
    }

    updateTimeLabels() {
        const current = document.getElementById('current-time');
        const duration = document.getElementById('duration-time');
        
        current.textContent = this.formatTime(this.audio.currentTime);
        if (this.audio.duration) {
            duration.textContent = this.formatTime(this.audio.duration);
        }
    }

    formatTime(secs) {
        const min = Math.floor(secs / 60);
        const sec = Math.floor(secs % 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
}

// Lancement
document.addEventListener('DOMContentLoaded', () => {
    new AudioEngine(PLAYLIST_DATA);
});